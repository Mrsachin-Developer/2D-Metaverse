import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { spaceService } from '../../src/services/space.service';
import type { SpaceItem } from '../types/api';
import { Navbar } from '../components/layout/Navbar';
import { SpaceCard } from '../components/dashboard/SpaceCard';
import { CreateSpaceModal } from '../components/dashboard/CreateSpaceModal';
import { AvatarSelectModal } from '../components/avatar/AvatarSelectModal';
import { AdminStudioModal } from '../components/admin/AdminStudioModal';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import {
  Plus,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Compass,
  Layers,
  Crown,
  Play,
  Coffee,
  Gamepad2,
  Briefcase,
  Monitor,
  Mic,
} from 'lucide-react';
import { ApiError } from '../services/api';

const PUBLIC_COMMUNITY_WORLDS = [
  {
    id: 'cmwboo8tg002rnkdcphgq1aza',
    name: '🏛️ Gather & Zepto Multi-Room Campus',
    shortName: 'Multi-Room Campus',
    type: '4-Room Hub',
    dimensions: '30×22',
    elementsCount: '78 Pre-built Elements',
    desc: 'A complete spatial campus divided into 4 distinct themed zones with walk-through doorways:',
    highlights: [
      { label: 'Cafeteria', sub: 'Vending & Snack Bar', icon: Coffee, color: 'text-amber-400' },
      { label: 'Gaming Room', sub: 'Arcades & RGB Stations', icon: Gamepad2, color: 'text-[#4DEDF3]' },
      { label: 'Boardroom', sub: 'Whiteboard & Table', icon: Briefcase, color: 'text-emerald-400' },
      { label: 'Tech Bullpen', sub: 'Workstation Rows', icon: Monitor, color: 'text-purple-400' },
    ],
  },
  {
    id: 'cmwbq3p3j0031k0dcb9m2k0gz',
    name: '☕ Cozy Rooftop Coffee Lounge',
    shortName: 'Coffee Lounge',
    type: 'Social Mixer',
    dimensions: '20×15',
    elementsCount: '39 Pre-built Elements',
    desc: 'A cozy speakeasy & social hangout for casual team mixers, coffee chats, and relaxation:',
    highlights: [
      { label: 'Espresso Bar', sub: 'Coffee & Snacks', icon: Coffee, color: 'text-amber-400' },
      { label: 'Living Room', sub: 'Leather Sofas & Rugs', icon: Sparkles, color: 'text-meta-gold' },
      { label: 'Dining Alcove', sub: 'Booths & Tables', icon: Briefcase, color: 'text-[#4DEDF3]' },
      { label: 'Pet Corner', sub: 'Corgi & Arcade', icon: Gamepad2, color: 'text-emerald-400' },
    ],
  },
  {
    id: 'cmwbq3qgz0045k0dc8fxq36af',
    name: '🎤 Keynote Auditorium & All-Hands Hall',
    shortName: 'Keynote Auditorium',
    type: 'Conference Theater',
    dimensions: '22×16',
    elementsCount: '68 Pre-built Elements',
    desc: 'An auditorium for company all-hands, tech presentations, keynote talks, and workshops:',
    highlights: [
      { label: 'Stage & Podium', sub: 'Dual Whiteboards', icon: Monitor, color: 'text-[#4DEDF3]' },
      { label: 'Audience Theater', sub: '3 Seating Rows', icon: Layers, color: 'text-emerald-400' },
      { label: 'VIP Lounge', sub: 'Speaker Green Room', icon: Sparkles, color: 'text-meta-gold' },
      { label: 'AV Tech Booth', sub: 'Servers & Dual PC', icon: Mic, color: 'text-purple-400' },
    ],
  },
];

