'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Leaf, Droplets, Zap, TreePine, ChevronRight } from 'lucide-react';
import { formatText, getDictionary, Lang } from '@/lib/i18n';
import { DetailedMission, UserProfile } from '@/data/types';
import { greenDestinations } from '@/data/greenDestinations';
import type { TabId } from './BottomNav';

/** Team-provided QR image; falls back to a generated QR for the current URL if missing. */
const APP_QR_IMAGE = '/qr-app.png';

export const OpenOnPhoneQR: React.FC<{ currentLang: Lang; tone?: 'light' | 'dark' }> = ({
  currentLang,
  tone = 'light',
}) => {
  const t = getDictionary(currentLang);
  const [src, setSrc] = useState<string | null>(null);

  // Probe the team QR image after mount (an <img onError> can fire before hydration
  // and be missed); fall back to a generated QR for the current site URL.
  useEffect(() => {
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => !cancelled && setSrc(APP_QR_IMAGE);
    probe.onerror = () => {
      QRCode.toDataURL(window.location.origin, { margin: 1, width: 320, color: { dark: '#1E4D3E' } })
        .then((url) => !cancelled && setSrc(url))
        .catch(() => undefined);
    };
    probe.src = APP_QR_IMAGE;
    return () => {
      cancelled = true;
    };
  }, []);

  const dark = tone === 'dark';
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-4 ${dark ? 'bg-white/10' : 'bg-white border border-slate-100'}`}>
      {src ? (
        <img
          src={src}
          alt={t.desktop.phoneTitle}
          className="h-36 w-36 shrink-0 rounded-xl bg-white object-contain p-1"
        />
      ) : (
        <div className="h-36 w-36 shrink-0 animate-pulse rounded-xl bg-white/60" />
      )}
      <div className="min-w-0">
        <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{t.desktop.phoneTitle}</p>
        <p className={`mt-1 text-xs leading-relaxed ${dark ? 'text-emerald-100/80' : 'text-slate-500'}`}>
          {t.desktop.phoneDesc}
        </p>
      </div>
    </div>
  );
};

export const HowItWorks: React.FC<{ currentLang: Lang; tone?: 'light' | 'dark' }> = ({
  currentLang,
  tone = 'light',
}) => {
  const t = getDictionary(currentLang);
  const dark = tone === 'dark';
  return (
    <ol className="space-y-3">
      {t.desktop.steps.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              dark ? 'bg-emerald-400 text-[#0F2820]' : 'bg-[#1E4D3E] text-white'
            }`}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}>{step.title}</p>
            <p className={`text-xs ${dark ? 'text-emerald-100/75' : 'text-slate-500'}`}>{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-4">
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
    {children}
  </section>
);

interface DesktopRailProps {
  user: UserProfile;
  missions: DetailedMission[];
  currentLang: Lang;
  onNavigate: (tab: TabId) => void;
}

/** Desktop-only (xl+) right column: wallet, impact, today's missions, how it works, QR. */
export const DesktopRail: React.FC<DesktopRailProps> = ({ user, missions, currentLang, onNavigate }) => {
  const t = getDictionary(currentLang);
  const done = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const regionCount = new Set(greenDestinations.map((d) => d.location)).size;

  const impact = [
    { Icon: Leaf, label: t.modals.ecoImpact.co2Label, value: `${user.co2Saved} kg` },
    { Icon: Droplets, label: t.modals.ecoImpact.waterLabel, value: `${user.waterSaved} L` },
    { Icon: Zap, label: t.modals.ecoImpact.energyLabel, value: `${user.energySaved} kWh` },
    { Icon: TreePine, label: t.modals.ecoImpact.treesLabel, value: `${user.treesPlanted}` },
  ];

  return (
    <aside className="hidden xl:flex sticky top-0 h-screen w-80 shrink-0 flex-col gap-4 self-start overflow-y-auto border-l border-emerald-900/10 bg-[#F6F8F6] p-5">
      {/* Wallet */}
      <section className="rounded-2xl bg-[#1E4D3E] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/80">{t.desktop.walletTitle}</p>
        <p className="mt-1 text-4xl font-extrabold">
          {user.carbonPoints}
          <span className="ml-1 text-base font-bold text-emerald-300">CB</span>
        </p>
        <p className="mt-1 text-xs text-emerald-100/70">{formatText(t.desktop.expiresOn, { date: user.expiryDate })}</p>
        <button
          type="button"
          onClick={() => onNavigate('earn')}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
        >
          {t.desktop.earnMore}
          <ChevronRight size={16} />
        </button>
      </section>

      {/* Today's missions */}
      <Card title={t.desktop.todayTitle}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-600">{formatText(t.desktop.todayProgress, { done, total })}</p>
      </Card>

      {/* Personal impact */}
      <Card title={t.desktop.impactTitle}>
        <div className="grid grid-cols-2 gap-2">
          {impact.map(({ Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-emerald-50/60 p-2.5">
              <Icon size={16} className="text-emerald-700" />
              <p className="mt-1 text-base font-bold text-slate-800">{value}</p>
              <p className="text-[10px] leading-tight text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Network */}
      <Card title={t.desktop.networkTitle}>
        <div className="grid grid-cols-3 text-center">
          {[
            { v: greenDestinations.length, l: t.desktop.partners },
            { v: regionCount, l: t.desktop.regions },
            { v: total, l: t.desktop.missions },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-xl font-extrabold text-[#1E4D3E]">{s.v}</p>
              <p className="text-[10px] text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title={t.desktop.howTitle}>
        <HowItWorks currentLang={currentLang} />
      </Card>

      <OpenOnPhoneQR currentLang={currentLang} />
    </aside>
  );
};

/** Desktop-only (lg+) brand panel shown beside the login card. */
export const DesktopBrandPanel: React.FC<{ currentLang: Lang }> = ({ currentLang }) => {
  const t = getDictionary(currentLang);
  return (
    <section className="hidden lg:flex min-h-screen flex-col justify-between bg-gradient-to-br from-[#0F2820] via-[#1E4D3E] to-[#245D4B] px-12 py-10 text-white xl:px-16">
      <div className="flex items-center gap-3">
        <img src="/icon-192.png" alt="EcoStay" className="h-10 w-10 rounded-xl object-cover" />
        <div>
          <p className="text-lg font-extrabold tracking-tight">EcoStay</p>
          <p className="text-xs text-emerald-200/80">{t.desktop.tagline}</p>
        </div>
      </div>

      <div className="max-w-lg">
        <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">{t.desktop.loginHeadline}</h1>
        <p className="mt-4 text-base leading-relaxed text-emerald-100/80">{t.desktop.loginSub}</p>
        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-300">{t.desktop.howTitle}</p>
          <HowItWorks currentLang={currentLang} tone="dark" />
        </div>
      </div>

      <div className="max-w-sm">
        <OpenOnPhoneQR currentLang={currentLang} tone="dark" />
      </div>
    </section>
  );
};
