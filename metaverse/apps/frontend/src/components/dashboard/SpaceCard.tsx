import React, { useState } from 'react';
import type { SpaceItem } from '../../types/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, Trash2, MapPin, Maximize2, Sparkles } from 'lucide-react';

interface SpaceCardProps {
  space: SpaceItem;
  onEnter: (spaceId: string) => void;
  onDelete?: (spaceId: string) => Promise<void>;
  isFeatured?: boolean;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onEnter,
  onDelete,
  isFeatured = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(space.id);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Card hoverable className={`group overflow-hidden flex flex-col justify-between ${isFeatured ? 'border-2 border-meta-gold' : ''}`}>
      {/* Thumbnail / Map Visual Banner */}
      <div className="relative w-full h-36 mc-slot overflow-hidden flex items-center justify-center">
        {space.thumbnail ? (
          <img
            src={space.thumbnail}
            alt={space.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#121215] p-4 relative">
            {/* Grid background effect — pixel style */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #3E3E48 0px, #3E3E48 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, #3E3E48 0px, #3E3E48 1px, transparent 1px, transparent 16px)',
              }}
            />
            <div className="w-12 h-12 mc-slot flex items-center justify-center mb-2">
              <MapPin className="w-6 h-6 text-[#4DEDF3]" />
            </div>
            <span className="text-[11px] font-bold text-meta-muted/80 uppercase tracking-widest mc-text">
              {isFeatured ? 'Public Multi-Room' : 'Virtual World'}
            </span>
          </div>
        )}

        {/* Featured Badge in top left */}
        {isFeatured && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="warning" className="text-[10px] bg-[#141417]/90 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-meta-gold" />
              Featured Campus
            </Badge>
          </div>
        )}

        {/* Dimension Badge in top right */}
        <div className="absolute top-2.5 right-2.5">
          <Badge variant="cyan" className="text-[10px] bg-[#141417]/80">
            <Maximize2 className="w-3 h-3 mr-1" />
            {space.dimensions}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-meta-text group-hover:text-[#55FF55] transition-colors truncate mc-text">
            {space.name}
          </h3>
          <p className="text-xs text-meta-muted mt-1 truncate">
            {isFeatured ? '☕ Cafeteria • 🎮 Gaming • 💼 Boardroom • 💻 Bullpen' : `ID: ${space.id.slice(0, 12)}...`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t-2 border-[#35353E]">
          <Button
            variant={isFeatured ? 'primary' : 'cyan'}
            size="sm"
            className="flex-1"
            onClick={() => onEnter(space.id)}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            ▶ Enter Arena
          </Button>

          {onDelete && (
            <Button
              variant={confirmDelete ? 'danger' : 'ghost'}
              size="sm"
              onClick={handleDelete}
              loading={isDeleting}
              title={confirmDelete ? 'Click again to permanently delete' : 'Delete space'}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              {confirmDelete ? 'Confirm' : ''}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
