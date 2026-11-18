'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  KeyRound,
  UserCircle2,
  Building2,
  Check,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Users,
  Award,
  Info,
} from 'lucide-react';
import { MockAccount } from '@/data/types';
import { mockAccounts } from '@/data/mockData';
import { playSuccessTickSound } from '@/lib/audio/successSound';
import { formatText, getDictionary, Lang } from '@/lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentLang?: Lang;
  onSelectAccount: (account: MockAccount) => void;
  onRegisterNewAccount: (data: {
    name: string;
    phone: string;
    email: string;
    hotel: string;
    room: string;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentLang = 'vi',
  onSelectAccount,
}) => {
  const t = getDictionary(currentLang);
  const [activeTab, setActiveTab] = useState<'quick' | 'login' | 'register'>('quick');
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const showTempNotice = (message: string) => {
    setNoticeText(message);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNoticeText(null), 2400);
  };

  const handleSocialInDev = (provider: 'Google' | 'Facebook') => {
    showTempNotice(formatText(t.login.devNoticeSocial, { provider }));
  };

  const handleQuickSelect = (acc: MockAccount) => {
    playSuccessTickSound();
    onSelectAccount(acc);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showTempNotice(t.login.devNoticeAuthLogin);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showTempNotice(t.login.devNoticeAuthRegister);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs animate-fadeIn text-left"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white text-slate-800 p-4 sm:p-5 shadow-2xl border border-emerald-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t.login.authTitle}
              </h3>
              <p className="text-[10px] text-[#2E7D32] font-semibold">
                {t.login.authSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label={t.common.close}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-3 flex rounded-2xl bg-[#EEF7F0] p-1 border border-emerald-100">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'quick'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={13} />
            <span className="truncate">{t.login.demoAccountsTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'login'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn size={13} />
            <span className="truncate">{t.login.signIn}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'register'
                ? 'bg-[#4CAF50] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus size={13} />
            <span className="truncate">{t.login.signUp}</span>
          </button>
        </div>

        {/* Inline Notice Banner */}
        {noticeText && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] px-3 py-2 text-[11px] font-semibold text-[#1B5E20] animate-fadeIn">
            <Info size={14} className="shrink-0 text-[#2E7D32]" />
            <span>{noticeText}</span>
          </div>
        )}

        {/* TAB 1: 4 DEMO ACCOUNTS */}
        {activeTab === 'quick' && (
          <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-0.5">
            {mockAccounts.map((acc) => {
              const isActive = acc.id === currentUserId;
              const displayRank = t.data.ranks[acc.profile.rank] || acc.profile.rank;
              const displayRole = t.data.accountRoles[acc.id] || acc.roleBadge;

              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickSelect(acc)}
                  className={`w-full text-left rounded-2xl p-3 border transition-all active:scale-98 ${
                    isActive
                      ? 'border-[#4CAF50] bg-[#E8F5E9] ring-1 ring-[#81C784]'
                      : 'border-emerald-100 bg-[#F9FDF9] hover:border-[#66BB6A] hover:bg-[#EDF7EE]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={acc.profile.avatar}
                          alt={acc.profile.name}
                          className="h-11 w-11 rounded-full object-cover border-2 border-[#A5D6A7]"
                        />
                        {isActive && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4CAF50] text-white shadow">
                            <Check size={10} className="stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">
                            {acc.profile.name}
                          </h4>
                          {isActive && (
                            <span className="rounded bg-[#4CAF50] px-1.5 py-0.2 text-[8px] font-bold text-white shrink-0">
                              {t.common.active}
                            </span>
                          )}
                        </div>
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

                    <span className="shrink-0 rounded-xl bg-white border border-[#A5D6A7] px-2.5 py-1 text-xs font-black text-[#1B5E20]">
                      {acc.profile.carbonPoints.toLocaleString()} CB
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-emerald-100/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{displayRole}</span>
                    <span className="font-bold text-[#2E7D32] flex items-center gap-0.5">
                      <span>{t.login.switchAction}</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleManualLogin} className="mt-3 flex-1 overflow-y-auto space-y-3 pr-0.5">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialInDev('Google')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialInDev('Facebook')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>{t.login.or}</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="relative flex items-center">
              <UserCircle2 size={17} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder={t.login.emailOrPhone}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]"
              />
            </div>

            <div className="relative flex items-center">
              <KeyRound size={16} className="absolute left-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder={t.login.password}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#C8E6C9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#66BB6A] to-[#4CAF50] py-3 text-xs font-bold text-white shadow-md hover:from-[#57AE5B] hover:to-[#43A047] active:scale-98 transition-all"
            >
              {t.login.signIn}
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-0.5">
            <div className="rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-2.5 flex items-center gap-2">
              <Sparkles size={15} className="text-[#2E7D32] shrink-0" />
              <p className="text-[11px] font-semibold text-[#1B5E20]">
                {t.login.welcomeBonus}
              </p>
            </div>

            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder={t.login.fullName}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
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
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-2 text-xs font-medium text-slate-800 focus:border-[#66BB6A] focus:outline-none"
              >
                <option value="Silk Sense Hội An River Eco-Resort">Silk Sense Hội An</option>
                <option value="Emeralda Resort Ninh Bình">Emeralda Ninh Bình</option>
                <option value="Terracotta Resort Đà Lạt">Terracotta Đà Lạt</option>
                <option value="Cat Tien Jungle Lodge">Cat Tien Jungle Lodge</option>
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
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#66BB6A] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowRegPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#66BB6A] to-[#4CAF50] py-3 text-xs font-bold text-white shadow-md hover:from-[#57AE5B] hover:to-[#43A047] active:scale-98 transition-all"
            >
              {t.login.createAccountBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
