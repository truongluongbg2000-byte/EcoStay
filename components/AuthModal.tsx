'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Building2,
  BedDouble,
  Check,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Award,
  Zap,
  ArrowRight,
  UserPlus,
  LogIn
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

  // Form states for register
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('123456');

  if (!isOpen) return null;

  const handleQuickSelect = (acc: MockAccount) => {
    triggerEcoConfetti();
    onSelectAccount(acc);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Find matching mock account or default to user-1
    const found = mockAccounts.find(
      (a) =>
        a.email.toLowerCase() === loginIdentifier.toLowerCase().trim() ||
        a.phone === loginIdentifier.trim()
    );

    if (found) {
      handleQuickSelect(found);
    } else {
      // Default to first account for demo purposes
      handleQuickSelect(mockAccounts[0]);
    }
  };

  const handleGoogleLogin = () => {
    // Demo 1-click Google sign in -> picks VIP user or current user
    const target = mockAccounts.find((a) => a.id === 'user-2') || mockAccounts[0];
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn text-left">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isEn ? 'EcoStay Account & Authentication' : 'Xác Thực & Tài Khoản EcoStay'}
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold">
                {isEn ? 'Switch between 4 demo accounts or register' : 'Đổi 4 tài khoản mẫu hoặc đăng ký mới'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label={isEn ? 'Close' : 'Đóng'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher: [ 4 Tài khoản mẫu ] vs [ Đăng nhập ] vs [ Đăng ký ] */}
        <div className="mt-3 flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'quick'
                ? 'bg-[#1E4D3E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={13} className={activeTab === 'quick' ? 'text-amber-300' : ''} />
            <span>{isEn ? '4 Demo Accounts' : '4 TK Mẫu'}</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'login'
                ? 'bg-[#1E4D3E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn size={13} />
            <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'register'
                ? 'bg-[#1E4D3E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus size={13} />
            <span>{isEn ? 'Register (+50)' : 'Đăng ký (+50)'}</span>
          </button>
        </div>

        {/* Tab 1: 4 DEMO ACCOUNTS QUICK SWITCHER */}
        {activeTab === 'quick' && (
          <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-0.5">
            <p className="text-[11px] text-slate-500 leading-snug">
              {isEn
                ? 'Click any account below to instantly switch profiles, points balance, vouchers and CO₂ impact stats for demonstration:'
                : 'Chạm vào 1 trong 4 tài khoản mẫu dưới đây để đổi ngay lập tức toàn bộ số dư điểm CP, hạng thành viên và dữ liệu du lịch:'}
            </p>

            <div className="space-y-2.5">
              {mockAccounts.map((acc) => {
                const isActive = acc.id === currentUserId;
                const displayRank = isEn
                  ? rankTranslations[acc.profile.rank] || acc.profile.rank
                  : acc.profile.rank;
                const displayRole = isEn ? acc.roleBadgeEn : acc.roleBadge;

                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickSelect(acc)}
                    className={`relative rounded-2xl p-3 border transition-all cursor-pointer hover:shadow-md ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-400/40'
                        : 'border-slate-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={acc.profile.avatar}
                            alt={acc.profile.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                          />
                          {isActive && (
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                              <Check size={11} className="stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900">
                              {acc.profile.name}
                            </h4>
                            <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                              {displayRole}
                            </span>
                          </div>

                          <p className="mt-0.5 text-[10px] text-slate-500 flex items-center gap-1">
                            <Award size={11} className="text-amber-500" />
                            <span>{displayRank}</span>
                          </p>

                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 size={10} />
                            <span>{acc.profile.roomNumber} • {acc.profile.hotelName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right Points Pill */}
                      <div className="text-right shrink-0">
                        <div className="rounded-xl bg-[#1E4D3E] px-2.5 py-1 text-center text-white shadow-xs">
                          <span className="block text-xs font-black">{acc.profile.carbonPoints}</span>
                          <span className="block text-[8px] font-bold text-emerald-300 -mt-0.5">CP</span>
                        </div>
                        <span className="mt-1 block text-[9px] font-semibold text-emerald-700">
                          {acc.profile.treesPlanted} {isEn ? 'trees' : 'cây'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom stats row */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>🌱 {acc.profile.co2Saved} kg CO₂</span>
                      <span>💧 {acc.profile.waterSaved}L {isEn ? 'water' : 'nước'}</span>
                      <span className="font-bold text-[#1E4D3E] flex items-center gap-0.5">
                        {isActive
                          ? (isEn ? 'Currently Active ✓' : 'Đang sử dụng ✓')
                          : (isEn ? 'Select Account →' : 'Chọn tài khoản này →')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: MANUAL LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleManualLogin} className="mt-3 flex-1 overflow-y-auto space-y-3.5 pr-0.5">
            {/* Google Fast Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
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
              <span>{isEn ? 'Continue with Google' : 'Tiếp tục với Google'}</span>
            </button>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-semibold">
              <div className="h-px flex-1 bg-slate-200" />
              <span>{isEn ? 'Or sign in with email' : 'Hoặc đăng nhập với email'}</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">
                {isEn ? 'Email or Phone Number:' : 'Email hoặc Số điện thoại:'}
              </label>
              <div className="mt-1 relative flex items-center">
                <Mail size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="luong.truong@ecostay.vn"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">
                {isEn ? 'Password:' : 'Mật khẩu:'}
              </label>
              <div className="mt-1 relative flex items-center">
                <Lock size={15} className="absolute left-3 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {isEn ? 'Mock default password: 123456' : 'Mật khẩu mẫu mặc định: 123456'}
              </p>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#1E4D3E] py-3 text-xs font-bold text-white shadow-md hover:bg-[#16392E] active:scale-98 transition-all"
            >
              <LogIn size={15} />
              <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Ngay'}</span>
            </button>
          </form>
        )}

        {/* Tab 3: REGISTER NEW ACCOUNT FORM (+50 CP BONUS) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-3 flex-1 overflow-y-auto space-y-3 pr-0.5">
            {/* Welcome Bonus Callout */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/15 to-amber-500/15 p-3 border border-emerald-200/80 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-900 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#1E4D3E]">
                  {isEn ? 'Welcome Bonus: +50 Carbon Points!' : 'Quà tặng chào mừng: +50 Điểm Cacbon!'}
                </p>
                <p className="text-[10px] text-slate-600">
                  {isEn
                    ? 'Get 50 CP immediately to redeem organic smoothies or plant trees.'
                    : 'Nhận ngay 50 CP khởi tạo để đổi sinh tố hữu cơ hoặc tích lũy trồng cây.'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">
                {isEn ? 'Full Name:' : 'Họ và tên du khách:'}
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={isEn ? 'e.g. Tran Minh Tuan' : 'Ví dụ: Trần Minh Tuấn'}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700">
                  {isEn ? 'Phone Number:' : 'Số điện thoại:'}
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="0912 888 777"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Email:</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tuan.tran@gmail.com"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700">
                  {isEn ? 'Staying Hotel:' : 'Khách sạn lưu trú:'}
                </label>
                <select
                  value={regHotel}
                  onChange={(e) => setRegHotel(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                >
                  <option value="Silk Sense Hội An River Eco-Resort">Silk Sense Hội An</option>
                  <option value="Emeralda Resort Ninh Bình">Emeralda Ninh Bình</option>
                  <option value="Terracotta Resort Đà Lạt">Terracotta Đà Lạt</option>
                  <option value="Cat Tien Jungle Lodge">Cat Tien Jungle Lodge</option>
                  <option value="Topas Ecolodge Sa Pa">Topas Ecolodge Sa Pa</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">
                  {isEn ? 'Room Number:' : 'Số phòng:'}
                </label>
                <input
                  type="text"
                  value={regRoom}
                  onChange={(e) => setRegRoom(e.target.value)}
                  placeholder="Suite Eco-302"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">
                {isEn ? 'Create Password:' : 'Tạo mật khẩu:'}
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] py-3 text-xs font-bold text-white shadow-md hover:from-[#16392E] hover:to-[#225242] active:scale-98 transition-all"
            >
              <Sparkles size={15} className="text-amber-300" />
              <span>{isEn ? 'Create Account & Claim +50 CP' : 'Tạo Tài Khoản & Nhận +50 CP'}</span>
            </button>
          </form>
        )}

        {/* Footer close button */}
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isEn ? 'Close' : 'Đóng'}
        </button>
      </div>
    </div>
  );
};
