import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { adminService } from '../../services/admin.service';
import { spaceService } from '../../services/space.service';
import { avatarService } from '../../services/avatar.service';
import type { ElementItem, AvatarItem } from '../../types/api';
import {
  Plus,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  Box,
  UserCheck,
  Map as MapIcon,
} from 'lucide-react';

interface AdminStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetsUpdated?: () => void;
}

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({
  isOpen,
  onClose,
  onAssetsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'new-element' | 'new-avatar' | 'new-map'>('catalog');
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Element form state
  const [elementUrl, setElementUrl] = useState('');
  const [elementWidth, setElementWidth] = useState(1);
  const [elementHeight, setElementHeight] = useState(1);
  const [elementStatic, setElementStatic] = useState(true);

  // New Avatar form state
  const [avatarName, setAvatarName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // New Map form state
  const [mapName, setMapName] = useState('');
  const [mapDimensions, setMapDimensions] = useState('30x22');
  const [mapThumbnail, setMapThumbnail] = useState('');

  const loadCatalog = async () => {
    setLoadingCatalog(true);
    setError(null);
    try {
      const [elemRes, avatRes] = await Promise.all([
        spaceService.getElements(),
        avatarService.getAvatars(),
      ]);
      setElements(elemRes.elements || []);
      setAvatars(avatRes.avatars || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCatalog();
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const handleCreateElement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elementUrl.trim()) {
      setError('Please provide an image URL');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.createElement({
        imageUrl: elementUrl.trim(),
        width: Number(elementWidth) || 1,
        height: Number(elementHeight) || 1,
        static: Boolean(elementStatic),
      });
      setSuccessMsg('Element created successfully!');
      setElementUrl('');
      loadCatalog();
      onAssetsUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create element');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarName.trim() || !avatarUrl.trim()) {
      setError('Please provide avatar name and image URL');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.createAvatar({
        name: avatarName.trim(),
        imageUrl: avatarUrl.trim(),
      });
      setSuccessMsg('Avatar created successfully!');
      setAvatarName('');
      setAvatarUrl('');
      loadCatalog();
      onAssetsUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create avatar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapName.trim()) {
      setError('Please provide a map template name');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await adminService.createMap({
        name: mapName.trim(),
        dimensions: mapDimensions.trim() || '30x22',
        thumbnail: mapThumbnail.trim() || undefined,
        defaultElements: [],
      });
      setSuccessMsg('Map template created successfully!');
      setMapName('');
      setMapThumbnail('');
      loadCatalog();
      onAssetsUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create map template');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👑 Platform Admin Studio"
      description="Superuser asset manager: publish pixel avatars, furniture elements, and map layouts"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4 mt-2">
        {/* Navigation Tabs — Minecraft buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`mc-btn flex items-center gap-2 px-3 py-2 text-xs ${
              activeTab === 'catalog'
                ? 'mc-btn-emerald'
                : 'mc-btn-stone'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catalog ({elements.length + avatars.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new-element')}
            className={`mc-btn flex items-center gap-2 px-3 py-2 text-xs ${
              activeTab === 'new-element'
                ? 'mc-btn-diamond'
                : 'mc-btn-stone'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>+ Element</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new-avatar')}
            className={`mc-btn flex items-center gap-2 px-3 py-2 text-xs ${
              activeTab === 'new-avatar'
                ? 'mc-btn-gold'
                : 'mc-btn-stone'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>+ Avatar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('new-map')}
            className={`mc-btn flex items-center gap-2 px-3 py-2 text-xs ${
              activeTab === 'new-map'
                ? 'mc-btn-emerald'
                : 'mc-btn-stone'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>+ Map Layout</span>
          </button>
        </div>

        {error && (
          <div className="mc-slot flex items-center gap-2 p-3 text-xs text-meta-redstone">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mc-panel flex items-center gap-2 p-3 text-xs text-[#55FF55]">
            <Check className="w-4 h-4 shrink-0" />
            <span className="mc-text-emerald">{successMsg}</span>
          </div>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2">
            {loadingCatalog ? (
              <div className="flex flex-col items-center justify-center py-12 text-meta-muted">
                <Loader2 className="w-6 h-6 animate-spin text-meta-accent mb-2" />
                <span className="text-xs mc-text">Fetching registered assets...</span>
              </div>
            ) : (
              <>
                {/* Avatars Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-meta-muted mb-2 flex items-center gap-2 mc-text">
                    <Sparkles className="w-3.5 h-3.5 text-meta-gold" />
                    Avatars ({avatars.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {avatars.map((av) => (
                      <div
                        key={av.id}
                        className="p-2.5 mc-slot flex items-center gap-3"
                      >
                        <div className="w-12 h-12 mc-slot overflow-hidden flex items-center justify-center shrink-0">
                          {av.imageUrl ? (
                            <img
                              src={av.imageUrl}
                              alt={av.name || 'Avatar'}
                              className="w-full h-full object-contain [image-rendering:pixelated]"
                            />
                          ) : (
                            <span className="text-xs text-meta-muted">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-meta-text truncate mc-text">
                            {av.name || 'Unnamed'}
                          </p>
                          <p className="text-[10px] text-meta-muted truncate">
                            {av.imageUrl?.split('/').pop() || av.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elements Section */}
                <div className="mt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-meta-muted mb-2 flex items-center gap-2 mc-text">
                    <Box className="w-3.5 h-3.5 text-[#4DEDF3]" />
                    Furniture & Elements ({elements.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {elements.map((el) => (
                      <div
                        key={el.id}
                        className="p-2.5 mc-slot flex items-center gap-3"
                      >
                        <div className="w-12 h-12 mc-slot overflow-hidden flex items-center justify-center shrink-0">
                          {el.imageUrl ? (
                            <img
                              src={el.imageUrl}
                              alt="Element"
                              className="w-full h-full object-contain [image-rendering:pixelated]"
                            />
                          ) : (
                            <span className="text-xs text-meta-muted">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[#4DEDF3] mc-text">
                            {el.width}x{el.height} {el.static ? 'Solid' : 'Floor'}
                          </p>
                          <p className="text-[10px] text-meta-muted truncate">
                            {el.imageUrl?.split('/').pop() || el.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Create Element Form */}
        {activeTab === 'new-element' && (
          <form onSubmit={handleCreateElement} className="flex flex-col gap-4">
            <Input
              label="Element Image URL"
              placeholder="/assets/elements/workstation_triple.svg or https://..."
              value={elementUrl}
              onChange={(e) => setElementUrl(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Width (Tiles)"
                type="number"
                min="1"
                max="10"
                value={elementWidth}
                onChange={(e) => setElementWidth(parseInt(e.target.value) || 1)}
                required
              />
              <Input
                label="Height (Tiles)"
                type="number"
                min="1"
                max="10"
                value={elementHeight}
                onChange={(e) => setElementHeight(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-meta-text mc-text">
              <input
                type="checkbox"
                checked={elementStatic}
                onChange={(e) => setElementStatic(e.target.checked)}
                className="mc-slot w-4 h-4"
                style={{ accentColor: '#55AA33' }}
              />
              <span>Solid Obstacle (Blocks player walking path)</span>
            </label>

            {elementUrl && (
              <div className="p-3 mc-slot flex items-center gap-4">
                <span className="text-xs text-meta-muted mc-text">Preview:</span>
                <div className="w-16 h-16 mc-slot flex items-center justify-center p-1">
                  <img
                    src={elementUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain [image-rendering:pixelated]"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="cyan"
              loading={submitting}
              icon={<Plus className="w-4 h-4" />}
            >
              Publish Element to Registry
            </Button>
          </form>
        )}

        {/* Create Avatar Form */}
        {activeTab === 'new-avatar' && (
          <form onSubmit={handleCreateAvatar} className="flex flex-col gap-4">
            <Input
              label="Avatar Name"
              placeholder="e.g. Cyberpunk Runner"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              required
            />

            <Input
              label="Avatar Image URL"
              placeholder="/assets/avatars/avatar_zepto.svg or https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              required
            />

            {avatarUrl && (
              <div className="p-3 mc-slot flex items-center gap-4">
                <span className="text-xs text-meta-muted mc-text">Preview:</span>
                <div className="w-16 h-16 mc-slot flex items-center justify-center p-1">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain [image-rendering:pixelated]"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Publish Avatar to Registry
            </Button>
          </form>
        )}

        {/* Create Map Form */}
        {activeTab === 'new-map' && (
          <form onSubmit={handleCreateMap} className="flex flex-col gap-4">
            <Input
              label="Map Template Name"
              placeholder="e.g. Engineering Open Space, VIP Lounge"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Dimensions (WxH)"
                placeholder="e.g. 30x22 or 50x50"
                value={mapDimensions}
                onChange={(e) => setMapDimensions(e.target.value)}
                required
              />
              <Input
                label="Thumbnail URL (Optional)"
                placeholder="/assets/thumbnails/campus.png or https://..."
                value={mapThumbnail}
                onChange={(e) => setMapThumbnail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="cyan"
              loading={submitting}
              icon={<Plus className="w-4 h-4" />}
            >
              Publish Map Template to Registry
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t-2 border-[#35353E]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Studio
          </Button>
        </div>
      </div>
    </Modal>
  );
};
