import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LogOut, Sparkles, Compass, Crown, Box } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'avatars';
  onTabChange: (tab: 'dashboard' | 'avatars') => void;
  onOpenAvatarModal?: () => void;
  onOpenAdminStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAvatarModal,
  onOpenAdminStudio,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-[#141416] bg-[#222226] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between font-mono">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onTabChange('dashboard')}>
            {/* Minecraft Block Icon */}
            <div className="w-9 h-9 bg-[#3B7A23] border-t-2 border-l-2 border-[#559E37] border-b-2 border-r-2 border-[#1C420D] flex items-center justify-center shadow">
              <Box className="w-5 h-5 text-[#855F37]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white mc-text">
                MINECRAFT<span className="text-[#4DEDF3]">VERSE</span>
              </span>
              <span className="block text-[9px] tracking-widest text-[#55FF55] uppercase font-bold -mt-0.5 mc-text">
                2D GATHER EDITION
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`mc-btn flex items-center gap-1.5 px-3 py-1.5 text-xs ${
                currentTab === 'dashboard'
                  ? 'mc-btn-emerald'
                  : 'mc-btn-stone'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Worlds</span>
            </button>
            <button
              onClick={() => onOpenAvatarModal ? onOpenAvatarModal() : onTabChange('avatars')}
              className={`mc-btn flex items-center gap-1.5 px-3 py-1.5 text-xs ${
                currentTab === 'avatars'
                  ? 'mc-btn-diamond'
                  : 'mc-btn-stone'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skins / Wardrobe</span>
            </button>
            {user?.role === 'Admin' && onOpenAdminStudio && (
              <button
                onClick={onOpenAdminStudio}
                className="mc-btn mc-btn-gold flex items-center gap-1.5 px-3 py-1.5 text-xs"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </button>
            )}
          </nav>
        </div>

        {/* User Session Profile & Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div
              onClick={onOpenAvatarModal}
              className="mc-slot flex items-center gap-2.5 px-3 py-1 cursor-pointer select-none"
              title="Click to customize skin"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.username}
                size="sm"
                status="online"
                className="rounded-none border border-[#4A4A52]"
              />
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white mc-text">
                    {user.username}
                  </span>
                  {user.role === 'Admin' ? (
                    <Badge variant="warning" className="text-[9px] py-0 px-1">
                      👑 Admin
                    </Badge>
                  ) : (
                    <Badge variant="cyan" className="text-[9px] py-0 px-1">
                      LVL 24
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] text-[#4DEDF3] hover:underline mc-text">
                  Edit Skin
                </span>
              </div>
            </div>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            icon={<LogOut className="w-3.5 h-3.5" />}
            title="Disconnect"
          >
            <span className="hidden sm:inline">Quit</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
