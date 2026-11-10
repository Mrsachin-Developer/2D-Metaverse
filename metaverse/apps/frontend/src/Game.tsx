import { useEffect, useRef, useState } from "react";

type Player = {
  userId: string;
  x: number;
  y: number;
  avatarUrl?: string;
};

type AvatarMetadata = {
  userId: string;
  avatarId?: string | null;
};

type AvatarCatalogItem = {
  imageUrl?: string | null;
};

const Arena = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const cameraRef = useRef<{ x: number; y: number } | null>(null);
  const avatarImagesRef = useRef(new Map<string, HTMLImageElement>());
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [users, setUsers] = useState<Map<string, Player>>(new Map());
  const [avatarLoadVersion, setAvatarLoadVersion] = useState(0);
  const [params, setParams] = useState({ token: "", spaceId: "" });
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const playerIds = Array.from(
    new Set(
      [currentUser?.userId, ...users.keys()].filter(
        (userId): userId is string => Boolean(userId),
      ),
    ),
  )
    .sort()
    .join(",");

  // Initialize WebSocket connection and handle URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || "";
    const spaceId = urlParams.get("spaceId") || "";
    setParams({ token, spaceId });

    if (!token || !spaceId) {
      setConnectionStatus("A game link with a token and space ID is required.");
      return;
    }

    // Initialize WebSocket
    const socket = new WebSocket("ws://localhost:3001"); // Replace with your WS_URL
    wsRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus("Connected; joining space...");
      // Join the space once connected
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            spaceId,
            token,
          },
        }),
      );
    };

    socket.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };
    socket.onclose = (event) => {
      setConnectionStatus(event.reason || "Disconnected from the game server.");
    };
    socket.onerror = () => {
      setConnectionStatus("Could not connect to the game server.");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!playerIds) {
      return;
    }

    let active = true;
    const query = new URLSearchParams({ ids: `[${playerIds}]` });

    Promise.all([
      fetch(`/api/v1/user/metadata/bulk?${query}`),
      fetch("/api/v1/avatars"),
    ])
      .then(async ([metadataResponse, catalogResponse]) => {
        if (!metadataResponse.ok || !catalogResponse.ok) {
          throw new Error(
            `Avatar request failed (metadata: ${metadataResponse.status}, catalog: ${catalogResponse.status})`,
          );
        }
        return Promise.all([
          metadataResponse.json() as Promise<{ avatars: AvatarMetadata[] }>,
          catalogResponse.json() as Promise<{ avatars: AvatarCatalogItem[] }>,
        ]);
      })
      .then(([{ avatars: metadata }, { avatars: catalog }]) => {
        if (!active) {
          return;
        }

        const defaultAvatarUrl =
          catalog.find((avatar) => avatar.imageUrl)?.imageUrl ?? undefined;
        const avatarUrls = new Map(
          metadata.map(({ userId, avatarId }) => [
            userId,
            avatarId ?? defaultAvatarUrl,
          ]),
        );
        setCurrentUser((player) =>
          player
            ? { ...player, avatarUrl: avatarUrls.get(player.userId) }
            : player,
        );
        setUsers(
          (players) =>
            new Map(
              Array.from(players, ([userId, player]) => [
                userId,
                { ...player, avatarUrl: avatarUrls.get(userId) },
              ]),
            ),
        );
      })
      .catch((error: unknown) => {
        console.error("Failed to load player avatars:", error);
      });

    return () => {
      active = false;
    };
  }, [playerIds]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case "space-joined":
        setConnectionStatus("Joined space");
        cameraRef.current = {
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
        };
        // Initialize current user position and other users
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });

        // Initialize other users from the payload
        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
        setUsers(userMap);
        break;

      case "user-joined":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId,
          });
          return newUsers;
        });
        break;

      case "movement":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });
        break;

      case "movement-rejected":
        // Reset current user position if movement was rejected
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        break;

      case "user-left":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
    }
  };

  // Handle user movement
  const handleMove = (newX: any, newY: any) => {
    if (!currentUser || wsRef.current?.readyState !== WebSocket.OPEN) return;

    // Send movement request
    wsRef.current.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: newX,
          y: newY,
          userId: currentUser.userId,
        },
      }),
    );
    setCurrentUser((player) =>
      player ? { ...player, x: newX, y: newY } : player,
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentUser) return;

      let x = currentUser.x;
      let y = currentUser.y;
      switch (event.key) {
        case "ArrowUp":
          y -= 1;
          break;
        case "ArrowDown":
          y += 1;
          break;
        case "ArrowLeft":
          x -= 1;
          break;
        case "ArrowRight":
          x += 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      handleMove(x, y);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUser]);

  // Draw the arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cameraX = cameraRef.current?.x ?? currentUser?.x ?? 0;
    const cameraY = cameraRef.current?.y ?? currentUser?.y ?? 0;
    const gridOffsetX = ((canvas.width / 2 - cameraX * 50) % 50 + 50) % 50;
    const gridOffsetY = ((canvas.height / 2 - cameraY * 50) % 50 + 50) % 50;

    // Draw grid
    ctx.strokeStyle = "#eee";
    for (let i = gridOffsetX; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = gridOffsetY; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    const drawPlayer = (player: Player, color: string, label: string) => {
      const centerX = canvas.width / 2 + (player.x - cameraX) * 50;
      const centerY = canvas.height / 2 + (player.y - cameraY) * 50;
      const avatarUrl = player.avatarUrl;
      const avatarImage = avatarUrl
        ? avatarImagesRef.current.get(avatarUrl)
        : undefined;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      if (avatarImage?.complete && avatarImage.naturalWidth > 0) {
        ctx.save();
        ctx.clip();
        ctx.drawImage(avatarImage, centerX - 20, centerY - 20, 40, 40);
        ctx.restore();
      } else {
        ctx.fillStyle = color;
        ctx.fill();
        if (avatarUrl && !avatarImage) {
          const image = new Image();
          image.onload = () => setAvatarLoadVersion((version) => version + 1);
          image.onerror = () =>
            console.error(`Failed to load player avatar: ${avatarUrl}`);
          image.src = avatarUrl;
          avatarImagesRef.current.set(avatarUrl, image);
        }
      }

      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(label, centerX, centerY + 40);
    };

    if (currentUser) {
      drawPlayer(currentUser, "#FF6B6B", "You");
    } else {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.beginPath();
      ctx.fillStyle = "#FF6B6B";
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Player preview", centerX, centerY + 40);
    }

    users.forEach((user) => {
      drawPlayer(user, "#4ECDC4", `User ${user.userId}`);
    });
  }, [currentUser, users, avatarLoadVersion]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arena</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
        <p className="text-sm text-gray-600">Status: {connectionStatus}</p>
        <p className="text-sm text-gray-600">
          Connected Users: {users.size + (currentUser ? 1 : 0)}
        </p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white"
          style={{ display: "block", width: "min(800px, calc(100vw - 5rem))", height: "auto" }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Use arrow keys to move your avatar
      </p>
    </div>
  );
};

export default Arena;
