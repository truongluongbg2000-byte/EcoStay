'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  UserCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  Users,
  Award,
  Building2,
  ArrowRight,
  Info,
  Globe,
  Sparkles,
} from 'lucide-react';
import { MockAccount } from '@/data/types';
import { mockAccounts } from '@/data/mockData';
import {
  registerLocalAccount,
  verifyLocalAccount,
  LocalAccount,
} from '@/lib/auth/localAccounts';
import { playSuccessTickSound } from '@/lib/audio/successSound';
import { formatText, getDictionary, Lang, SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface LoginScreenProps {
  currentLang: Lang;
  onChangeLang: (lang: Lang) => void;
  onLoginSuccess: (account: MockAccount) => void;
  onLocalLogin: (account: LocalAccount) => void;
  onRegisterSuccess: (data: {
    id?: string;
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
  onLocalLogin,
  onRegisterSuccess,
}) => {
  const t = getDictionary(currentLang);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoSheetOpen, setIsDemoSheetOpen] = useState(false);
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const showTempNotice = (message: string) => {
    setNoticeText(message);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => {
      setNoticeText(null);
    }, 2600);
  };

  const handleSocialInDev = (provider: 'Google' | 'Facebook') => {
    showTempNotice(formatText(t.login.devNoticeSocial, { provider }));
  };

  const handleSelectAccount = (acc: MockAccount) => {
    playSuccessTickSound();
    setIsDemoSheetOpen(false);
    onLoginSuccess(acc);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const account = await verifyLocalAccount(emailInput, passwordInput);
    if (!account) {
      showTempNotice(t.login.errLoginInvalid);
      return;
    }
    playSuccessTickSound();
    onLocalLogin(account);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerLocalAccount({
      name: regName,
      phone: regPhone,
      email: regEmail,
      hotel: regHotel,
      room: regRoom,
      password: regPassword,
    });
    if (!result.ok) {
      showTempNotice(result.reason === 'exists' ? t.login.errAccountExists : t.login.errRegisterInvalid);
      return;
    }
    playSuccessTickSound();
    const a = result.account;
    onRegisterSuccess({ id: a.id, name: a.name, phone: a.phone, email: a.email, hotel: a.hotel, room: a.room });
  };

  return (
    <div className="relative mx-auto w-full max-w-md min-h-screen lg:min-h-0 lg:my-10 lg:rounded-[32px] lg:border lg:border-emerald-100 lg:shadow-xl bg-gradient-to-b from-[#E8F6EC] via-[#F2FAF4] to-[#E2F3E7] text-slate-800 shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between p-4 sm:p-5 text-left animate-fadeIn">
      {/* Subtle Light-Green Ambient Blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-emerald-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-green-300/25 blur-3xl" />

      {/* Top Bar: Settings Gear for 5 Languages */}
      <div className="relative z-30 flex items-center justify-end pb-2">
        <div ref={settingsRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-xs transition-all active:scale-95 ${
              isSettingsOpen
                ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                : 'bg-white/95 text-[#2E7D32] border-emerald-200 hover:bg-emerald-50'
            }`}
            aria-label={t.login.settingsLabel}
            title={t.login.settingsLabel}
          >
            <Settings
              size={19}
              className={
                isSettingsOpen
                  ? 'rotate-90 transition-transform duration-300'
                  : 'transition-transform duration-300'
              }
            />
          </button>

          {/* 5-Language Settings Popover */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2.5 shadow-xl border border-emerald-100 animate-fadeIn z-40">
              <div className="flex items-center gap-1.5 px-2 pb-2 mb-1.5 border-b border-slate-100">
                <Globe size={14} className="text-[#2E7D32]" />
                <span className="text-[11px] font-bold text-slate-700">
                  {t.login.settingsLabel}
                </span>
              </div>

              <div className="space-y-1">
                {SUPPORTED_LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => {
                      onChangeLang(langItem.code);
                      setNoticeText(null);
                      setIsSettingsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors ${
                      currentLang === langItem.code
                        ? 'bg-[#E8F5E9] text-[#1B5E20]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{langItem.flag}</span>
                      <span>{langItem.nativeName}</span>
                    </span>
                    {currentLang === langItem.code && (
                      <Check size={14} className="text-[#2E7D32]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main White Minimalist Card */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="rounded-[30px] bg-white px-5 py-6 sm:px-6 sm:py-7 shadow-[0_12px_36px_rgba(46,125,50,0.08)] border border-emerald-100/90">
          {/* Group Official Logo + Brand Name */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-emerald-100 shadow-sm bg-white p-0.5">
                <img
                  src="/logo.jpg"
                  alt="EcoStay Logo"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
              <div className="text-left">
                <span className="block text-2xl font-black tracking-tight text-[#1E5631] leading-none">
                  EcoStay
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600 mt-0.5">
                  {t.login.tagline}
                </span>
              </div>
            </div>

            <h1 className="mt-4 text-xl font-extrabold text-slate-900">
              {mode === 'login' ? t.login.signIn : t.login.signUp}
            </h1>
          </div>

          {/* Inline Notice Banner */}
          {noticeText && (
            <div className="mb-3.5 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-2 text-[11px] font-semibold text-[#1B5E20] animate-fadeIn">
              <Info size={15} className="shrink-0 text-[#2E7D32]" />
              <span>{noticeText}</span>
            </div>
          )}

          {mode === 'login' ? (
            <>
              {/* Only 2 Social Buttons: Google & Facebook */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialInDev('Google')}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50/50 hover:border-emerald-200 active:scale-98 transition-all"
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
                  onClick={() => handleSocialInDev('Facebook')}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50/50 hover:border-emerald-200 active:scale-98 transition-all"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                    />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 flex items-center gap-3 text-[11px] text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>{t.login.or}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Basic Email/Phone & Password Form */}
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div className="relative flex items-center">
                  <UserCircle2 size={18} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={t.login.emailOrPhone}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#C8E6C9] transition-all"
                  />
                </div>

                <div className="relative flex items-center">
                  <KeyRound size={17} className="absolute left-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={t.login.password}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#C8E6C9] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotHint((prev) => !prev)}
                    className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
                  >
                    {t.login.forgotPassword}
                  </button>
                </div>

                {showForgotHint && (
                  <div className="rounded-xl bg-[#F1F8E9] border border-[#C5E1A5] px-3 py-2 text-[11px] text-[#33691E]">
                    {t.login.forgotHint}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-1 w-full rounded-full bg-gradient-to-r from-[#66BB6A] to-[#4CAF50] py-3.5 text-sm font-bold text-white shadow-md shadow-green-500/20 hover:from-[#57AE5B] hover:to-[#43A047] active:scale-98 transition-all"
                >
                  {t.login.signIn}
                </button>
              </form>

              {/* Register Link */}
              <p className="mt-4 text-center text-xs text-slate-600">
                {t.login.noAccount}
                <button
                  type="button"
                  onClick={() => {
                    setNoticeText(null);
                    setMode('register');
                  }}
                  className="font-bold text-[#2E7D32] hover:underline"
                >
                  {t.login.signUp}
                </button>
              </p>
            </>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div className="rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-2.5 flex items-center gap-2">
                <Sparkles size={16} className="text-[#2E7D32] shrink-0" />
                <p className="text-[11px] font-semibold text-[#1B5E20]">
                  {t.login.welcomeBonus}
                </p>
              </div>

              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={t.login.fullName}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder={t.login.phone}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={regHotel}
                  onChange={(e) => setRegHotel(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-2.5 text-xs font-medium text-slate-800 focus:border-[#66BB6A] focus:outline-none"
                >
                  <option value="Silk Sense Hội An River Eco-Resort">Silk Sense Hội An</option>
                  <option value="Emeralda Resort Ninh Bình">Emeralda Ninh Bình</option>
                  <option value="Terracotta Resort Đà Lạt">Terracotta Đà Lạt</option>
                  <option value="Cat Tien Jungle Lodge">Cat Tien Jungle Lodge</option>
                  <option value="Topas Ecolodge Sa Pa">Topas Ecolodge Sa Pa</option>
                </select>

                <input
                  type="text"
                  value={regRoom}
                  onChange={(e) => setRegRoom(e.target.value)}
                  placeholder={t.login.roomNumber}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
                />
              </div>

              <div className="relative flex items-center">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={t.login.password}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-gradient-to-r from-[#66BB6A] to-[#4CAF50] py-3 text-sm font-bold text-white shadow-md shadow-green-500/20 hover:from-[#57AE5B] hover:to-[#43A047] active:scale-98 transition-all"
              >
                {t.login.createAccountBtn}
              </button>

              <p className="pt-1 text-center text-xs text-slate-600">
                {t.login.hasAccount}
                <button
                  type="button"
                  onClick={() => {
                    setNoticeText(null);
                    setMode('login');
                  }}
                  className="font-bold text-[#2E7D32] hover:underline"
                >
                  {t.login.signIn}
                </button>
              </p>
            </form>
          )}

          {/* Legal Terms Micro-Text */}
          <p className="mt-5 text-center text-[10px] text-slate-400 leading-relaxed">
            {t.login.terms}
          </p>
        </div>
      </div>

      {/* Bottom Section: Demo Accounts Trigger (Only active login method!) */}
      <div className="relative z-10 pt-3">
        <button
          type="button"
          onClick={() => setIsDemoSheetOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/95 border border-[#A5D6A7] py-3 px-4 text-xs font-bold text-[#1B5E20] shadow-xs hover:bg-[#E8F5E9] active:scale-98 transition-all"
        >
          <Users size={15} className="text-[#2E7D32]" />
          <span>{t.login.signInDemoBtn}</span>
        </button>
      </div>

      {/* Demo Accounts Picker Modal */}
      {isDemoSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 p-3 sm:p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsDemoSheetOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-4 sm:p-5 shadow-2xl border border-emerald-100 max-h-[82vh] flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {t.login.chooseDemoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t.login.chooseDemoSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDemoSheetOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
                aria-label={t.common.close}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 space-y-2.5 overflow-y-auto pr-0.5">
              {mockAccounts.map((acc) => {
                const displayRank = t.data.ranks[acc.profile.rank] || acc.profile.rank;
                const displayRole = t.data.accountRoles[acc.id] || acc.roleBadge;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className="group w-full text-left rounded-2xl border border-emerald-100 bg-[#F9FDF9] p-3 hover:border-[#66BB6A] hover:bg-[#EDF7EE] transition-all active:scale-98"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.profile.avatar}
                          alt={acc.profile.name}
                          className="h-11 w-11 shrink-0 rounded-full object-cover border-2 border-[#A5D6A7]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate group-hover:text-[#1B5E20]">
                            {acc.profile.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-[#2E7D32] flex items-center gap-1 mt-0.5 truncate">
                            <Award size={11} className="text-amber-500 shrink-0" />
                            <span className="truncate">{displayRank}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 size={10} className="shrink-0" />
                            <span className="truncate">
                              {acc.profile.roomNumber} • {acc.profile.hotelName}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-block rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] px-2.5 py-1 text-xs font-black text-[#1B5E20]">
                          {acc.profile.carbonPoints.toLocaleString()} CB
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-emerald-100/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{displayRole}</span>
                      <span className="font-bold text-[#2E7D32] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{t.common.select}</span>
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
