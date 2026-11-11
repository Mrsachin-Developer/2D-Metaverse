import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { spaceService } from '../../services/space.service';
import type { ElementItem } from '../../types/api';
import { Plus, Hammer, Loader2, AlertCircle } from 'lucide-react';

interface BuildElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  currentX: number;
  currentY: number;
  onElementPlaced: () => void;
}

export const BuildElementModal: React.FC<BuildElementModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  currentX,
  currentY,
  onElementPlaced,
}) => {
  const [elements, setElements] = useState<ElementItem[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [posX, setPosX] = useState(currentX);
  const [posY, setPosY] = useState(currentY);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setPosX(currentX);
    setPosY(currentY);
    setLoading(true);
    setError(null);

    spaceService
      .getElements()
      .then((res) => {
        setElements(res.elements || []);
        if (res.elements && res.elements.length > 0 && !selectedElementId) {
          setSelectedElementId(res.elements[0].id);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load elements');
      })
      .finally(() => setLoading(false));
  }, [isOpen, currentX, currentY]);

  const handlePlace = async () => {
    if (!selectedElementId) return;

    setPlacing(true);
    setError(null);

    try {
      await spaceService.addElement({
        spaceId,
        elementId: selectedElementId,
        x: Number(posX),
        y: Number(posY),
      });
      onElementPlaced();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place element');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⛏ Map Builder — Place Elements"
      description="Select and spawn furniture, desks, and objects into this space at coordinates"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-4 mt-2">
        {error && (
          <div className="mc-slot flex items-center gap-2 p-3 text-xs text-meta-redstone">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Coordinate Placement Selector — mc-slot */}
        <div className="flex items-center gap-3 p-3 mc-slot">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-meta-muted block mb-2 uppercase tracking-wider mc-text">
              Placement Coordinates (X, Y)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                className="w-20 mc-slot px-2.5 py-1.5 text-xs text-meta-text font-mono bg-transparent focus:outline-none"
                placeholder="X"
              />
              <span className="text-meta-muted font-bold mc-text">,</span>
              <input
                type="number"
                value={posY}
                onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                className="w-20 mc-slot px-2.5 py-1.5 text-xs text-meta-text font-mono bg-transparent focus:outline-none"
                placeholder="Y"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPosX(currentX);
                  setPosY(currentY);
                }}
                className="text-[11px] py-1"
              >
                Snap ({currentX}, {currentY})
              </Button>
            </div>
          </div>
        </div>

        {/* Elements Grid — mc-slot inventory style */}
        <div>
          <label className="text-xs font-bold text-meta-muted uppercase tracking-wider block mb-2 mc-text">
            Available Objects Catalog ({elements.length})
          </label>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-meta-muted">
              <Loader2 className="w-6 h-6 animate-spin text-meta-accent mb-2" />
              <span className="text-xs mc-text">Loading items from catalog...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1 pr-2">
              {elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const elementName = el.imageUrl
                  ?.split('/')
                  .pop()
                  ?.replace(/\.[^/.]+$/, '')
                  ?.split('_')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ') || 'Furniture';

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`relative flex flex-col items-center gap-2 cursor-pointer transition-all p-3 ${
                      isSelected
                        ? 'mc-panel'
                        : 'mc-slot hover:brightness-110'
                    }`}
                    style={isSelected ? { outline: '2px solid #4DEDF3' } : {}}
                  >
                    <div className="w-16 h-16 mc-slot overflow-hidden flex items-center justify-center p-1">
                      {el.imageUrl ? (
                        <img
                          src={el.imageUrl}
                          alt={elementName}
                          className="w-full h-full object-contain [image-rendering:pixelated]"
                        />
                      ) : (
                        <Hammer className="w-6 h-6 text-meta-muted" />
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-[11px] font-bold text-meta-text truncate max-w-full mc-text">
                        {elementName}
                      </p>
                      <span className="text-[10px] text-[#4DEDF3] mc-text">
                        {el.width}x{el.height} {el.static ? '• Solid' : '• Floor'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#35353E]">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={placing}>
            Cancel
          </Button>
          <Button
            variant="cyan"
            size="sm"
            onClick={handlePlace}
            loading={placing}
            disabled={!selectedElementId || placing}
            icon={<Plus className="w-4 h-4" />}
          >
            Place Element
          </Button>
        </div>
      </div>
    </Modal>
  );
};
