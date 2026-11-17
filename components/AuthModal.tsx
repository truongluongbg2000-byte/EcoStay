'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  Lock,
  Mail,
  Building2,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Wifi,
  CreditCard
} from 'lucide-react';
import { MockAccount } from '@/data/types';
import { mockAccounts } from '@/data/mockData';
import { rankTranslations } from '@/data/translations';
import { triggerEcoConfetti } from './Confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentLang?: 'vi' | 'en';
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
  onRegisterNewAccount,
}) => {
  const isEn = currentLang === 'en';
  const [activeTab, setActiveTab] = useState<'quick' | 'login' | 'register'>('quick');

  // Form states for login
  const [loginIdentifier, setLoginIdentifier] = useState('luong.truong@ecostay.vn');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('123456');
  const [showRegPassword, setShowRegPassword] = useState(false);

  if (!isOpen) return null;

  const handleQuickSelect = (acc: MockAccount) => {
    triggerEcoConfetti();
    onSelectAccount(acc);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockAccounts.find(
      (a) =>
        a.email.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
        a.phone === loginIdentifier.trim()
    );

    if (found) {
      handleQuickSelect(found);
    } else {
      handleQuickSelect(mockAccounts[0]);
    }
  };

  const handleGoogleLogin = () => {
    const target = mockAccounts.find((a) => a.id === 'user-2') || mockAccounts[0];
    handleQuickSelect(target);
  };

  const handleAppleLogin = () => {
    const target = mockAccounts.find((a) => a.id === 'user-1') || mockAccounts[0];
    handleQuickSelect(target);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert(isEn ? 'Please enter your full name!' : 'Vui lòng nhập họ và tên của bạn!');
      return;
    }

    triggerEcoConfetti();
    onRegisterNewAccount({
      name: regName.trim(),
      phone: regPhone.trim() || '0988 888 999',
      email: regEmail.trim() || 'new.user@ecostay.vn',
      hotel: regHotel,
      room: regRoom || 'Room Eco-101',
    });
    onClose();
  };

  const getCardTheme = (accId: string) => {
    switch (accId) {
      case 'user-2': // VIP Titanium
        return {
          gradient: 'from-[#071710] via-[#0E2E21] to-[#06150E]',
          border: 'border-amber-400/40 hover:border-amber-400',
          chipGradient: 'from-amber-200 via-yellow-400 to-amber-600',
          badgeBg: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
          pointsColor: 'text-amber-300',
          tierTag: isEn ? 'VIP TITANIUM • CỔ THỤ XANH' : 'VIP TITANIUM • CỔ THỤ XANH',
          memberCode: 'ECO • HM • 998811',
        };
      case 'user-1': // Emerald Prestige
        return {
          gradient: 'from-[#0A261D] via-[#144233] to-[#0B2119]',
          border: 'border-emerald-400/40 hover:border-emerald-400',
          chipGradient: 'from-emerald-200 via-teal-300 to-emerald-600',
          badgeBg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
          pointsColor: 'text-emerald-300',
          tierTag: isEn ? 'PRESTIGE • MẦM XANH' : 'PRESTIGE • MẦM XANH',
          memberCode: 'ECO • TL • 883921',
        };
      case 'user-3': // Sapphire Explorer
        return {
          gradient: 'from-[#0B2332] via-[#133A52] to-[#091D2A]',
          border: 'border-cyan-400/40 hover:border-cyan-400',
          chipGradient: 'from-cyan-200 via-sky-400 to-cyan-600',
          badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
          pointsColor: 'text-cyan-300',
          tierTag: isEn ? 'PASSPORT • GLOBAL EXPLORER' : 'PASSPORT • DU KHÁCH QUỐC TẾ',
          memberCode: 'ECO • DH • 772233',
        };
      default: // Neo Starter
        return {
          gradient: 'from-[#14261F] via-[#1F3D32] to-[#101F19]',
          border: 'border-lime-400/30 hover:border-lime-400',
          chipGradient: 'from-lime-200 via-emerald-400 to-lime-600',
          badgeBg: 'bg-lime-500/20 border-lime-400/40 text-lime-300',
          pointsColor: 'text-lime-300',
          tierTag: isEn ? 'MEMBER • ECO STARTER' : 'THÀNH VIÊN • TÂN BINH XANH',
          memberCode: 'ECO • MK • 112233',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-md animate-fadeIn text-left">
      <div className="relative w-full max-w-md rounded-3xl bg-[#091E16] text-white p-4 sm:p-5 shadow-2xl border border-emerald-500/30 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-500/15 blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-md">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white">
                  {isEn ? 'EcoStay Digital Passports' : 'Xác Thực & Thẻ Thành Viên Xanh'}
                </h3>
                <span className="rounded bg-emerald-400/20 px-1 py-0.2 text-[9px] font-black text-emerald-300 border border-emerald-400/30">
                  VIP
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80 font-medium">
                {isEn ? 'Switch between 4 demo VIP cards or register' : 'Chuyển đổi 4 thẻ VIP mẫu hoặc tạo mới'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-1.5 text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
            aria-label={isEn ? 'Close' : 'Đóng'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher: [ 💳 4 Thẻ VIP ] vs [ 🔑 Đăng nhập ] vs [ ✨ Đăng ký (+50) ] */}
        <div className="mt-3 flex rounded-2xl bg-white/5 p-1 border border-white/10 relative z-10">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-emerald-600 to-[#1E4D3E] text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard size={13} className={activeTab === 'quick' ? 'text-amber-300' : ''} />
            <span>{isEn ? '4 VIP Cards' : '4 Thẻ VIP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 rounded-xl py-2 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'login'
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
            <span>{isEn ? 'Register (+50)' : 'Đăng ký (+50)'}</span>
          </button>
        </div>

        {/* Tab 1: 4 DEMO ACCOUNTS QUICK SWITCHER */}
        {activeTab === 'quick' && (
          <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1 relative z-10">
            <p className="text-[10px] text-slate-400 leading-snug">
              {isEn
                ? 'Tap any VIP card to instantly switch profile, points, vouchers and real CO₂ metrics:'
                : 'Chạm vào thẻ VIP để đổi tức thì dữ liệu điểm thưởng CP, voucher và hồ sơ du lịch xanh:'}
            </p>

            <div className="space-y-2.5">
              {mockAccounts.map((acc) => {
                const isActive = acc.id === currentUserId;
                const theme = getCardTheme(acc.id);
                const displayRole = isEn ? acc.roleBadgeEn : acc.roleBadge;

                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickSelect(acc)}
                    className={`relative rounded-3xl p-3 bg-gradient-to-br ${theme.gradient} border ${
                      isActive
                        ? 'border-emerald-400 ring-2 ring-emerald-400/60 shadow-lg'
                        : theme.border
                    } cursor-pointer transition-all hover:scale-[1.01] active:scale-98 overflow-hidden`}
                  >
                    {/* Active Ribbon */}
                    {isActive && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black text-[#071611] shadow">
                        <Check size={10} className="stroke-[3]" />
                        <span>{isEn ? 'CURRENT ACTIVE' : 'ĐANG DÙNG'}</span>
                      </span>
                    )}

                    {/* Card Top */}
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                      <div className={`h-4 w-6 rounded bg-gradient-to-br ${theme.chipGradient} shadow-inner`} />
                      <Wifi size={12} className="text-white/60 rotate-90" />
                      <span className={`rounded px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider border ${theme.badgeBg}`}>
                        {theme.tierTag}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 ml-auto mr-1">
                        {theme.memberCode}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="pt-2.5 flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={acc.profile.avatar}
                          alt={acc.profile.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white/30 shadow"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {acc.profile.name}
                          </h4>
                          <p className="text-[10px] text-slate-300 flex items-center gap-1">
                            <Building2 size={10} className="text-emerald-400" />
                            <span>{acc.profile.hotelName}</span>
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">
                            {acc.profile.roomNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className={`text-base font-black ${theme.pointsColor}`}>
                            {acc.profile.carbonPoints.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-black text-emerald-400">CP</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-300 block">
                          🌱 {acc.profile.co2Saved}kg • {acc.profile.treesPlanted} 🌲
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                      <span>{displayRole}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <span>{isEn ? 'Select card' : 'Chọn thẻ này'}</span>
                        <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: MANUAL LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleManualLogin} className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1 relative z-10">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
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
                onClick={handleAppleLogin}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
              >
                <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.97-14.42-6.19-9.5-10.9-20.2-14.13-32.08-3.23-11.89-4.85-23.23-4.85-34.03 0-14.03 3.49-25.76 10.47-35.18 6.98-9.42 15.82-14.23 26.52-14.42 4.12 0 8.97 1.05 14.54 3.17 5.57 2.12 9.4 3.24 11.48 3.35 1.74 0 5.86-1.16 12.35-3.48 6.5-2.32 11.89-3.3 16.18-2.94 12.01.98 21.6 5.3 28.77 12.96-10.47 6.32-15.6 15.12-15.39 26.4.22 8.91 3.53 16.32 9.93 22.23 6.4 5.91 14.11 9.27 23.13 10.08-2.28 7.07-5.06 14.07-8.34 21zm-28.77-104.7c0-7.07 2.5-13.7 7.5-19.89 5-6.19 11.24-10.33 18.73-12.42.22 1.3.33 2.5.33 3.59 0 6.96-2.61 13.7-7.83 20.22-5.22 6.52-11.53 10.43-18.93 11.74-.22-1.09-.33-2.18-.33-3.24z" />
                </svg>
                <span>Apple ID</span>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300">
                {isEn ? 'Email or Phone Number:' : 'Email hoặc Số điện thoại:'}
              </label>
              <div className="mt-1 relative flex items-center">
                <Mail size={15} className="absolute left-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="luong.truong@ecostay.vn"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-3 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-10 text-xs font-semibold text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
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
                      ? 'Default password is "123456". You can also tap the "4 VIP Cards" tab.'
                      : 'Mật khẩu mặc định là "123456". Bạn cũng có thể dùng tab 4 Thẻ VIP.'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#1E4D3E] py-3 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all"
            >
              <LogIn size={15} />
              <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Ngay'}</span>
            </button>
          </form>
        )}

        {/* Tab 3: REGISTER NEW */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1 relative z-10">
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 p-2.5 border border-amber-400/40 flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles size={15} />
              </div>
              <div>
                <p className="text-[11px] font-black text-amber-300">
                  {isEn ? 'Bonus: +50 Carbon Points!' : 'Đặc quyền: +50 Điểm Cacbon!'}
                </p>
                <p className="text-[9px] text-slate-300">
                  {isEn ? 'Receive 50 CP upon registration.' : 'Nhận ngay 50 CP khởi tạo thẻ thành viên xanh.'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300">
                {isEn ? 'Full Name:' : 'Họ và tên:'}
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
                  {isEn ? 'Phone:' : 'Số điện thoại:'}
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
                  {isEn ? 'Hotel:' : 'Khách sạn:'}
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
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300">
                  {isEn ? 'Room:' : 'Số phòng:'}
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
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 py-3 text-xs font-black text-slate-950 shadow-md hover:brightness-105 active:scale-98 transition-all"
            >
              <Sparkles size={15} />
              <span>{isEn ? 'Create Card & Claim +50 CP' : 'Kích Hoạt Thẻ & Nhận +50 CP'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
