import React, { useEffect, useRef } from 'react';
import type { Player } from '../../types/websocket';
import type { SpaceElement } from '../../types/api';

const TILE_SIZE = 48; // Size in pixels of one grid unit

interface ArenaCanvasProps {
  currentUser: Player | null;
  otherPlayers: Map<string, Player>;
  spaceWidth: number;
  spaceHeight: number;
  elements: SpaceElement[];
  playerEmojis?: Map<string, { emoji: string; until: number }>;
  showMinimap?: boolean;
  onElementClick?: (elementId: string) => void;
}

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  currentUser,
  otherPlayers,
  spaceWidth,
  spaceHeight,
  elements,
  playerEmojis,
  showMinimap = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth camera position
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasInitializedCameraRef = useRef(false);

  // Smooth visual positions for players
  const visualPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Image cache and error tracking
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const failedImagesRef = useRef<Set<string>>(new Set());

  // Helper to get or preload image
  const getImage = (url?: string | null): HTMLImageElement | null => {
    if (!url || failedImagesRef.current.has(url)) return null;
    let img = imageCacheRef.current.get(url);
    if (!img) {
      img = new Image();
      img.onerror = () => {
        failedImagesRef.current.add(url);
      };
      img.src = url;
      img.crossOrigin = 'anonymous';
      imageCacheRef.current.set(url, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const arenaPixelWidth = spaceWidth * TILE_SIZE;
      const arenaPixelHeight = spaceHeight * TILE_SIZE;

      // 1. Update Current User Visual Position
      if (currentUser) {
        const targetX = currentUser.x * TILE_SIZE + TILE_SIZE / 2;
        const targetY = currentUser.y * TILE_SIZE + TILE_SIZE / 2;

        let userVisual = visualPositionsRef.current.get(currentUser.userId);
        if (!userVisual || !hasInitializedCameraRef.current) {
          userVisual = { x: targetX, y: targetY };
          visualPositionsRef.current.set(currentUser.userId, userVisual);
          cameraRef.current = { x: targetX, y: targetY };
          hasInitializedCameraRef.current = true;
        } else {
          // Smooth fluid interpolation towards target cell
          userVisual.x += (targetX - userVisual.x) * 0.32;
          userVisual.y += (targetY - userVisual.y) * 0.32;

          // Camera locks to player visual position for zero lag / zero drift
          cameraRef.current.x = userVisual.x;
          cameraRef.current.y = userVisual.y;
        }
      }

      // 2. Update Other Players Visual Positions
      otherPlayers.forEach((player) => {
        if (currentUser && player.userId === currentUser.userId) return;

        const targetX = player.x * TILE_SIZE + TILE_SIZE / 2;
        const targetY = player.y * TILE_SIZE + TILE_SIZE / 2;

        let visual = visualPositionsRef.current.get(player.userId);
        if (!visual) {
          visual = { x: targetX, y: targetY };
          visualPositionsRef.current.set(player.userId, visual);
        } else {
          visual.x += (targetX - visual.x) * 0.32;
          visual.y += (targetY - visual.y) * 0.32;
        }
      });

      // Cleanup departed players
      const activeIds = new Set<string>();
      if (currentUser) activeIds.add(currentUser.userId);
      otherPlayers.forEach((p) => activeIds.add(p.userId));
      visualPositionsRef.current.forEach((_, id) => {
        if (!activeIds.has(id)) {
          visualPositionsRef.current.delete(id);
        }
      });

      const camX = cameraRef.current.x;
      const camY = cameraRef.current.y;

      // Viewport offset to place camera in the center of screen
      const offsetX = Math.round(width / 2 - camX);
      const offsetY = Math.round(height / 2 - camY);

      // Minecraft void background (deep dark)
      ctx.fillStyle = '#0D0D0F';
      ctx.fillRect(0, 0, width, height);

      // Save transform for world-space rendering
      ctx.save();
      ctx.translate(offsetX, offsetY);

      // 3. Draw Minecraft-style floor — alternating stone/grass tiles
      for (let tx = 0; tx < spaceWidth; tx++) {
        for (let ty = 0; ty < spaceHeight; ty++) {
          const x = tx * TILE_SIZE;
          const y = ty * TILE_SIZE;
          const isAlt = (tx + ty) % 2 === 0;

          // Base tile color — Minecraft stone-ish
          ctx.fillStyle = isAlt ? '#3A3A42' : '#323238';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // Subtle pixel grain variation
          if ((tx * 7 + ty * 13) % 5 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.025)';
            ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          }
        }
      }

      // Draw blocky grid lines (Minecraft style)
      ctx.strokeStyle = '#1E1E22';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= arenaPixelWidth; x += TILE_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, arenaPixelHeight);
      }
      for (let y = 0; y <= arenaPixelHeight; y += TILE_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(arenaPixelWidth, y);
      }
      ctx.stroke();

      // Minecraft-style room zone highlight patches (grass/dirt zones)
      if (spaceWidth >= 16 && spaceHeight >= 16) {
        // Zone 1 — Grass tint patch (top-left area)
        ctx.fillStyle = 'rgba(55, 118, 35, 0.12)';
        ctx.fillRect(TILE_SIZE * 1, TILE_SIZE * 1, TILE_SIZE * 10, TILE_SIZE * 9);
        ctx.strokeStyle = 'rgba(85, 170, 51, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(TILE_SIZE * 1, TILE_SIZE * 1, TILE_SIZE * 10, TILE_SIZE * 9);

        // Zone 2 — Blue tint patch (bottom-right area)
        ctx.fillStyle = 'rgba(23, 107, 112, 0.1)';
        ctx.fillRect(TILE_SIZE * 13, TILE_SIZE * 11, TILE_SIZE * 10, TILE_SIZE * 9);
        ctx.strokeStyle = 'rgba(77, 237, 243, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(TILE_SIZE * 13, TILE_SIZE * 11, TILE_SIZE * 10, TILE_SIZE * 9);
      }

      // 4. Draw Minecraft perimeter outer walls (stone-brick border)
      ctx.save();
      ctx.strokeStyle = '#585860';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, arenaPixelWidth, arenaPixelHeight);
      // Inner bevel
      ctx.strokeStyle = '#101014';
      ctx.lineWidth = 2;
      ctx.strokeRect(3, 3, arenaPixelWidth - 6, arenaPixelHeight - 6);
      ctx.restore();

      // 5. Render Placed Map Elements (Desks, Furniture, Objects)
      elements.forEach((item) => {
        const elX = item.x * TILE_SIZE;
        const elY = item.y * TILE_SIZE;
        const elW = (item.element.width || 1) * TILE_SIZE;
        const elH = (item.element.height || 1) * TILE_SIZE;

        const img = getImage(item.element.imageUrl);
        if (img) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, elX, elY, elW, elH);
          ctx.restore();
        } else {
          // Minecraft-style fallback block when image fails to load
          // Stone block base
          ctx.fillStyle = '#4A4A52';
          ctx.fillRect(elX + 2, elY + 2, elW - 4, elH - 4);
          // Top/left bevel highlight
          ctx.fillStyle = '#787882';
          ctx.fillRect(elX + 2, elY + 2, elW - 4, 2);
          ctx.fillRect(elX + 2, elY + 2, 2, elH - 4);
          // Bottom/right bevel shadow
          ctx.fillStyle = '#1C1C20';
          ctx.fillRect(elX + 2, elY + elH - 4, elW - 4, 2);
          ctx.fillRect(elX + elW - 4, elY + 2, 2, elH - 4);
          // Center "?" indicator
          ctx.fillStyle = '#A3A3A8';
          ctx.font = `bold ${Math.min(elW, elH) * 0.4}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', elX + elW / 2, elY + elH / 2);
        }
      });

      // 6. Gather and sort players for 2.5D depth overlapping
      const allPlayers: Array<{ player: Player; isYou: boolean }> = [];
      if (currentUser) {
        allPlayers.push({ player: currentUser, isYou: true });
      }
      otherPlayers.forEach((p) => {
        if (!currentUser || p.userId !== currentUser.userId) {
          allPlayers.push({ player: p, isYou: false });
        }
      });

      allPlayers.sort((a, b) => a.player.y - b.player.y);

      // Render players (Gather.town exact nametag and avatar format)
      allPlayers.forEach(({ player, isYou }) => {
        const visual = visualPositionsRef.current.get(player.userId) || {
          x: player.x * TILE_SIZE + TILE_SIZE / 2,
          y: player.y * TILE_SIZE + TILE_SIZE / 2,
        };

        const px = Math.round(visual.x);
        const py = Math.round(visual.y);
        const radius = 17;

        const avatarImg = getImage(player.avatarUrl);

        if (avatarImg) {
          // Standing pixel avatar — Minecraft style shadow (flat square)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(px - 15, py + 14, 30, 6);

          if (isYou) {
            ctx.save();
            // Minecraft selection highlight — green square glow
            ctx.strokeStyle = '#55AA33';
            ctx.lineWidth = 2;
            ctx.strokeRect(px - 22, py - 22, 44, 44);
            ctx.restore();
          }

          const spriteSize = 42;
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            avatarImg,
            px - spriteSize / 2,
            py - spriteSize / 2 - 3,
            spriteSize,
            spriteSize
          );
          ctx.restore();
        } else {
          // Player shadow — flat square Minecraft style
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(px - radius * 0.85, py + radius - 2, radius * 1.7, 6);

          // Minecraft selection border for current player
          if (isYou) {
            ctx.save();
            ctx.strokeStyle = '#55AA33';
            ctx.lineWidth = 2;
            ctx.strokeRect(px - radius - 3, py - radius - 3, (radius + 3) * 2, (radius + 3) * 2);
            ctx.restore();
          }

          // Fallback square block with initial letter (Minecraft head style)
          ctx.save();
          ctx.fillStyle = isYou ? '#38761D' : '#176B70';
          ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
          // Bevel top/left
          ctx.fillStyle = isYou ? '#5B9E38' : '#2DC1CA';
          ctx.fillRect(px - radius, py - radius, radius * 2, 3);
          ctx.fillRect(px - radius, py - radius, 3, radius * 2);
          // Bevel bottom/right
          ctx.fillStyle = isYou ? '#183C08' : '#0B3E42';
          ctx.fillRect(px - radius, py + radius - 3, radius * 2, 3);
          ctx.fillRect(px + radius - 3, py - radius, 3, radius * 2);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const label = player.username ? player.username.charAt(0).toUpperCase() : 'U';
          ctx.fillText(label, px, py + 1);
          ctx.restore();
        }

        // Minecraft-style Name Tag (blocky chat bubble, no rounded corners)
        const displayName = isYou
          ? `${player.username || 'You'}`
          : player.username || `Explorer ${player.userId.slice(0, 5)}`;

        ctx.font = 'bold 11px Consolas, monospace';
        const textMetrics = ctx.measureText(displayName);
        const tagWidth = textMetrics.width + 16;
        const tagHeight = 16;
        const tagX = px - tagWidth / 2;
        const tagY = py - radius - 24;

        // Minecraft nametag — solid dark background (no rounded corners)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(tagX - 1, tagY - 1, tagWidth + 2, tagHeight + 2);

        // Nametag border — green for you, cyan for others
        ctx.strokeStyle = isYou ? '#55AA33' : '#4DEDF3';
        ctx.lineWidth = 1;
        ctx.strokeRect(tagX - 1, tagY - 1, tagWidth + 2, tagHeight + 2);

        // Green presence dot
        ctx.fillStyle = '#55FF55';
        ctx.fillRect(tagX + 4, tagY + tagHeight / 2 - 2, 4, 4);

        // Nametag text
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName, tagX + 12, tagY + tagHeight / 2);

        // Gather-style Speech Bubble Popup when reacting with Emoji
        const reaction = playerEmojis?.get(player.userId);
        if (reaction && reaction.until > Date.now()) {
          const bubbleY = tagY - 26;
          ctx.save();
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#2E355B';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(px - 18, bubbleY - 14, 36, 28, 14);
          ctx.fill();
          ctx.stroke();

          // Little speech triangle pointer
          ctx.beginPath();
          ctx.moveTo(px - 4, bubbleY + 14);
          ctx.lineTo(px + 4, bubbleY + 14);
          ctx.lineTo(px, bubbleY + 19);
          ctx.fill();

          ctx.font = '16px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(reaction.emoji, px, bubbleY);
          ctx.restore();
        }
      });

      // Restore camera transform
      ctx.restore();

      // Minecraft-style Minimap (top-right corner) — stone panel
      if (showMinimap) {
        const mapW = 150;
        const mapH = 100;
        const mapX = width - mapW - 16;
        const mapY = 16;

        ctx.save();
        // Stone panel background — mc-panel style bevel
        ctx.fillStyle = '#26262D';
        ctx.fillRect(mapX, mapY, mapW, mapH);
        // Top/left bevel
        ctx.fillStyle = '#585860';
        ctx.fillRect(mapX, mapY, mapW, 3);
        ctx.fillRect(mapX, mapY, 3, mapH);
        // Bottom/right bevel
        ctx.fillStyle = '#101014';
        ctx.fillRect(mapX, mapY + mapH - 3, mapW, 3);
        ctx.fillRect(mapX + mapW - 3, mapY, 3, mapH);

        ctx.font = 'bold 9px Consolas, monospace';
        ctx.fillStyle = '#55AA33';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('▣ MINIMAP', mapX + 8, mapY + 5);

        const innerX = mapX + 6;
        const innerY = mapY + 18;
        const innerW = mapW - 12;
        const innerH = mapH - 24;

        // Dark inner slot
        ctx.fillStyle = '#121215';
        ctx.fillRect(innerX, innerY, innerW, innerH);
        ctx.fillStyle = '#09090B';
        ctx.fillRect(innerX, innerY, innerW, 2);
        ctx.fillRect(innerX, innerY, 2, innerH);
        ctx.fillStyle = '#3E3E48';
        ctx.fillRect(innerX, innerY + innerH - 2, innerW, 2);
        ctx.fillRect(innerX + innerW - 2, innerY, 2, innerH);

        const scaleX = innerW / (spaceWidth * TILE_SIZE);
        const scaleY = innerH / (spaceHeight * TILE_SIZE);

        // Draw elements on minimap as small stone blocks
        ctx.fillStyle = '#585860';
        elements.forEach((item) => {
          const ex = innerX + item.x * TILE_SIZE * scaleX;
          const ey = innerY + item.y * TILE_SIZE * scaleY;
          const ew = Math.max(2, (item.element.width || 1) * TILE_SIZE * scaleX);
          const eh = Math.max(2, (item.element.height || 1) * TILE_SIZE * scaleY);
          ctx.fillRect(ex, ey, ew, eh);
        });

        // Draw other players as diamond cyan squares
        ctx.fillStyle = '#4DEDF3';
        otherPlayers.forEach((p) => {
          const px = innerX + (p.x * TILE_SIZE + TILE_SIZE / 2) * scaleX;
          const py = innerY + (p.y * TILE_SIZE + TILE_SIZE / 2) * scaleY;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        });

        // Draw current player as emerald green square
        if (currentUser) {
          const myX = innerX + (currentUser.x * TILE_SIZE + TILE_SIZE / 2) * scaleX;
          const myY = innerY + (currentUser.y * TILE_SIZE + TILE_SIZE / 2) * scaleY;
          ctx.fillStyle = '#55AA33';
          ctx.fillRect(myX - 3, myY - 3, 6, 6);
          ctx.fillStyle = '#55FF55';
          ctx.fillRect(myX - 2, myY - 2, 4, 4);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentUser, otherPlayers, spaceWidth, spaceHeight, elements, playerEmojis, showMinimap]);

  // Keep canvas size synced with window
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0D0D0F] select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block pixelated"
      />
    </div>
  );
};
