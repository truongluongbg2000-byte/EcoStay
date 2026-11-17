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
  Compass
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

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHotel, setRegHotel] = useState('Silk Sense Hội An River Eco-Resort');
  const [regRoom, setRegRoom] = useState('Suite Eco-501');
  const [regPassword, setRegPassword] = useState('123456');

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
    // 1-click Google sign in simulation -> chooses VIP user or default
    const target = mockAccounts.find((a) => a.id === 'user-2') || mockAccounts[0];
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

  return (
    <div className="relative mx-auto w-full max-w-md min-h-screen bg-[#F8FAF8] text-[#1B3B2B] shadow-2xl font-sans rounded-none sm:rounded-[40px] overflow-hidden border-0 sm:border-8 sm:border-slate-800 flex flex-col justify-between p-5 text-left animate-fadeIn">
      {/* Top Bar: Brand Logo & Language Switcher */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E4D3E] to-emerald-500 text-white shadow-md">
              <TreePine size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#1E4D3E] flex items-center gap-1">
                <span>EcoStay</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-500">
                {isEn ? 'Net Zero Travel & Carbon Points' : 'Du lịch Net Zero & Điểm Cacbon'}
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <button
            onClick={() => onChangeLang(currentLang === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1E4D3E] border border-slate-200 shadow-xs hover:bg-emerald-50 transition-colors"
            title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
          >
            <Globe size={14} className="text-emerald-700" />
            <span>{currentLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
          </button>
        </div>

        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E4D3E] via-[#245D4B] to-[#16392E] p-4 text-white shadow-lg mb-4">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                {isEn ? 'OFFICIAL ACCESS' : 'CỔNG TRUY CẬP CHÍNH THỨC'}
              </span>
              <h2 className="mt-1 text-base font-extrabold text-white leading-tight">
                {isEn ? 'Sign in to start your green journey' : 'Đăng nhập để bắt đầu hành trình xanh'}
              </h2>
              <p className="mt-1 text-[11px] text-emerald-100/90 leading-snug">
                {isEn
                  ? 'Accumulate Carbon Points (CP), plant trees and redeem organic dining vouchers.'
                  : 'Tích lũy Điểm Cacbon (CP), trồng cây bản địa và quy đổi kỳ nghỉ sinh thái.'}
              </p>
            </div>
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
              <Sparkles size={20} className="text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>

        {/* Tab Switcher: [ ⚡ 4 TK Mẫu ] vs [ 🔑 Đăng nhập ] vs [ ✨ Đăng ký (+50) ] */}
        <div className="flex rounded-2xl bg-slate-200/80 p-1 mb-3.5">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'demo'
                ? 'bg-[#1E4D3E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={13} className={activeTab === 'demo' ? 'text-amber-300' : ''} />
            <span>{isEn ? '4 Demo Accounts' : '4 TK Mẫu'}</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'form'
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
            <span>{isEn ? 'Register' : 'Đăng ký'}</span>
          </button>
        </div>

        {/* TAB 1: 4 DEMO ACCOUNTS (1-CLICK FAST LOGIN) */}
        {activeTab === 'demo' && (
          <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-0.5">
            <p className="text-[11px] font-semibold text-slate-500 mb-1">
              {isEn
                ? 'Select a profile to instantly log in and explore the app:'
                : 'Chọn 1 trong 4 tài khoản mẫu để đăng nhập và trải nghiệm ngay:'}
            </p>

            {mockAccounts.map((acc) => {
              const displayRank = isEn
                ? rankTranslations[acc.profile.rank] || acc.profile.rank
                : acc.profile.rank;
              const displayRole = isEn ? acc.roleBadgeEn : acc.roleBadge;

              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className="group relative rounded-2xl p-3 border border-slate-200/90 bg-white shadow-xs transition-all hover:border-emerald-500 hover:shadow-md hover:bg-emerald-50/40 cursor-pointer active:scale-98"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={acc.profile.avatar}
                          alt={acc.profile.name}
                          className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400 shadow-sm transition-transform group-hover:scale-105"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1E4D3E] transition-colors">
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

                    {/* Points Pill */}
                    <div className="text-right shrink-0">
                      <div className="rounded-xl bg-[#1E4D3E] px-2.5 py-1 text-center text-white shadow-xs group-hover:bg-[#16392E] transition-colors">
                        <span className="block text-xs font-black">{acc.profile.carbonPoints}</span>
                        <span className="block text-[8px] font-bold text-emerald-300 -mt-0.5">CP</span>
                      </div>
                      <span className="mt-1 block text-[9px] font-semibold text-emerald-700">
                        {acc.profile.treesPlanted} {isEn ? 'trees' : 'cây'}
                      </span>
                    </div>
                  </div>

                  {/* Micro action bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>🌱 {acc.profile.co2Saved} kg CO₂ • 💧 {acc.profile.waterSaved}L</span>
                    <span className="font-bold text-[#1E4D3E] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{isEn ? 'Log in now' : 'Đăng nhập ngay'}</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MANUAL LOGIN FORM */}
        {activeTab === 'form' && (
          <form onSubmit={handleManualLogin} className="space-y-3.5 max-h-[46vh] overflow-y-auto pr-0.5">
            {/* Google Fast Login */}
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
              <span>{isEn ? 'Or sign in with email' : 'Hoặc đăng nhập bằng email'}</span>
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
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="luong.truong@ecostay.vn"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {isEn ? 'Mock default password: 123456' : 'Mật khẩu mẫu mặc định: 123456'}
              </p>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#1E4D3E] py-3 text-xs font-bold text-white shadow-md hover:bg-[#16392E] active:scale-98 transition-all"
            >
              <LogIn size={15} />
              <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Ngay'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER NEW ACCOUNT (+50 CP BONUS) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[46vh] overflow-y-auto pr-0.5">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/15 to-amber-500/15 p-3 border border-emerald-200/80 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-900 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#1E4D3E]">
                  {isEn ? 'Welcome Gift: +50 Carbon Points!' : 'Quà tặng chào mừng: +50 Điểm Cacbon!'}
                </p>
                <p className="text-[10px] text-slate-600">
                  {isEn
                    ? 'Get 50 CP immediately to redeem organic smoothies or plant trees.'
                    : 'Nhận ngay 50 CP khởi tạo để đổi quà hoặc tham gia trồng cây.'}
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
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
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
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Email:</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tuan.tran@gmail.com"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
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
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
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
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">
                {isEn ? 'Password:' : 'Mật khẩu:'}
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] py-3 text-xs font-bold text-white shadow-md hover:from-[#16392E] hover:to-[#225242] active:scale-98 transition-all"
            >
              <Sparkles size={15} className="text-amber-300" />
              <span>{isEn ? 'Create Account & Claim +50 CP' : 'Tạo Tài Khoản & Nhận +50 CP'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-slate-200/80 mt-4 space-y-2 text-center">
        <button
          onClick={onContinueAsGuest}
          className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-white border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Compass size={14} className="text-emerald-700" />
          <span>{isEn ? 'Preview as Guest without login' : 'Bỏ qua & Xem ứng dụng dạng Khách'}</span>
        </button>

        <p className="text-[10px] text-slate-400">
          {isEn
            ? 'EcoStay • Developed by MVP Team • Net Zero Tourism 2050'
            : 'EcoStay • Đề án phát triển bởi Nhóm MVP • Net Zero 2050'}
        </p>
      </div>
    </div>
  );
};
