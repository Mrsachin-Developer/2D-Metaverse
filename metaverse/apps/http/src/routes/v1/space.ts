import { RequestHandler, Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
export const spaceRouter = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

spaceRouter.post("/", userMiddleware, asyncHandler(async (req, res) => {
    console.log("endopibnt")
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(JSON.stringify(parsedData))
        res.status(400).json({message: "Validation failed"})
        return
    }

    if (!parsedData.data.mapId) {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        });
        res.json({spaceId: space.id})
        return;
    }
    
    const map = await client.map.findFirst({
        where: {
            id: parsedData.data.mapId
        }, select: {
            mapElements: true,
            width: true,
            height: true
        }
    })
    console.log("after")
    if (!map) {
        res.status(400).json({message: "Map not found"})
        return
    }
    if (map.mapElements.some(element => element.x === null || element.y === null)) {
        res.status(400).json({message: "Map elements must have coordinates"})
        return
    }
    console.log("map.mapElements.length")
    console.log(map.mapElements.length)
    const space = await client.$transaction(async (tx) => {
        const space = await tx.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        });

        await tx.spaceElements.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!
            }))
        })

        return space;

    })
    console.log("space crated")
    res.json({spaceId: space.id})
}))


spaceRouter.delete("/element", userMiddleware, asyncHandler(async (req, res) => {
    console.log("spaceElement?.space1 ")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        }, 
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
    await client.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({message: "Element deleted"})
}))

spaceRouter.delete("/:spaceId", userMiddleware, asyncHandler(async (req, res) => {
    const spaceId = Array.isArray(req.params.spaceId) ? req.params.spaceId[0] : req.params.spaceId;
    if (!spaceId) {
        res.status(400).json({message: "Space not found"})
        return
    }
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }, select: {
            creatorId: true
        }
    })
    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    if (space.creatorId !== req.userId) {
        console.log("code should reach here")
        res.status(403).json({message: "Unauthorized"})
        return
    }

    await client.$transaction(async (tx) => {
        await tx.spaceElements.deleteMany({
            where: { spaceId }
        });
        await tx.space.delete({
            where: { id: spaceId }
        });
    })
    res.json({message: "Space deleted"})
}))

spaceRouter.get("/all", userMiddleware, asyncHandler(async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId!
        }
    });

    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
        }))
    })

    
}))

spaceRouter.post("/element", userMiddleware, asyncHandler(async (req, res) => {
    const parsedData = AddElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const space = await client.space.findUnique({
        where: {
            id: parsedData.data.spaceId,
            creatorId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    if (!Number.isInteger(parsedData.data.x) || !Number.isInteger(parsedData.data.y)) {
        res.status(400).json({message: "Coordinates must be integers"})
        return
    }

    const element = await client.element.findUnique({
        where: { id: parsedData.data.elementId },
        select: { width: true, height: true }
    });
    if (!element) {
        res.status(400).json({message: "Element not found"})
        return
    }

    if (
        parsedData.data.x < 0 ||
        parsedData.data.y < 0 ||
        parsedData.data.x + element.width > space.width ||
        parsedData.data.y + element.height > space.height
    ) {
        res.status(400).json({message: "Point is outside of the boundary"})
        return
    }

    await client.spaceElements.create({
        data: {
            spaceId: parsedData.data.spaceId,
            elementId: parsedData.data.elementId,
            x: parsedData.data.x,
            y: parsedData.data.y
        }
    })

    res.json({message: "Element added"})
}))

spaceRouter.get("/:spaceId", asyncHandler(async (req, res) => {
    const spaceId = Array.isArray(req.params.spaceId) ? req.params.spaceId[0] : req.params.spaceId;
    if (!spaceId) {
        res.status(400).json({message: "Space not found"})
        return
    }
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
    })

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        })),
    })
}))