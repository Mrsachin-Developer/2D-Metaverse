import React, { useState } from 'react';
import type { Player, WebSocketConnectionStatus } from '../../types/websocket';
import type { MovementDirection } from '../../hooks/usePlayerMovement';
import { Avatar } from '../ui/Avatar';
import { sound } from '../../utils/sound';
import {
  Map,
  Monitor,
  Smile,
  Hammer,
  Volume2,
  VolumeX,
  LogOut,
  Gamepad2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface ArenaControlsProps {
  currentUser: Player | null;
  status: WebSocketConnectionStatus;
  spaceDimensions: string;
  onExit: () => void;
  onTriggerEmoji: (emoji: string) => void;
  onOpenBuildModal: () => void;
  onStep?: (direction: MovementDirection) => void;
  showMinimap?: boolean;
  onToggleMinimap?: () => void;
}

const GATHER_EMOJIS = ['👋', '❤️', '👍', '👏', '😂', '🔥', '☕', '🎉', '💡', '❓'];

export const ArenaControls: React.FC<ArenaControlsProps> = ({
  currentUser,
  status,
  spaceDimensions,
  onExit,
  onTriggerEmoji,
  onOpenBuildModal,
  onStep,
  showMinimap,
  onToggleMinimap,
}) => {
  const [muted, setMuted] = useState(!sound.enabled);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDpad, setShowDpad] = useState(false);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setMuted(!sound.enabled);
  };

  return (
    <>
      {/* Floating Emoji Picker Popup — mc-panel */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 mc-panel p-2.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 pointer-events-auto">
          {GATHER_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onTriggerEmoji(emoji);
                setShowEmojiPicker(false);
              }}
              className="mc-btn mc-btn-stone w-9 h-9 flex items-center justify-center text-lg focus:outline-none"
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Optional Virtual Touch D-Pad — Minecraft stone buttons */}
      {showDpad && onStep && (
        <div className="absolute bottom-20 right-6 z-40 pointer-events-auto mc-panel p-3 flex flex-col items-center gap-1.5 select-none animate-in fade-in zoom-in-95">
          <button
            onClick={() => onStep('up')}
            className="mc-btn mc-btn-stone w-10 h-10 flex items-center justify-center text-white"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStep('left')}
              className="mc-btn mc-btn-stone w-10 h-10 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => onStep('down')}
              className="mc-btn mc-btn-stone w-10 h-10 flex items-center justify-center text-white"
            >
              <ArrowDown className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => onStep('right')}
              className="mc-btn mc-btn-stone w-10 h-10 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Command Bar — Minecraft mc-panel toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto flex items-center gap-1 mc-panel p-1.5 pl-3">
          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pr-3 border-r-2 border-r-[#585860]">
            <div className="relative">
              <Avatar
                src={currentUser?.avatarUrl}
                name={currentUser?.username || 'You'}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#55FF55] ring-2 ring-[#26262D]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight mc-text">
                {currentUser?.username || 'You'}
              </span>
              <span className="text-[10px] text-[#4DEDF3] leading-tight">
                Online • ({currentUser?.x ?? 0}, {currentUser?.y ?? 0})
              </span>
            </div>
          </div>

          {/* Action Tool Buttons */}
          <div className="flex items-center gap-1 px-1">
            {/* Map Toggle */}
            <button
              onClick={onToggleMinimap}
              className={`mc-btn p-2 text-xs focus:outline-none ${
                showMinimap ? 'mc-btn-emerald' : 'mc-btn-stone'
              }`}
              title="Toggle Radar Minimap"
            >
              <Map className="w-4 h-4" />
            </button>

            {/* Build Tool */}
            <button
              onClick={onOpenBuildModal}
              className="mc-btn mc-btn-stone p-2 text-xs flex items-center gap-1.5 focus:outline-none"
              title="Build & Place Objects"
            >
              <Hammer className="w-4 h-4 text-[#4DEDF3]" />
              <span className="hidden md:inline text-xs font-bold text-gray-200">Build</span>
            </button>

            {/* Space Info */}
            <button
              onClick={() => alert(`Space Dimensions: ${spaceDimensions}. Status: ${status}`)}
              className="mc-btn mc-btn-stone p-2 text-xs focus:outline-none"
              title="Space Info"
            >
              <Monitor className="w-4 h-4 text-gray-300" />
            </button>

            {/* Emoji Reactions */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`mc-btn p-2 text-xs focus:outline-none ${
                showEmojiPicker
                  ? 'mc-btn-gold'
                  : 'mc-btn-stone'
              }`}
              title="React with Emoji"
            >
              <Smile className="w-4 h-4 text-amber-300" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              className="mc-btn mc-btn-stone p-2 text-xs focus:outline-none"
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#55FF55]" />}
            </button>

            {/* D-Pad Toggle */}
            <button
              onClick={() => setShowDpad(!showDpad)}
              className={`mc-btn p-2 text-xs focus:outline-none ${
                showDpad ? 'mc-btn-diamond' : 'mc-btn-stone'
              }`}
              title="Toggle On-screen D-Pad"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
          </div>

          {/* Leave / Exit Button */}
          <div className="pl-2 border-l-2 border-l-[#585860]">
            <button
              onClick={onExit}
              className="mc-btn mc-btn-redstone p-2 text-xs focus:outline-none"
              title="Leave Space"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
