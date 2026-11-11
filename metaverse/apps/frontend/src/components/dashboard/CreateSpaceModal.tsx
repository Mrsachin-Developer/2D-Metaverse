import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { spaceService } from '../../services/space.service';
import { ApiError } from '../../services/api';
import { Sparkles, AlertCircle, Building2, Grid } from 'lucide-react';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceCreated: (spaceId: string) => void;
}

const TEMPLATES = [
  {
    id: 'cmwboo75y000knkdc7wewqmsw',
    name: '🏛️ Multi-Room Campus (4-Room Hub)',
    desc: 'Full campus: Cafeteria ☕, Gaming Room 🎮, Boardroom 💼, Tech Bullpen 💻',
    dimensions: '30x22',
    hasElements: true,
    tag: '78 Elements',
  },
  {
    id: 'cmwbq3m8e0000k0dccwc12rpi',
    name: '☕ Cozy Rooftop Coffee Lounge',
    desc: 'Social mixer: Espresso bar, booth seating, living room couches, arcade & pets',
    dimensions: '20x15',
    hasElements: true,
    tag: '39 Elements',
  },
  {
    id: 'cmwbq3njg0014k0dc8mc777dt',
    name: '🎤 Keynote Auditorium & All-Hands',
    desc: 'Conference hall: Presentation stage, 3 rows audience theater, VIP lounge & tech booth',
    dimensions: '22x16',
    hasElements: true,
    tag: '68 Elements',
  },
];

export const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  onSpaceCreated,
}) => {
  const [name, setName] = useState('');
  const [spaceType, setSpaceType] = useState<'template' | 'blank'>('template');
  const [selectedMapId, setSelectedMapId] = useState<string>(TEMPLATES[0].id);
  const [dimensions, setDimensions] = useState('50x50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Space name is required');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (spaceType === 'template' && selectedMapId) {
        const chosen = TEMPLATES.find((t) => t.id === selectedMapId) || TEMPLATES[0];
        res = await spaceService.createSpace({
          name: trimmedName,
          dimensions: chosen.dimensions,
          mapId: chosen.id,
        });
      } else {
        res = await spaceService.createSpace({
          name: trimmedName,
          dimensions,
        });
      }

      setName('');
      onSpaceCreated(res.spaceId);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create space');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⛏ Create New World"
      description="Choose a pre-furnished Gather layout or build a custom arena from scratch"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 font-mono">
        {error && (
          <div className="mc-slot flex items-center gap-2 p-3 text-xs text-meta-redstone">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="World Name"
          placeholder="e.g. Acme HQ, Design Critique Lounge"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        {/* Space Type Selector — Minecraft buttons */}
        <div>
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2" style={{ textShadow: '1px 1px 0px #000' }}>
            Choose World Layout
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSpaceType('template')}
              className={`mc-btn flex items-start gap-2.5 p-3 text-left ${
                spaceType === 'template'
                  ? 'mc-btn-emerald'
                  : 'mc-btn-stone'
              }`}
            >
              <Building2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold block">Furnished Layout</span>
                <span className="text-[10px] opacity-80 block mt-0.5">
                  Pre-placed furniture & rooms
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSpaceType('blank')}
              className={`mc-btn flex items-start gap-2.5 p-3 text-left ${
                spaceType === 'blank'
                  ? 'mc-btn-diamond'
                  : 'mc-btn-stone'
              }`}
            >
              <Grid className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold block">Blank Canvas</span>
                <span className="text-[10px] opacity-80 block mt-0.5">
                  Empty arena to build custom
                </span>
              </div>
            </button>
          </div>

          {/* Template Selector with All 3 Gather Town Maps */}
          {spaceType === 'template' && (
            <div className="space-y-2 mt-2 max-h-[220px] overflow-y-auto pr-1">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedMapId(tpl.id)}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedMapId === tpl.id
                      ? 'mc-panel border-2 border-[#55AA33]'
                      : 'mc-slot hover:brightness-110'
                  }`}
                  style={selectedMapId === tpl.id ? { outline: '2px solid #55AA33' } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white mc-text">{tpl.name}</span>
                    <span className="text-[10px] text-[#55FF55] font-bold mc-text-emerald">
                      ✓ {tpl.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-meta-muted mt-1">{tpl.desc}</p>
                  <p className="text-[10px] text-[#4DEDF3] mt-1">
                    Dimensions: {tpl.dimensions}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Blank dimension selector */}
          {spaceType === 'blank' && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['25x25', '50x50', '100x100'].map((dim) => (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setDimensions(dim)}
                  className={`mc-btn py-2 text-center text-xs ${
                    dimensions === dim
                      ? 'mc-btn-diamond'
                      : 'mc-btn-stone'
                  }`}
                >
                  {dim}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t-2 border-[#35353E]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="cyan"
            loading={loading}
            icon={<Sparkles className="w-4 h-4" />}
          >
            ⛏ Create World
          </Button>
        </div>
      </form>
    </Modal>
  );
};
