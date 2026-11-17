'use client';

import React, { useState } from 'react';
import {
  TreePine,
  Sparkles,
  Lock,
  Mail,
  Building2,
  Check,
  Award,
  Zap,
  ArrowRight,
  UserPlus,
  LogIn,
  Globe,
  Leaf,
  ShieldCheck,
  Compass,
  Eye,
  EyeOff,
  CreditCard,
  Wifi,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { MockAccount } from '@/data/types';
import { mockAccounts } from '@/data/mockData';
import { rankTranslations } from '@/data/translations';
import { triggerEcoConfetti } from './Confetti';

interface LoginScreenProps {
  currentLang: 'vi' | 'en';
  onChangeLang: (lang: 'vi' | 'en') => void;
  onLoginSuccess: (account: MockAccount) => void;
  onRegisterSuccess: (data: {
    name: string;
    phone: string;
    email: string;
    hotel: string;
    room: string;
  }) => void;
  onContinueAsGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentLang,
  onChangeLang,
  onLoginSuccess,
  onRegisterSuccess,
  onContinueAsGuest,
}) => {
  const isEn = currentLang === 'en';
  const [activeTab, setActiveTab] = useState<'demo' | 'form' | 'register'>('demo');

  // Login form state
  const [emailInput, setEmailInput] = useState('luong.truong@ecostay.vn');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('123456');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleSelectAccount = (acc: MockAccount) => {
    triggerEcoConfetti();
    onLoginSuccess(acc);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockAccounts.find(
      (a) =>
        a.email.toLowerCase() === emailInput.toLowerCase().trim() ||
        a.phone === emailInput.trim()
    );
    handleSelectAccount(found || mockAccounts[0]);
  };

  const handleGoogleLogin = () => {
    // 1-click Google sign in simulation -> chooses VIP user
    const target = mockAccounts.find((a) => a.id === 'user-2') || mockAccounts[0];
    handleSelectAccount(target);
  };

  const handleAppleLogin = () => {
    // 1-click Apple sign in simulation -> chooses user-1
    const target = mockAccounts.find((a) => a.id === 'user-1') || mockAccounts[0];
    handleSelectAccount(target);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert(isEn ? 'Please enter your full name!' : 'Vui lòng nhập họ và tên của bạn!');
      return;
    }
    triggerEcoConfetti();
    onRegisterSuccess({
      name: regName.trim(),
      phone: regPhone.trim() || '0988 888 999',
      email: regEmail.trim() || 'new.user@ecostay.vn',
      hotel: regHotel,
      room: regRoom || 'Room Eco-101',
    });
  };

  // Luxury Card Styling Helper based on persona
  const getCardTheme = (accId: string) => {
    switch (accId) {
      case 'user-2': // VIP Cổ Thụ Xanh (Nguyễn Hoàng Mai) - Titanium Obsidian & Gold
        return {
          gradient: 'from-[#071710] via-[#0E2E21] to-[#06150E]',
          border: 'border-amber-400/40 hover:border-amber-400',
          chipGradient: 'from-amber-200 via-yellow-400 to-amber-600',
          badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400/50 text-amber-300',
          pointsColor: 'text-amber-300',
          accentText: 'text-amber-200/90',
          tierTag: isEn ? 'VIP TITANIUM • CỔ THỤ XANH' : 'VIP TITANIUM • CỔ THỤ XANH',
          memberCode: 'ECO • HM • 998811',
          shadow: 'shadow-[0_8px_30px_rgb(245,158,11,0.12)]',
        };
      case 'user-1': // Eco Traveler (Trương Thế Lương) - Emerald Prestige
        return {
          gradient: 'from-[#0A261D] via-[#144233] to-[#0B2119]',
          border: 'border-emerald-400/40 hover:border-emerald-400',
          chipGradient: 'from-emerald-200 via-teal-300 to-emerald-600',
          badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
          pointsColor: 'text-emerald-300',
          accentText: 'text-emerald-200/90',
          tierTag: isEn ? 'PRESTIGE • MẦM XANH' : 'PRESTIGE • MẦM XANH',
          memberCode: 'ECO • TL • 883921',
          shadow: 'shadow-[0_8px_30px_rgb(16,185,129,0.12)]',
        };
      case 'user-3': // Global Explorer (David Harrison) - Deep Oceanic Sapphire
        return {
          gradient: 'from-[#0B2332] via-[#133A52] to-[#091D2A]',
          border: 'border-cyan-400/40 hover:border-cyan-400',
          chipGradient: 'from-cyan-200 via-sky-400 to-cyan-600',
          badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
          pointsColor: 'text-cyan-300',
          accentText: 'text-cyan-200/90',
          tierTag: isEn ? 'PASSPORT • GLOBAL EXPLORER' : 'PASSPORT • DU KHÁCH QUỐC TẾ',
          memberCode: 'ECO • DH • 772233',
          shadow: 'shadow-[0_8px_30px_rgb(6,182,212,0.12)]',
        };
      default: // Eco Starter (Lê Minh Khôi) - Modern Lime Emerald
        return {
          gradient: 'from-[#14261F] via-[#1F3D32] to-[#101F19]',
          border: 'border-lime-400/30 hover:border-lime-400',
          chipGradient: 'from-lime-200 via-emerald-400 to-lime-600',
          badgeBg: 'bg-lime-500/20 border-lime-400/40 text-lime-300',
          pointsColor: 'text-lime-300',
          accentText: 'text-lime-200/90',
          tierTag: isEn ? 'MEMBER • ECO STARTER' : 'THÀNH VIÊN • TÂN BINH XANH',
          memberCode: 'ECO • MK • 112233',
          shadow: 'shadow-[0_8px_30px_rgb(132,204,22,0.1)]',
        };
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#071611] text-slate-100 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between p-4 sm:p-5 text-left animate-fadeIn">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Top Bar: Brand, Trust Badges, Language */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pt-1 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-[#1E4D3E] to-teal-400 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-white/20">
              <TreePine size={24} className="text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  <span>EcoStay</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded shadow-xs">
                    VIP PRO
                  </span>
                </h1>
              </div>
              <p className="text-[10px] font-medium text-emerald-300/80">
                {isEn ? 'Net Zero Hospitality Ecosystem' : 'Hệ Sinh Thái Du Lịch Net Zero'}
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <button
            onClick={() => onChangeLang(currentLang === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white border border-white/15 backdrop-blur-md shadow-xs hover:bg-white/20 transition-all active:scale-95"
            title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
          >
            <Globe size={13} className="text-emerald-300" />
            <span>{currentLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
          </button>
        </div>

        {/* Hero Portal Header */}
        <div className="mb-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0E2E22]/80 to-slate-900/90 p-3.5 border border-emerald-500/20 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">
                <ShieldCheck size={11} className="text-emerald-400" />
                <span>ISO 14064 • ESG VERIFIED</span>
              </div>
              <h2 className="mt-1 text-sm font-extrabold text-white">
                {isEn ? 'Traveler Access & Digital Card' : 'Cổng Đăng Nhập & Thẻ Thành Viên Xanh'}
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-300/90 leading-snug">
                {isEn
                  ? 'Access your digital passport, track real-time Carbon Points (CP) & green stays.'
                  : 'Xác thực tài khoản, theo dõi số dư Điểm Cacbon (CP) và ưu đãi lưu trú sinh thái.'}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-amber-300 shadow-inner">
              <Sparkles size={17} />
            </div>
          </div>
        </div>

        {/* Tab Switcher: [ 💳 4 Thẻ VIP Mẫu ] vs [ 🔑 Đăng nhập ] vs [ ✨ Đăng ký (+50) ] */}
        <div className="flex rounded-2xl bg-white/5 p-1 mb-3 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'demo'
                ? 'bg-gradient-to-r from-emerald-600 to-[#1E4D3E] text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard size={13} className={activeTab === 'demo' ? 'text-amber-300' : ''} />
            <span>{isEn ? '4 VIP Cards' : '4 Thẻ VIP Mẫu'}</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-emerald-600 to-[#1E4D3E] text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={13} />
            <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-[#1E4D3E] text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={13} />
            <span>{isEn ? 'Register' : 'Đăng ký'}</span>
          </button>
        </div>

        {/* TAB 1: 4 VIP DIGITAL MEMBERSHIP CARDS (1-CLICK HIGH-END LOGIN) */}
        {activeTab === 'demo' && (
          <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
              <span className="font-semibold">
                {isEn ? 'Tap any card for 1-click instant login:' : 'Chạm vào thẻ VIP để đăng nhập 1 chạm:'}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Zap size={11} className="text-amber-400" />
                <span>Instant Demo Pass</span>
              </span>
            </div>

            {mockAccounts.map((acc) => {
              const theme = getCardTheme(acc.id);
              const displayRole = isEn ? acc.roleBadgeEn : acc.roleBadge;

              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className={`group relative rounded-3xl p-3.5 bg-gradient-to-br ${theme.gradient} border ${theme.border} ${theme.shadow} backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.015] active:scale-98 overflow-hidden`}
                >
                  {/* Card Subtle Watermark & Foil Line */}
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Card Header: Tier Badge, Contactless NFC, EMV Chip */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      {/* EMV Metallic Chip */}
                      <div className={`h-5 w-7 rounded-md bg-gradient-to-br ${theme.chipGradient} shadow-inner flex items-center justify-center p-0.5 border border-white/20`}>
                        <div className="h-full w-full border border-black/20 rounded-xs grid grid-cols-2 gap-0.5 opacity-60">
                          <span className="bg-black/10" />
                          <span className="bg-black/10" />
                        </div>
                      </div>
                      {/* Contactless Waves */}
                      <Wifi size={14} className="text-white/60 rotate-90" />
                      <span className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${theme.badgeBg}`}>
                        {theme.tierTag}
                      </span>
                    </div>

                    {/* Member Code */}
                    <span className="font-mono text-[10px] tracking-widest text-slate-300 font-bold">
                      {theme.memberCode}
                    </span>
                  </div>

                  {/* Card Body: User Info & Big Points */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={acc.profile.avatar}
                          alt={acc.profile.name}
                          className="h-12 w-12 rounded-full object-cover border-2 border-white/30 shadow-md transition-transform group-hover:scale-105"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-[#071611]">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                          {acc.profile.name}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-300 flex items-center gap-1 mt-0.5">
                          <Building2 size={11} className="text-emerald-400" />
                          <span>{acc.profile.hotelName}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {acc.profile.roomNumber}
                        </p>
                      </div>
                    </div>

                    {/* Points Metric & Impact */}
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`text-xl font-black ${theme.pointsColor} tracking-tight`}>
                          {acc.profile.carbonPoints.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black text-emerald-400">CP</span>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-300 block">
                        🌱 {acc.profile.co2Saved}kg CO₂ • {acc.profile.treesPlanted} 🌲
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Fast Login Tap Action */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">
                      {displayRole}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>{isEn ? 'Tap to sign in' : 'Chạm để đăng nhập'}</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MANUAL LOGIN FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleManualLogin} className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
            {/* Social Fast SSO */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-white/20 transition-all active:scale-95"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-white/20 transition-all active:scale-95"
              >
                <svg className="h-4 w-4 shrink-0 fill-current text-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.19-9.5-10.9-20.2-14.13-32.08-3.23-11.89-4.85-23.23-4.85-34.03 0-14.03 3.49-25.76 10.47-35.18 6.98-9.42 15.82-14.23 26.52-14.42 4.12 0 8.97 1.05 14.54 3.17 5.57 2.12 9.4 3.24 11.48 3.35 1.74 0 5.86-1.16 12.35-3.48 6.5-2.32 11.89-3.3 16.18-2.94 12.01.98 21.6 5.3 28.77 12.96-10.47 6.32-15.6 15.12-15.39 26.4.22 8.91 3.53 16.32 9.93 22.23 6.4 5.91 14.11 9.27 23.13 10.08-2.28 7.07-5.06 14.07-8.34 21zm-28.77-104.7c0-7.07 2.5-13.7 7.5-19.89 5-6.19 11.24-10.33 18.73-12.42.22 1.3.33 2.5.33 3.59 0 6.96-2.61 13.7-7.83 20.22-5.22 6.52-11.53 10.43-18.93 11.74-.22-1.09-.33-2.18-.33-3.24z" />
                </svg>
                <span>Apple ID</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-semibold">
              <div className="h-px flex-1 bg-white/10" />
              <span>{isEn ? 'Or sign in with email' : 'Hoặc đăng nhập bằng email'}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email / Phone input */}
            <div>
              <label className="text-[11px] font-bold text-slate-300">
                {isEn ? 'Email or Registered Phone:' : 'Email hoặc Số điện thoại đăng ký:'}
              </label>
              <div className="mt-1 relative flex items-center">
                <Mail size={15} className="absolute left-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="luong.truong@ecostay.vn"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            {/* Password input with Show/Hide toggle */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300">
                  {isEn ? 'Password:' : 'Mật khẩu:'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotHint(!showForgotHint)}
                  className="text-[10px] font-semibold text-emerald-400 hover:underline"
                >
                  {isEn ? 'Forgot password?' : 'Quên mật khẩu?'}
                </button>
              </div>

              <div className="mt-1 relative flex items-center">
                <Lock size={15} className="absolute left-3.5 text-emerald-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-10 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {showForgotHint && (
                <div className="mt-2 rounded-xl bg-emerald-950/80 p-2.5 border border-emerald-500/40 text-[10px] text-emerald-200">
                  <p className="font-bold flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-400" />
                    <span>{isEn ? 'Demo System Hint:' : 'Gợi ý kiểm thử:'}</span>
                  </p>
                  <p className="mt-0.5">
                    {isEn
                      ? 'Default password is "123456". You can also tap the "4 VIP Cards" tab above to sign in instantly.'
                      : 'Mật khẩu mặc định là "123456". Bạn cũng có thể chạm vào tab "4 Thẻ VIP Mẫu" phía trên để vào ngay không cần nhập.'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#1E4D3E] py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/60 hover:from-emerald-500 hover:to-[#245D4B] active:scale-98 transition-all"
            >
              <LogIn size={15} />
              <span>{isEn ? 'Sign In to EcoStay' : 'Đăng Nhập Ngay'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER NEW ACCOUNT (+50 CP BONUS) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 p-2.5 border border-amber-400/40 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-300">
                  {isEn ? 'Welcome Bonus: +50 Carbon Points!' : 'Đặc quyền chào mừng: +50 Điểm Cacbon!'}
                </p>
                <p className="text-[10px] text-slate-300">
                  {isEn
                    ? 'Receive 50 CP upon account creation to redeem welcome gifts.'
                    : 'Nhận ngay 50 CP kích hoạt thẻ thành viên xanh để đổi sinh tố hữu cơ hoặc trồng cây.'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300">
                {isEn ? 'Full Name:' : 'Họ và tên du khách:'}
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={isEn ? 'e.g. Tran Minh Tuan' : 'Ví dụ: Trần Minh Tuấn'}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 py-2 px-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300">
                  {isEn ? 'Phone Number:' : 'Số điện thoại:'}
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0912 888 777"
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 py-2 px-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300">Email:</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tuan.tran@gmail.com"
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 py-2 px-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300">
                  {isEn ? 'Staying Hotel:' : 'Khách sạn lưu trú:'}
                </label>
                <select
                  value={regHotel}
                  onChange={(e) => setRegHotel(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-[#0E2E22] py-2 px-2 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Silk Sense Hội An River Eco-Resort">Silk Sense Hội An</option>
                  <option value="Emeralda Resort Ninh Bình">Emeralda Ninh Bình</option>
                  <option value="Terracotta Resort Đà Lạt">Terracotta Đà Lạt</option>
                  <option value="Cat Tien Jungle Lodge">Cat Tien Jungle Lodge</option>
                  <option value="Topas Ecolodge Sa Pa">Topas Ecolodge Sa Pa</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300">
                  {isEn ? 'Room Number:' : 'Số phòng:'}
                </label>
                <input
                  type="text"
                  value={regRoom}
                  onChange={(e) => setRegRoom(e.target.value)}
                  placeholder="Suite Eco-302"
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-white/10 py-2 px-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300">
                {isEn ? 'Password:' : 'Mật khẩu:'}
              </label>
              <div className="mt-1 relative flex items-center">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2 pl-3 pr-9 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 text-slate-400 hover:text-white"
                >
                  {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 py-3 text-xs font-black text-slate-950 shadow-lg shadow-amber-950/40 hover:brightness-105 active:scale-98 transition-all"
            >
              <Sparkles size={15} />
              <span>{isEn ? 'Create Digital Card & Get +50 CP' : 'Kích Hoạt Thẻ & Nhận +50 CP'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Bottom Footer Actions & Guest Option */}
      <div className="relative z-10 pt-3 border-t border-white/10 mt-3 space-y-2 text-center">
        <button
          onClick={onContinueAsGuest}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/15 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-xs active:scale-98"
        >
          <Compass size={14} className="text-emerald-400" />
          <span>{isEn ? 'Explore as Guest (No login required)' : 'Khám phá dạng Khách (Không cần đăng nhập)'}</span>
        </button>

        <p className="text-[10px] text-slate-500 font-medium">
          {isEn
            ? 'EcoStay • ESG Net Zero Tourism Platform • ISO 14064 Standard'
            : 'EcoStay • Nền tảng Du lịch Net Zero • Tiêu chuẩn Kiểm kê Khí nhà kính ISO 14064'}
        </p>
      </div>
    </div>
  );
};
