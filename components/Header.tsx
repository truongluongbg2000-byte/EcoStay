'use client';

import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { UserProfile } from '@/data/types';
import { getDictionary, Lang } from '@/lib/i18n';

interface HeaderProps {
  user: UserProfile;
  currentLang?: Lang;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentLang = 'vi',
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const t = getDictionary(currentLang);
  const displayRank = t.data.ranks[user.rank] || user.rank;

  return (
    <header className="sticky top-0 z-30 bg-[#1E4D3E] px-4 pt-4 pb-3.5 text-white shadow-md">
      <div className="flex items-center justify-between">
        {/* User Info & Avatar */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
          title={t.header.openProfile}
        >
          <div className="relative shrink-0">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-300 shadow-sm transition-transform group-hover:scale-105">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#1E4D3E]" />
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-[11px] text-emerald-200/90 font-medium truncate">
                {t.header.hello}
              </p>
              <span className="inline-block shrink-0 rounded-full bg-emerald-700/60 px-1.5 py-0.2 text-[9px] text-emerald-300">
                {user.roomNumber}
              </span>
            </div>
            <h2 className="text-sm font-bold tracking-tight text-white line-clamp-1">
              {user.name}
            </h2>
            <p className="text-[10px] text-emerald-200/80 font-medium line-clamp-1">
              {displayRank}
            </p>
          </div>
        </div>

        {/* Right side: CB Points pill + Bell (red dot only when unread > 0) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-white/10 backdrop-blur-sm">
            <Sparkles
              size={13}
              className="text-amber-400 animate-spin"
              style={{ animationDuration: '6s' }}
            />
            <span>{user.carbonPoints} CB</span>
          </div>

          <button
            onClick={onOpenNotifications}
            className="relative rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label={t.header.notifications}
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white shadow ring-2 ring-[#1E4D3E]">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
