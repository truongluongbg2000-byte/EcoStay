'use client';

import React from 'react';
import { Home, Gift, QrCode, Footprints, Menu } from 'lucide-react';
import { getDictionary, Lang } from '@/lib/i18n';

export type TabId = 'home' | 'rewards' | 'scanner' | 'earn' | 'more';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  cartCount?: number;
  currentLang?: Lang;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount = 0,
  currentLang = 'vi',
}) => {
  const t = getDictionary(currentLang);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
      <nav className="relative flex items-center justify-between border-t border-emerald-900/10 bg-white/95 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-1 min-w-0 flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'home' ? 'text-[#1E4D3E]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-emerald-50' : ''}`}>
            <Home size={20} className={activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          </div>
          <span className={`text-[10px] mt-0.5 truncate max-w-full ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            {t.nav.home}
          </span>
        </button>

        {/* Tab 2: Rewards */}
        <button
          onClick={() => onSelectTab('rewards')}
          className={`relative flex flex-1 min-w-0 flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'rewards' ? 'text-[#1E4D3E]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'rewards' ? 'bg-emerald-50' : ''}`}>
            <Gift size={20} className={activeTab === 'rewards' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          </div>
          <span className={`text-[10px] mt-0.5 truncate max-w-full ${activeTab === 'rewards' ? 'font-bold' : 'font-medium'}`}>
            {t.nav.rewards}
          </span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97736] text-[9px] font-bold text-white shadow">
              {cartCount}
            </span>
          )}
        </button>

        {/* Tab 3: Center QR Scanner */}
        <div className="flex flex-1 min-w-0 flex-col items-center justify-center">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`relative -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#1E4D3E] via-[#2D6A56] to-emerald-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
              activeTab === 'scanner' ? 'ring-4 ring-emerald-200' : ''
            }`}
            aria-label={t.nav.scanner}
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping pointer-events-none" />
            <QrCode size={26} className="relative z-10" />
          </button>
          <span
            className={`text-[10px] -mt-2 truncate max-w-full ${
              activeTab === 'scanner' ? 'font-bold text-[#1E4D3E]' : 'font-medium text-slate-400'
            }`}
          >
            {t.nav.scanner}
          </span>
        </div>

        {/* Tab 4: Earn Points */}
        <button
          onClick={() => onSelectTab('earn')}
          className={`flex flex-1 min-w-0 flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'earn' ? 'text-[#1E4D3E]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'earn' ? 'bg-emerald-50' : ''}`}>
            <Footprints size={20} className={activeTab === 'earn' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          </div>
          <span className={`text-[10px] mt-0.5 truncate max-w-full ${activeTab === 'earn' ? 'font-bold' : 'font-medium'}`}>
            {t.nav.earn}
          </span>
        </button>

        {/* Tab 5: More */}
        <button
          onClick={() => onSelectTab('more')}
          className={`flex flex-1 min-w-0 flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'more' ? 'text-[#1E4D3E]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'more' ? 'bg-emerald-50' : ''}`}>
            <Menu size={20} className={activeTab === 'more' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          </div>
          <span className={`text-[10px] mt-0.5 truncate max-w-full ${activeTab === 'more' ? 'font-bold' : 'font-medium'}`}>
            {t.nav.more}
          </span>
        </button>
      </nav>
    </div>
  );
};