interface DashboardProps {
  onEnterSpace: (spaceId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEnterSpace }) => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'avatars'>('dashboard');
  const [selectedPublicIndex, setSelectedPublicIndex] = useState(0);

  const selectedPublicWorld = PUBLIC_COMMUNITY_WORLDS[selectedPublicIndex];

  const fetchSpaces = useCallback(async () => {
    setLoadingSpaces(true);
    setError(null);
    try {
      const res = await spaceService.getAllSpaces();
      // Filter out the featured public spaces so they don't duplicate in "Your Worlds"
      const publicIds = new Set(PUBLIC_COMMUNITY_WORLDS.map((w) => w.id));
      const userOwned = (res.spaces || []).filter((s) => !publicIds.has(s.id));
      setSpaces(userOwned);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load your spaces. Please ensure the backend is running.');
      }
    } finally {
      setLoadingSpaces(false);
    }
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleDeleteSpace = async (spaceId: string) => {
    try {
      await spaceService.deleteSpace(spaceId);
      setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete space');
    }
  };

  const handleSpaceCreated = (spaceId: string) => {
    fetchSpaces();
    onEnterSpace(spaceId);
  };

  return (
    <div className="min-h-screen bg-meta-bg text-meta-text flex flex-col font-mono">
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'avatars') {
            setIsAvatarOpen(true);
          }
        }}
        onOpenAvatarModal={() => setIsAvatarOpen(true)}
        onOpenAdminStudio={() => setIsAdminStudioOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Welcome & Command Hero Header — Minecraft Stone Panel */}
        <section className="relative mc-panel p-6 sm:p-8 overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                onClick={() => setIsAvatarOpen(true)}
                className="cursor-pointer group relative"
                title="Change Skin"
              >
                <Avatar
                  src={user?.avatarUrl}
                  name={user?.username}
                  size="xl"
                  status="online"
                />
                <span className="absolute bottom-0 inset-x-0 bg-[#141417]/90 text-[9px] text-center font-bold py-0.5 opacity-0 group-hover:opacity-100 transition-opacity mc-text">
                  EDIT
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mc-text">
                    Welcome, {user?.username}
                  </h1>
                  <Badge variant={user?.role === 'Admin' ? 'warning' : 'cyan'}>
                    {user?.role === 'Admin' ? '👑 Admin' : 'Explorer'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-meta-muted">
                  Explore persistent multiplayer arenas or build custom virtual rooms.
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-meta-muted">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#4DEDF3]" />
                    {spaces.length} Custom {spaces.length === 1 ? 'World' : 'Worlds'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#55FF55]" style={{ display: 'inline-block' }} />
                    Multiplayer Gateway Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions — Minecraft buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {user?.role === 'Admin' && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsAdminStudioOpen(true)}
                  icon={<Crown className="w-4 h-4 text-meta-gold" />}
                  className="mc-btn mc-btn-gold"
                >
                  Admin Studio
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsAvatarOpen(true)}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Wardrobe
              </Button>
              <Button
                variant="cyan"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                icon={<Plus className="w-4 h-4" />}
                className="flex-1 sm:flex-initial"
              >
                ⛏ Create World
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Community Campus Showcase with Multi-World Selector */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-meta-gold" />
              <h2 className="text-base font-bold text-white mc-text uppercase tracking-wide">
                Featured Community Worlds (Always Online)
              </h2>
            </div>

            {/* World Switcher Tabs */}
            <div className="flex items-center gap-1">
              {PUBLIC_COMMUNITY_WORLDS.map((w, idx) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedPublicIndex(idx)}
                  className={`mc-btn px-2.5 py-1 text-[11px] font-bold ${
                    selectedPublicIndex === idx
                      ? 'mc-btn-emerald'
                      : 'mc-btn-stone'
                  }`}
                >
                  {w.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="mc-panel p-5 sm:p-6 bg-[#222228] border-2 border-[#585860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-white mc-text">
                  {selectedPublicWorld.name}
                </span>
                <Badge variant="accent">{selectedPublicWorld.dimensions} Map</Badge>
                <Badge variant="warning">{selectedPublicWorld.elementsCount}</Badge>
                <Badge variant="cyan">{selectedPublicWorld.type}</Badge>
              </div>
              <p className="text-xs text-meta-muted leading-relaxed">
                {selectedPublicWorld.desc}
              </p>

              {/* Room highlights pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {selectedPublicWorld.highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div key={i} className="mc-slot p-2 flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${h.color} shrink-0`} />
                      <div>
                        <span className="font-bold text-white block text-[11px] mc-text">
                          {h.label}
                        </span>
                        <span className="text-[10px] text-meta-muted">{h.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enter Button */}
            <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onEnterSpace(selectedPublicWorld.id)}
                icon={<Play className="w-4 h-4 fill-current" />}
                className="w-full lg:w-auto"
              >
                ▶ Enter {selectedPublicWorld.shortName}
              </Button>
            </div>
          </div>
        </section>

        {/* User's Created Spaces Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#4DEDF3]" />
              <h2 className="text-base font-bold text-meta-text mc-text uppercase tracking-wide">
                Your Custom Worlds ({spaces.length})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSpaces}
              loading={loadingSpaces}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loadingSpaces ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mc-slot flex items-center justify-between p-4 text-xs text-meta-redstone">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={fetchSpaces}>
                Retry
              </Button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loadingSpaces && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mc-panel h-64 animate-pulse p-4 flex flex-col justify-between"
                >
                  <div className="w-full h-32 mc-slot" />
                  <div className="space-y-2">
                    <div className="w-2/3 h-4 bg-meta-elevated" />
                    <div className="w-1/3 h-3 bg-meta-elevated/60" />
                  </div>
                  <div className="w-full h-8 bg-meta-elevated/60" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State when no personal worlds created */}
          {!loadingSpaces && !error && spaces.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 mc-panel text-center">
              <div className="w-14 h-14 mc-slot flex items-center justify-center mb-3">
                <Compass className="w-7 h-7 text-[#4DEDF3]" />
              </div>
              <h3 className="text-sm font-bold text-white mc-text">No custom worlds created yet</h3>
              <p className="text-xs text-meta-muted max-w-sm mt-1 mb-5">
                Join the Featured Worlds above or spawn a new custom world from the template layout.
              </p>
              <Button
                variant="cyan"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                ⛏ Create Your Custom World
              </Button>
            </div>
          )}

          {/* Space Grid */}
          {!loadingSpaces && !error && spaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onEnter={onEnterSpace}
                  onDelete={handleDeleteSpace}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <CreateSpaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSpaceCreated={handleSpaceCreated}
      />

      <AvatarSelectModal
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
      />

      <AdminStudioModal
        isOpen={isAdminStudioOpen}
        onClose={() => setIsAdminStudioOpen(false)}
      />
    </div>
  );
};
