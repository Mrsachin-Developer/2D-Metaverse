import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePlayerMovement, type Obstacle } from '../hooks/usePlayerMovement';
import { spaceService } from '../services/space.service';
import { avatarService } from '../services/avatar.service';
import { sound } from '../utils/sound';
import type { SpaceDetailResponse } from '../types/api';
import type { Player } from '../types/websocket';
import { ArenaCanvas } from '../components/arena/ArenaCanvas';
import { ArenaSidebar } from '../components/arena/ArenaSidebar';
import { ArenaControls } from '../components/arena/ArenaControls';
import { BuildElementModal } from '../components/arena/BuildElementModal';
import { Toast, type ToastMessage } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';

interface ArenaPageProps {
  spaceId: string;
  onExit: () => void;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({ spaceId, onExit }) => {
  const { user } = useAuth();
  const token = user?.token || '';

  const [spaceData, setSpaceData] = useState<SpaceDetailResponse | null>(null);
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [isBuildOpen, setIsBuildOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  // Toasts queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copied, setCopied] = useState(false);

  // Player emoji reactions
  const [playerEmojis, setPlayerEmojis] = useState<Map<string, { emoji: string; until: number }>>(
    new Map()
  );

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleUserJoin = useCallback(
    (userId: string) => {
      sound.playJoin();
      addToast({
        type: 'info',
        title: 'Explorer Joined',
        message: `Explorer ${userId.slice(0, 6)} entered the room.`,
      });
    },
    [addToast]
  );

  const handleUserLeave = useCallback(
    (userId: string) => {
      addToast({
        type: 'info',
        title: 'Explorer Left',
        message: `Explorer ${userId.slice(0, 6)} departed.`,
      });
    },
    [addToast]
  );

  const fetchSpaceData = useCallback(() => {
    return spaceService
      .getSpace(spaceId)
      .then((data) => {
        setSpaceData(data);
      })
      .catch((err) => {
        setSpaceError(err instanceof Error ? err.message : 'Failed to load space elements');
      });
  }, [spaceId]);

  // Fetch space metadata (dimensions & elements)
  useEffect(() => {
    let active = true;
    setLoadingSpace(true);
    setSpaceError(null);

    fetchSpaceData().finally(() => {
      if (active) setLoadingSpace(false);
    });

    return () => {
      active = false;
    };
  }, [fetchSpaceData]);

  // Establish WebSocket connection
  const { status, currentUser: rawCurrentUser, otherPlayers: rawOtherPlayers, sendMove } = useWebSocket({
    spaceId,
    token,
    onUserJoin: handleUserJoin,
    onUserLeave: handleUserLeave,
  });

  // Enrich current user with session info
  const currentUser: Player | null = useMemo(() => {
    if (!rawCurrentUser) return null;
    return {
      ...rawCurrentUser,
      username: user?.username || 'You',
      avatarUrl: user?.avatarUrl,
    };
  }, [rawCurrentUser, user?.username, user?.avatarUrl]);

  // Enrich other players with avatar metadata
  const [playerMetadataMap, setPlayerMetadataMap] = useState<Map<string, string>>(new Map());

  const otherUserIdsKey = useMemo(() => {
    return Array.from(rawOtherPlayers.keys()).sort().join(',');
  }, [rawOtherPlayers]);

  useEffect(() => {
    if (!otherUserIdsKey) return;
    const ids = otherUserIdsKey.split(',');

    avatarService
      .getBulkMetadata(ids)
      .then((res) => {
        const nextMap = new Map<string, string>();
        res.avatars.forEach((a) => {
          if (a.avatarId) {
            nextMap.set(a.userId, a.avatarId);
          }
        });
        setPlayerMetadataMap(nextMap);
      })
      .catch((err) => console.warn('Failed to load peer avatars:', err));
  }, [otherUserIdsKey]);

  const otherPlayers: Map<string, Player> = useMemo(() => {
    const enriched = new Map<string, Player>();
    rawOtherPlayers.forEach((player, id) => {
      if (rawCurrentUser && id === rawCurrentUser.userId) {
        return;
      }
      enriched.set(id, {
        ...player,
        avatarUrl: playerMetadataMap.get(id) || player.avatarUrl,
      });
    });
    return enriched;
  }, [rawOtherPlayers, playerMetadataMap, rawCurrentUser]);

  // Dimensions
  const [spaceWidth, spaceHeight] = useMemo(() => {
    if (!spaceData?.dimensions) return [50, 50];
    const parts = spaceData.dimensions.split('x').map((n) => parseInt(n, 10));
    return [parts[0] || 50, parts[1] || 50];
  }, [spaceData?.dimensions]);

  // Solid obstacles to prevent clipping into static desks and walls
  const obstacles: Obstacle[] = useMemo(() => {
    if (!spaceData?.elements) return [];
    return spaceData.elements
      .filter((e) => e.element.static)
      .map((e) => ({
        x: e.x,
        y: e.y,
        width: e.element.width || 1,
        height: e.element.height || 1,
      }));
  }, [spaceData?.elements]);

  // Keyboard Movement & D-Pad
  const { step } = usePlayerMovement({
    currentUser,
    spaceWidth,
    spaceHeight,
    obstacles,
    onMove: sendMove,
    disabled: status !== 'joined',
  });

  // Copy shareable link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/?spaceId=${spaceId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Share this Gather link with teammates to explore together!',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  // Trigger Emoji Reaction
  const handleTriggerEmoji = (emoji: string) => {
    if (!currentUser) return;
    setPlayerEmojis((prev) => {
      const next = new Map(prev);
      next.set(currentUser.userId, { emoji, until: Date.now() + 3000 });
      return next;
    });
  };

  if (loadingSpace) {
    return (
      <div className="min-h-screen bg-meta-bg flex flex-col items-center justify-center text-gray-400">
        <div className="mc-panel p-8 flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#55AA33]" />
          <h2 className="text-base font-bold text-white mc-text">Loading World...</h2>
          <p className="text-xs text-meta-muted">Initializing map textures & elements</p>
        </div>
      </div>
    );
  }

  if (spaceError) {
    return (
      <div className="min-h-screen bg-meta-bg flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full mc-panel p-6 text-center">
          <AlertCircle className="w-10 h-10 text-meta-redstone mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mc-text">World Inaccessible</h2>
          <p className="text-xs text-gray-400 mt-2 mb-6">{spaceError}</p>
          <Button variant="cyan" onClick={onExit} className="w-full">
            Return to Worlds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex bg-meta-bg select-none">
      {/* Toast Notifications Dock (Top Right) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
          />
        ))}
      </div>

      {/* Disconnection Warning Modal — Minecraft panel */}
      {(status === 'disconnected' || status === 'error') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-sm w-full mc-panel p-6 text-center">
            <WifiOff className="w-10 h-10 text-meta-redstone mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mc-text">Disconnected from Arena</h3>
            <p className="text-xs text-gray-400 mt-2 mb-6">
              The real-time connection to the game server was interrupted.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onExit} className="flex-1">
                Dashboard
              </Button>
              <Button
                variant="cyan"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Reconnect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Left Roster Sidebar — Minecraft mc-panel */}
      <ArenaSidebar
        currentUser={currentUser}
        otherPlayers={otherPlayers}
        spaceName={`Space ${spaceId.slice(0, 8)}`}
        onCopyLink={handleCopyLink}
        copied={copied}
      />

      {/* Main 2D Virtual Canvas */}
      <div className="flex-1 relative h-full">
        <ArenaCanvas
          currentUser={currentUser}
          otherPlayers={otherPlayers}
          spaceWidth={spaceWidth}
          spaceHeight={spaceHeight}
          elements={spaceData?.elements || []}
          playerEmojis={playerEmojis}
          showMinimap={showMinimap}
        />

        {/* Gather-style Bottom Command Pill */}
        <ArenaControls
          currentUser={currentUser}
          status={status}
          spaceDimensions={spaceData?.dimensions || `${spaceWidth}x${spaceHeight}`}
          onExit={onExit}
          onTriggerEmoji={handleTriggerEmoji}
          onOpenBuildModal={() => setIsBuildOpen(true)}
          onStep={step}
          showMinimap={showMinimap}
          onToggleMinimap={() => setShowMinimap(!showMinimap)}
        />
      </div>

      {/* Build & Place Element Modal */}
      <BuildElementModal
        isOpen={isBuildOpen}
        onClose={() => setIsBuildOpen(false)}
        spaceId={spaceId}
        currentX={currentUser?.x ?? 0}
        currentY={currentUser?.y ?? 0}
        onElementPlaced={fetchSpaceData}
      />
    </div>
  );
};
