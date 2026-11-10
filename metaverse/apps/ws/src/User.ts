import { randomUUID } from "node:crypto";
import type { RawData, WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import type { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class User {
    public readonly id = randomUUID();
    public userId?: string;
    private spaceId?: string;
    private spaceWidth?: number;
    private spaceHeight?: number;
    private x = 0;
    private y = 0;
    private readonly ws: WebSocket;
    private messageQueue: Promise<void> = Promise.resolve();

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.initHandlers();
    }

    private initHandlers() {
        this.ws.on("message", (data) => {
            this.messageQueue = this.messageQueue
                .then(() => this.handleMessage(data))
                .catch((error: unknown) => {
                    console.error("WebSocket message handling failed:", error);
                    this.close(1011, "Internal server error");
                });
        });
    }

    private async handleMessage(data: RawData) {
        let message: unknown;
        try {
            message = JSON.parse(data.toString());
        } catch {
            this.close(1003, "Invalid JSON");
            return;
        }

        if (!isJsonObject(message) || typeof message.type !== "string" || !isJsonObject(message.payload)) {
            this.close(1008, "Invalid message");
            return;
        }

        switch (message.type) {
            case "join":
                await this.join(message.payload);
                return;
            case "move":
                this.move(message.payload);
                return;
            default:
                this.close(1008, "Unsupported message type");
        }
    }

    private async join(payload: JsonObject) {
        const { spaceId, token } = payload;
        if (typeof spaceId !== "string" || !spaceId || typeof token !== "string" || !token) {
            this.close(1008, "Invalid join request");
            return;
        }

        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_PASSWORD);
        } catch {
            this.close(1008, "Unauthorized");
            return;
        }
        if (typeof decoded === "string" || typeof decoded.userId !== "string" || !decoded.userId) {
            this.close(1008, "Unauthorized");
            return;
        }

        const space = await client.space.findUnique({
            where: { id: spaceId },
            select: { id: true, width: true, height: true }
        });
        if (!space) {
            this.close(1008, "Space not found");
            return;
        }
        if (space.width <= 0 || space.height <= 0) {
            this.close(1011, "Space has invalid dimensions");
            return;
        }
        if (this.ws.readyState !== this.ws.OPEN) {
            return;
        }

        if (this.spaceId === spaceId && this.userId === decoded.userId) {
            this.sendSpaceJoined();
            return;
        }

        this.leaveSpace();
        this.userId = decoded.userId;
        this.spaceId = spaceId;
        this.spaceWidth = space.width;
        this.spaceHeight = space.height;
        const roomUsers = RoomManager.getInstance().rooms.get(spaceId) ?? [];
        const occupiedPositions = new Set(roomUsers.map(user => `${user.x}:${user.y}`));
        const nearbyPositions: Array<{ x: number; y: number }> = [];
        const anchor = roomUsers[0];

        if (anchor) {
            for (let radius = 1; radius <= 4 && nearbyPositions.length === 0; radius += 1) {
                for (let dx = -radius; dx <= radius; dx += 1) {
                    for (let dy = -radius; dy <= radius; dy += 1) {
                        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) {
                            continue;
                        }

                        const x = anchor.x + dx;
                        const y = anchor.y + dy;
                        if (
                            x >= 0 &&
                            y >= 0 &&
                            x < space.width &&
                            y < space.height &&
                            !occupiedPositions.has(`${x}:${y}`)
                        ) {
                            nearbyPositions.push({ x, y });
                        }
                    }
                }
            }
        }

        if (nearbyPositions.length > 0) {
            const spawn = nearbyPositions[Math.floor(Math.random() * nearbyPositions.length)];
            this.x = spawn.x;
            this.y = spawn.y;
        } else {
            this.x = Math.floor(Math.random() * Math.max(1, space.width - 1));
            this.y = Math.floor(Math.random() * space.height);
        }

        RoomManager.getInstance().addUser(spaceId, this);
        this.sendSpaceJoined();
        RoomManager.getInstance().broadcast({
            type: "user-joined",
            payload: {
                userId: this.userId,
                x: this.x,
                y: this.y
            }
        }, this, spaceId);
    }

    private sendSpaceJoined() {
        if (!this.spaceId || !this.userId) {
            return;
        }

        const users = RoomManager.getInstance().rooms.get(this.spaceId) ?? [];
        this.send({
            type: "space-joined",
            payload: {
                userId: this.userId,
                spawn: { x: this.x, y: this.y },
                users: users
                    .filter(user => user.id !== this.id)
                    .map(user => ({ userId: user.userId, x: user.x, y: user.y }))
            }
        });
    }

    private move(payload: JsonObject) {
        const { x, y } = payload;
        if (
            !this.spaceId ||
            this.spaceWidth === undefined ||
            this.spaceHeight === undefined ||
            !this.userId
        ) {
            this.close(1008, "Join a space before moving");
            return;
        }

        if (typeof x !== "number" || !Number.isInteger(x) || typeof y !== "number" || !Number.isInteger(y)) {
            this.sendMovementRejected();
            return;
        }

        const xDisplacement = Math.abs(this.x - x);
        const yDisplacement = Math.abs(this.y - y);
        const inBounds = x >= 0 && y >= 0 && x < this.spaceWidth && y < this.spaceHeight;
        const isOneStep = (xDisplacement === 1 && yDisplacement === 0) ||
            (xDisplacement === 0 && yDisplacement === 1);
        if (!inBounds || !isOneStep) {
            this.sendMovementRejected();
            return;
        }

        this.x = x;
        this.y = y;
        RoomManager.getInstance().broadcast({
            type: "movement",
            payload: {
                userId: this.userId,
                x: this.x,
                y: this.y
            }
        }, this, this.spaceId);
    }

    private sendMovementRejected() {
        this.send({
            type: "movement-rejected",
            payload: { x: this.x, y: this.y }
        });
    }

    private leaveSpace() {
        if (!this.spaceId) {
            return;
        }

        const spaceId = this.spaceId;
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: { userId: this.userId }
        }, this, spaceId);
        RoomManager.getInstance().removeUser(this, spaceId);
        this.spaceId = undefined;
        this.spaceWidth = undefined;
        this.spaceHeight = undefined;
    }

    private close(code: number, reason: string) {
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.close(code, reason);
        }
    }

    destroy() {
        this.leaveSpace();
    }

    send(payload: OutgoingMessage) {
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify(payload));
        }
    }
}
