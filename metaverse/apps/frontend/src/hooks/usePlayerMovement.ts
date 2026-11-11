import { useEffect, useRef, useCallback } from 'react';
import type { Player } from '../types/websocket';
import { sound } from '../utils/sound';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UsePlayerMovementOptions {
  currentUser: Player | null;
  spaceWidth: number;
  spaceHeight: number;
  obstacles?: Obstacle[];
  onMove: (newX: number, newY: number) => boolean;
  disabled?: boolean;
}

export type MovementDirection = 'up' | 'down' | 'left' | 'right';

export const usePlayerMovement = ({
  currentUser,
  spaceWidth,
  spaceHeight,
  obstacles = [],
  onMove,
  disabled = false,
}: UsePlayerMovementOptions) => {
  const lastMoveTimeRef = useRef<number>(0);
  const currentUserRef = useRef<Player | null>(currentUser);
  currentUserRef.current = currentUser;
  const obstaclesRef = useRef<Obstacle[]>(obstacles);
  obstaclesRef.current = obstacles;

  const step = useCallback(
    (direction: MovementDirection) => {
      if (disabled) return;

      const player = currentUserRef.current;
      if (!player) return;

      let dx = 0;
      let dy = 0;

      switch (direction) {
        case 'up':
          dy = -1;
          break;
        case 'down':
          dy = 1;
          break;
        case 'left':
          dx = -1;
          break;
        case 'right':
          dx = 1;
          break;
      }

      const targetX = player.x + dx;
      const targetY = player.y + dy;

      // Rate limit to prevent flooding the WebSocket
      const now = Date.now();
      if (now - lastMoveTimeRef.current < 110) {
        return;
      }

      // Check boundary constraints
      if (
        targetX < 0 ||
        targetY < 0 ||
        targetX >= spaceWidth ||
        targetY >= spaceHeight
      ) {
        return;
      }

      // Check static obstacle collision (desks, solid fixtures)
      const isBlocked = obstaclesRef.current.some(
        (obs) =>
          targetX >= obs.x &&
          targetX < obs.x + (obs.width || 1) &&
          targetY >= obs.y &&
          targetY < obs.y + (obs.height || 1)
      );

      if (isBlocked) {
        return;
      }

      const sent = onMove(targetX, targetY);
      if (sent) {
        lastMoveTimeRef.current = now;
        sound.playMove();
      }
    },
    [spaceWidth, spaceHeight, onMove, disabled]
  );

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is currently typing in an input
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      let dir: MovementDirection | null = null;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dir = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dir = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dir = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dir = 'right';
          break;
        default:
          return;
      }

      event.preventDefault();
      step(dir);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, disabled]);

  return { step };
};
