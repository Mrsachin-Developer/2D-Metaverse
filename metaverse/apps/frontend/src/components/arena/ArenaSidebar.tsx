import React, { useState } from 'react';
import type { Player } from '../../types/websocket';
import { Avatar } from '../ui/Avatar';
import { UserPlus, MessageSquare, Users, Search, Check, ChevronLeft, ChevronRight, Mic } from 'lucide-react';

interface ArenaSidebarProps {
  currentUser: Player | null;
  otherPlayers: Map<string, Player>;
  spaceName?: string;
  onCopyLink: () => void;
  copied: boolean;
}

export const ArenaSidebar: React.FC<ArenaSidebarProps> = ({
  currentUser,
  otherPlayers,
  spaceName = 'Gather Space',
  onCopyLink,
  copied,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');

  const totalCount = (currentUser ? 1 : 0) + otherPlayers.size;

  const filteredOtherPlayers = Array.from(otherPlayers.values()).filter((p) => {
    if (!searchQuery.trim()) return true;
    const name = p.username || `Explorer ${p.userId.slice(0, 5)}`;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <aside
      className={`relative z-20 flex flex-col h-full bg-[#1D1D22] transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-72'
      }`}
      style={{ borderRight: '3px solid #101014' }}
    >
      {/* Collapse Toggle Handle — blocky */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-30 w-6 h-6 mc-btn mc-btn-stone flex items-center justify-center text-gray-300 hover:text-white focus:outline-none"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Navigation — mc-panel style */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#26262D]"
           style={{ borderBottom: '3px solid #101014' }}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('participants')}
            className={`relative mc-btn p-2 text-xs ${
              activeTab === 'participants'
                ? 'mc-btn-emerald'
                : 'mc-btn-stone'
            }`}
            title="Participants"
          >
            <Users className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#55AA33] text-[9px] font-bold text-white flex items-center justify-center">
              {totalCount}
            </span>
          </button>

          {!collapsed && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`mc-btn p-2 text-xs ${
                activeTab === 'chat'
                  ? 'mc-btn-diamond'
                  : 'mc-btn-stone'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>

        {!collapsed && (
          <span className="text-xs font-bold text-gray-200 truncate mc-text">
            {spaceName}
          </span>
        )}
      </div>

      {/* Search Input — mc-slot style */}
      {!collapsed && (
        <div className="p-3 border-b-2 border-[#35353E]">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mc-slot text-xs text-white placeholder-gray-400 pl-9 pr-3 py-1.5 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Roster Section Header */}
      {!collapsed && (
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-meta-muted uppercase tracking-wider mc-text">
            IN THIS SPACE ({totalCount})
          </span>
        </div>
      )}

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {/* You */}
        {currentUser && (
          <div
            className={`flex items-center gap-3 px-3 py-2 mc-slot ${
              collapsed ? 'justify-center px-1' : ''
            }`}
          >
            <div className="relative shrink-0">
              <Avatar
                src={currentUser.avatarUrl}
                name={currentUser.username || 'You'}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#55FF55] ring-2 ring-[#1D1D22]" />
            </div>

            {!collapsed && (
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate mc-text">
                    {currentUser.username || 'You'}
                  </span>
                  <span className="text-[9px] bg-[#55AA33] text-white px-1.5 py-0.5 font-bold mc-text">
                    YOU
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  ({currentUser.x}, {currentUser.y})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Other connected participants */}
        {filteredOtherPlayers.map((player) => (
          <div
            key={player.userId}
            className={`flex items-center gap-3 px-3 py-2 hover:bg-[#26262D] transition-colors cursor-pointer group ${
              collapsed ? 'justify-center px-1' : ''
            }`}
          >
            <div className="relative shrink-0">
              <Avatar
                src={player.avatarUrl}
                name={player.username || `Explorer`}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#55FF55] ring-2 ring-[#1D1D22]" />
            </div>

            {!collapsed && (
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-200 group-hover:text-white truncate mc-text">
                    {player.username || `Explorer ${player.userId.slice(0, 5)}`}
                  </span>
                  <Mic className="w-3 h-3 text-gray-500 opacity-60" />
                </div>
                <span className="text-[10px] text-gray-400">
                  Online
                </span>
              </div>
            )}
          </div>
        ))}

        {!collapsed && otherPlayers.size === 0 && (
          <div className="py-10 text-center text-gray-400 text-xs px-4 mc-text">
            No one else is here yet.
            <div className="text-[11px] text-gray-500 mt-1">
              Click "+ Invite" below to share this room!
            </div>
          </div>
        )}
      </div>

      {/* Bottom Invite Button — Minecraft emerald style */}
      <div className="p-3 bg-[#26262D]"
           style={{ borderTop: '3px solid #585860' }}>
        <button
          onClick={onCopyLink}
          className={`w-full mc-btn py-2.5 px-4 font-bold text-xs text-white flex items-center justify-center gap-2 ${
            copied
              ? 'mc-btn-emerald'
              : 'mc-btn-diamond'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              {!collapsed && <span>+ Invite</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
