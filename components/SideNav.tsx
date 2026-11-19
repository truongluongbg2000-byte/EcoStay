'use client';

import React from 'react';
import { Home, Gift, QrCode, Footprints, Menu, Bot } from 'lucide-react';
import { getDictionary, Lang } from '@/lib/i18n';
import { UserProfile } from '@/data/types';
import type { TabId } from './BottomNav';

interface SideNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenAIChat: () => void;
  cartCount?: number;
  currentLang?: Lang;
  user: UserProfile;
}

/** Desktop-only (lg+) left navigation. Mirrors BottomNav's tabs. */
export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAIChat,
  cartCount = 0,
  currentLang = 'vi',
  user,
}) => {
  const t = getDictionary(currentLang);
  const displayRank = t.data.ranks[user.rank] || user.rank;

  const items: { id: TabId; label: string; Icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: t.nav.home, Icon: Home },
    { id: 'rewards', label: t.nav.rewards, Icon: Gift, badge: cartCount },
    { id: 'scanner', label: t.nav.scanner, Icon: QrCode },
    { id: 'earn', label: t.nav.earn, Icon: Footprints },
    { id: 'more', label: t.nav.more, Icon: Menu },
  ];

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-60 shrink-0 flex-col self-start border-r border-emerald-900/10 bg-white px-4 py-5">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2">
        <img src="/icon-192.png" alt="EcoStay" className="h-9 w-9 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className="text-base font-extrabold tracking-tight text-[#1E4D3E]">EcoStay</p>
          <p className="text-[10px] font-medium text-slate-500 truncate">{t.desktop.tagline}</p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="mt-8 flex flex-col gap-1">
        {items.map(({ id, label, Icon, badge }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-emerald-50 font-bold text-[#1E4D3E]'
                  : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={19} className={active ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
              <span className="flex-1 text-left">{label}</span>
              {!!badge && badge > 0 && (
                <span className="rounded-full bg-[#D97736] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* EcoBot */}
      <button
        type="button"
        onClick={onOpenAIChat}
        className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#1E4D3E] to-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
      >
        <Bot size={19} />
        <span>{t.desktop.ecoBot}</span>
      </button>

      {/* User */}
      <button
        type="button"
        onClick={() => onSelectTab('more')}
        className="mt-auto flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 text-left hover:bg-slate-50"
      >
        <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
          <p className="truncate text-[11px] text-slate-500">{displayRank}</p>
        </div>
      </button>
    </aside>
  );
};
