'use client';

import React, { useState } from 'react';
import {
  Settings,
  Phone,
  TreePine,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Globe,
  LogOut,
  ChevronRight,
  Award,
  Leaf,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import {
  formatText,
  getDictionary,
  getLanguageMeta,
  Lang,
  SUPPORTED_LANGUAGES,
} from '@/lib/i18n';

interface TabMoreProps {
  user: UserProfile;
  currentLang: Lang;
  onChangeLang: (lang: Lang) => void;
  onOpenEcoImpact: () => void;
  onOpenHandbook: () => void;
  onOpenHistory: (tab?: 'points' | 'orders') => void;
  onOpenFeedback: () => void;
  onOpenAbout: () => void;
  onResetData: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const TabMore: React.FC<TabMoreProps> = ({
  user,
  currentLang,
  onChangeLang,
  onOpenEcoImpact,
  onOpenHandbook,
  onOpenHistory,
  onOpenFeedback,
  onOpenAbout,
  onResetData,
  onOpenAuth,
  onLogout,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const t = getDictionary(currentLang);
  const currentLangMeta = getLanguageMeta(currentLang);
  const displayRank = t.data.ranks[user.rank] || user.rank;

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Header Profile Card */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500 shadow-sm">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
            <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5 truncate">
              <Award size={13} className="text-amber-500 shrink-0" />
              <span className="truncate">{displayRank}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">
              {t.common.memberId} {user.memberCode || 'ECO-TL-883921'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenEcoImpact}
            className="rounded-xl bg-emerald-50 p-2 text-emerald-800 hover:bg-emerald-100 transition-colors"
            title={t.more.viewImpactTitle}
          >
            <Leaf size={18} />
          </button>
        </div>
      </div>

      {/* 2. Special Highlight: Green Passport Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] p-4 text-white shadow-lg">
        <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-emerald-300">
              <TreePine size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {t.more.passportTitle}
              </h4>
              <p className="text-sm font-bold text-white">{t.more.passportSubtitle}</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-900">
            HOT
          </span>
        </div>

        <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
          {formatText(t.more.passportDesc, { co2: user.co2Saved })}
        </p>

        <button
          onClick={onOpenEcoImpact}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-bold text-[#1E4D3E] shadow hover:bg-emerald-50 active:scale-98 transition-all"
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>{t.more.createReportBtn}</span>
        </button>
      </div>

      {/* 3. Settings & Information Menu List */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
        {/* App Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Settings size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.appSettings}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Contact & Hotline */}
        <button
          onClick={onOpenFeedback}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Phone size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.contactHotline}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* About Program */}
        <button
          onClick={onOpenAbout}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <TreePine size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.aboutProgram}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Legal & ESG */}
        <button
          onClick={onOpenAbout}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <ShieldAlert size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.legalEsg}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* User Guide */}
        <button
          onClick={onOpenHandbook}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.userGuide}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Order History */}
        <button
          onClick={() => onOpenHistory('orders')}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">{t.more.orderHistory}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Display Language (5 Languages) */}
        <button
          onClick={() => setIsLangModalOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Globe size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {t.more.displayLanguage}
            </span>
          </div>
          <span className="text-xs font-bold text-[#1E4D3E] bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200">
            <span>{currentLangMeta.flag}</span>
            <span>{currentLangMeta.nativeName}</span>
          </span>
        </button>

        {/* Sign Out */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-between p-3 hover:bg-amber-50 rounded-2xl transition-colors text-amber-800"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="text-xs font-bold">{t.more.signOut}</span>
            </div>
            <ChevronRight size={16} className="text-amber-300" />
          </button>
        )}

        {/* Reset Demo Data */}
        <button
          onClick={onResetData}
          className="flex w-full items-center justify-between p-3 hover:bg-red-50 rounded-2xl transition-colors text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-xs font-bold">{t.more.resetDemoData}</span>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 text-[10px] text-slate-400">
        <p>EcoStay Mobile Web • v2.2</p>
        <p className="mt-0.5">{t.more.developedBy}</p>
      </div>

      {/* Language Selector Modal (5 Languages: VI, EN, KO, JA, ZH) */}
      {isLangModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsLangModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-left max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-800">{t.more.selectLangTitle}</h4>
              </div>
              <button
                onClick={() => setIsLangModalOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">{t.more.selectLangDesc}</p>

            <div className="space-y-2 overflow-y-auto pr-0.5">
              {SUPPORTED_LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => {
                    onChangeLang(langItem.code);
                    setIsLangModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    currentLang === langItem.code
                      ? 'border-emerald-500 bg-emerald-50 text-[#1E4D3E] font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{langItem.flag}</span>
                    <div className="text-left">
                      <p className="text-xs font-bold">{langItem.nativeName}</p>
                      <p className="text-[10px] text-slate-400">{langItem.subtitle}</p>
                    </div>
                  </div>
                  {currentLang === langItem.code && (
                    <Check size={18} className="text-emerald-700 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLangModalOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white hover:bg-[#16392E]"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal (Includes Switch Account inside!) */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-800">{t.more.appSettings}</h4>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">{t.more.settingsNotifTitle}</p>
                  <p className="text-[10px] text-slate-400">{t.more.settingsNotifDesc}</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5 shrink-0">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">{t.more.settingsCameraTitle}</p>
                  <p className="text-[10px] text-slate-400">{t.more.settingsCameraDesc}</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5 shrink-0">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">{t.more.settingsOfflineTitle}</p>
                  <p className="text-[10px] text-slate-400">{t.more.settingsOfflineDesc}</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5 shrink-0">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-between rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-3 hover:bg-emerald-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#1E4D3E] border border-emerald-200">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1E4D3E]">{t.more.switchAccountTitle}</p>
                      <p className="text-[10px] text-slate-500">{t.more.switchAccountDesc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-emerald-700" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white hover:bg-[#16392E]"
            >
              {t.more.saveSettingsBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
