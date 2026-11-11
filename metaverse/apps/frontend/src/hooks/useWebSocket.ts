import { useEffect, useRef, useState, useCallback } from 'react';
import type {
  Player,
  Position,
  ServerMessage,
  WebSocketConnectionStatus,
} from '../types/websocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

interface UseWebSocketOptions {
  spaceId: string;
  token: string;
  onUserJoin?: (userId: string) => void;
  onUserLeave?: (userId: string) => void;
}

export const useWebSocket = ({
  spaceId,
  token,
  onUserJoin,
  onUserLeave,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketConnectionStatus>('connecting');
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Map<string, Player>>(new Map());
  const [serverSpawn, setServerSpawn] = useState<Position | null>(null);

  const currentUserIdRef = useRef<string | null>(null);

  // References to keep callbacks fresh without restarting socket
  const onUserJoinRef = useRef(onUserJoin);
  onUserJoinRef.current = onUserJoin;
  const onUserLeaveRef = useRef(onUserLeave);
  onUserLeaveRef.current = onUserLeave;

  useEffect(() => {
    if (!spaceId || !token) {
      setStatus('error');
      return;
    }

    let isDisposed = false;
    setStatus('connecting');

    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      if (isDisposed) return;
      setStatus('connected');
      // Send the strict join message expected by backend
      socket.send(
        JSON.stringify({
          type: 'join',
          payload: {
            spaceId,
            token,
          },
        })
      );
    };

    socket.onmessage = (event: MessageEvent) => {
      if (isDisposed) return;
      try {
        const message: ServerMessage = JSON.parse(event.data);
        switch (message.type) {
          case 'space-joined': {
            setStatus('joined');
            const { userId, spawn, users } = message.payload;
            currentUserIdRef.current = userId;
            setServerSpawn(spawn);
            setCurrentUser({
              userId,
              x: spawn.x,
              y: spawn.y,
            });

            // Populate existing peers (strictly excluding current user)
            const map = new Map<string, Player>();
            users.forEach((u) => {
              if (u.userId !== userId) {
                map.set(u.userId, {
                  userId: u.userId,
                  x: u.x,
                  y: u.y,
                });
              }
            });
            setOtherPlayers(map);
            break;
          }

          case 'user-joined': {
            const { userId, x, y } = message.payload;
            // Never add the current user as an "other player"
            if (userId === currentUserIdRef.current) {
              break;
            }
            setOtherPlayers((prev) => {
              const updated = new Map(prev);
              updated.set(userId, { userId, x, y });
              return updated;
            });
            onUserJoinRef.current?.(userId);
            break;
          }

          case 'movement': {
            const { userId, x, y } = message.payload;
            // Ignore movement broadcast for self
            if (userId === currentUserIdRef.current) {
              break;
            }
            setOtherPlayers((prev) => {
              const existing = prev.get(userId);
              if (!existing) return prev;
              const updated = new Map(prev);
              updated.set(userId, { ...existing, x, y });
              return updated;
            });
            break;
          }

          case 'movement-rejected': {
            // Server rejected the move; snap client back to authoritative server coords
            const { x, y } = message.payload;
            setCurrentUser((prev) => (prev ? { ...prev, x, y } : null));
            break;
          }

          case 'user-left': {
            const { userId } = message.payload;
            setOtherPlayers((prev) => {
              const updated = new Map(prev);
              updated.delete(userId);
              return updated;
            });
            onUserLeaveRef.current?.(userId);
            break;
          }
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket encountered error:', err);
      if (!isDisposed) {
        setStatus('error');
      }
    };

    socket.onclose = () => {
      if (!isDisposed) {
        setStatus('disconnected');
      }
    };

    return () => {
      isDisposed = true;
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      wsRef.current = null;
    };
  }, [spaceId, token]);

  const sendMove = useCallback((x: number, y: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }

    // Strict movement payload: type: "move", payload: { x, y }
    wsRef.current.send(
      JSON.stringify({
        type: 'move',
        payload: { x, y },
      })
    );

    // Optimistically update local user coordinate
    setCurrentUser((prev) => (prev ? { ...prev, x, y } : null));
    return true;
  }, []);

  return {
    status,
    currentUser,
    otherPlayers,
    serverSpawn,
    sendMove,
  };
};

