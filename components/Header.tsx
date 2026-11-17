'use client';

import React from 'react';
import { Bell, Sparkles, UserCheck } from 'lucide-react';
import { UserProfile } from '@/data/types';
import { rankTranslations } from '@/data/translations';

interface HeaderProps {
  user: UserProfile;
  currentLang?: 'vi' | 'en';
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentLang = 'vi',
  onOpenNotifications,
  onOpenProfile,
  onOpenAuth,
}) => {
  const isEn = currentLang === 'en';
  const displayRank = isEn ? rankTranslations[user.rank] || user.rank : user.rank;

  return (
    <header className="sticky top-0 z-30 bg-[#1E4D3E] px-4 pt-4 pb-3.5 text-white shadow-md">
      <div className="flex items-center justify-between">
        {/* User Info & Avatar */}
        <div
          onClick={onOpenAuth || onOpenProfile}
          className="flex items-center gap-3 cursor-pointer group"
          title={isEn ? 'Click to switch account' : 'Nhấn để đổi tài khoản'}
        >
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-300 shadow-sm transition-transform group-hover:scale-105">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#1E4D3E]" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <p className="text-[11px] text-emerald-200/90 font-medium">
                {isEn ? 'Hello,' : 'Xin chào,'}
              </p>
              <span className="inline-block rounded-full bg-emerald-700/60 px-1.5 py-0.2 text-[9px] text-emerald-300">
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

        {/* Right side: Switch button + Points pill + Bell */}
        <div className="flex items-center gap-1.5">
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-emerald-200 border border-white/10 hover:bg-white/20 transition-colors shadow-2xs"
              title={isEn ? 'Switch Account' : 'Đổi tài khoản'}
            >
              <UserCheck size={12} className="text-amber-300" />
              <span>{isEn ? 'Switch' : 'Đổi TK'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-white/10 backdrop-blur-sm">
            <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{user.carbonPoints} CP</span>
          </div>

          <button
            onClick={onOpenNotifications}
            className="relative rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            aria-label={isEn ? 'Notifications' : 'Thông báo'}
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D97736] px-1 text-[9px] font-extrabold text-white shadow">
              99+
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
