import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { avatarService } from '../../services/avatar.service';
import type { AvatarItem } from '../../types/api';
import { useAuth } from '../../hooks/useAuth';
import { Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface AvatarSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarSelectModal: React.FC<AvatarSelectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUserAvatar } = useAuth();
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setLoadingList(true);
    setError(null);

    avatarService
      .getAvatars()
      .then((res) => {
        if (!active) return;
        setAvatars(res.avatars);
        if (user?.avatarUrl) {
          const match = res.avatars.find((a) => a.imageUrl === user.avatarUrl);
          if (match) {
            setSelectedAvatarId(match.id);
          }
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch avatars');
      })
      .finally(() => {
        if (active) setLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, user?.avatarUrl]);

  const handleEquip = async () => {
    if (!selectedAvatarId) return;

    setSaving(true);
    setError(null);

    const chosen = avatars.find((a) => a.id === selectedAvatarId);
    try {
      await updateUserAvatar(selectedAvatarId, chosen?.imageUrl || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎮 Skin / Avatar Wardrobe"
      description="Select a pixel skin to represent you across all metaverse arenas"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5 mt-2">
        {error && (
          <div className="mc-slot flex items-center gap-2 p-3 text-xs text-meta-redstone">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loadingList ? (
          <div className="flex flex-col items-center justify-center py-12 text-meta-muted">
            <Loader2 className="w-8 h-8 animate-spin text-meta-accent mb-2" />
            <span className="text-xs mc-text">Loading skins from registry...</span>
          </div>
        ) : avatars.length === 0 ? (
          <div className="text-center py-10 text-meta-muted text-sm mc-slot">
            No avatars found in catalog.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1 pr-2">
            {avatars.map((avatar) => {
              const isSelected = selectedAvatarId === avatar.id;
              const isCurrentlyEquipped = user?.avatarUrl === avatar.imageUrl;

              return (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`relative group cursor-pointer flex flex-col items-center gap-2 select-none p-3 transition-all ${
                    isSelected
                      ? 'mc-panel border-2 border-[#4DEDF3]'
                      : 'mc-slot hover:brightness-110'
                  }`}
                  style={isSelected ? { borderColor: '#4DEDF3', outline: '2px solid #4DEDF3' } : {}}
                >
                  <div className="relative w-16 h-16 mc-slot overflow-hidden flex items-center justify-center">
                    {avatar.imageUrl ? (
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.name || 'Avatar'}
                        className="w-full h-full object-contain p-1 [image-rendering:pixelated] group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-xs text-meta-muted">N/A</span>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-[#4DEDF3]/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-[#4DEDF3] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-[#141417] stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-meta-text truncate max-w-full text-center mc-text">
                    {avatar.name || 'Explorer'}
                  </span>

                  {isCurrentlyEquipped && (
                    <span className="text-[10px] font-bold text-[#55FF55] uppercase tracking-wider mc-text-emerald">
                      ► Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t-2 border-[#35353E]">
          <span className="text-xs text-meta-muted mc-text">
            {selectedAvatarId ? '✓ 1 skin selected' : 'Choose a skin to equip'}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="cyan"
              onClick={handleEquip}
              disabled={!selectedAvatarId || saving}
              loading={saving}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Equip Skin
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
