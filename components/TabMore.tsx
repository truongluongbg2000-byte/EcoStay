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
  UserCheck
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import { rankTranslations } from '@/data/translations';

interface TabMoreProps {
  user: UserProfile;
  currentLang: 'vi' | 'en';
  onChangeLang: (lang: 'vi' | 'en') => void;
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

  const isEn = currentLang === 'en';
  const displayRank = isEn ? rankTranslations[user.rank] || user.rank : user.rank;

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Header Profile Card */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-500 shadow-sm">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
            <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
              <Award size={13} className="text-amber-500" />
              <span>{displayRank}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isEn ? 'Member ID:' : 'Mã thành viên:'} {user.memberCode || 'ECO-TL-883921'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenEcoImpact}
            className="rounded-xl bg-emerald-50 p-2 text-emerald-800 hover:bg-emerald-100 transition-colors"
            title={isEn ? 'View Eco Impact' : 'Xem tác động'}
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
                {isEn ? 'EcoStay Green Passport' : 'Hộ Chiếu Xanh EcoStay'}
              </h4>
              <p className="text-sm font-bold text-white">
                {isEn ? 'Export CO₂ Footprint Report' : 'Xuất Báo Cáo Dấu Chân CO₂'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-900">
            HOT
          </span>
        </div>

        <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
          {isEn
            ? `Generate a personal infographic certifying you reduced ${user.co2Saved}kg CO₂ with EcoStay to share on Facebook/Story or LinkedIn.`
            : `Tạo infographic chứng nhận cá nhân bạn đã cùng EcoStay giảm ${user.co2Saved}kg CO₂ để chia sẻ lên Facebook/Story hoặc LinkedIn.`}
        </p>

        <button
          onClick={onOpenEcoImpact}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-bold text-[#1E4D3E] shadow hover:bg-emerald-50 active:scale-98 transition-all"
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>{isEn ? 'Create Report & Share Story' : 'Tạo Báo Cáo & Chia Sẻ Story'}</span>
        </button>
      </div>

      {/* 3. Settings & Information Menu List */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
        {/* Cài đặt ứng dụng */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Settings size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'App Settings' : 'Cài đặt ứng dụng'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Liên hệ & Hotline */}
        <button
          onClick={onOpenFeedback}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Phone size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'Contact & Support Hotline' : 'Liên hệ & Hotline hỗ trợ'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Giới thiệu chương trình CACBON / CARBON POINT */}
        <button
          onClick={onOpenAbout}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <TreePine size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'About CARBON POINTS Program' : 'Giới thiệu chương trình CACBON POINT'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Thông tin pháp lý & ESG */}
        <button
          onClick={onOpenAbout}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <ShieldAlert size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'Legal Information & ESG Standards' : 'Thông tin pháp lý & Tiêu chuẩn ESG'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Hướng dẫn sử dụng */}
        <button
          onClick={onOpenHandbook}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <BookOpen size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'App User Guide' : 'Hướng dẫn sử dụng App'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Lịch sử mua sắm */}
        <button
          onClick={() => onOpenHistory('orders')}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'Redemption & Order History' : 'Lịch sử mua sắm & đổi quà'}
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Ngôn ngữ hiển thị */}
        <button
          onClick={() => setIsLangModalOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Globe size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {isEn ? 'Display Language' : 'Ngôn ngữ hiển thị'}
            </span>
          </div>
          <span className="text-xs font-bold text-[#1E4D3E] bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200">
            {currentLang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
          </span>
        </button>

        {/* Đăng xuất tài khoản */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-between p-3 hover:bg-amber-50 rounded-2xl transition-colors text-amber-800"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="text-xs font-bold">
                {isEn ? 'Sign Out / Switch User' : 'Đăng xuất tài khoản'}
              </span>
            </div>
            <ChevronRight size={16} className="text-amber-300" />
          </button>
        )}

        {/* Đặt lại dữ liệu mẫu */}
        <button
          onClick={onResetData}
          className="flex w-full items-center justify-between p-3 hover:bg-red-50 rounded-2xl transition-colors text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-xs font-bold">
              {isEn ? 'Reset Initial Demo Data' : 'Đặt lại dữ liệu Demo ban đầu'}
            </span>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </button>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 text-[10px] text-slate-400">
        <p>EcoStay Mobile Web • v2.1</p>
        <p className="mt-0.5">{isEn ? 'Developed by MVP Team' : 'Phát triển bởi Nhóm MVP'}</p>
      </div>

      {/* Language Selector Modal (Only 2 Versions: Tiếng Việt and English as requested) */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-800">
                  {isEn ? 'Select Language' : 'Chọn ngôn ngữ'}
                </h4>
              </div>
              <button
                onClick={() => setIsLangModalOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              {isEn
                ? 'Choose your preferred language. All features and text will update accordingly.'
                : 'Lựa chọn ngôn ngữ hiển thị. Toàn bộ tính năng và giao diện sẽ tự động cập nhật.'}
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Tiếng Việt */}
              <button
                onClick={() => {
                  onChangeLang('vi');
                  setIsLangModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  currentLang === 'vi'
                    ? 'border-emerald-500 bg-emerald-50 text-[#1E4D3E] font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇻🇳</span>
                  <div className="text-left">
                    <p className="text-xs font-bold">Tiếng Việt</p>
                    <p className="text-[10px] text-slate-400">Việt Nam (Dùng thuật ngữ Cacbon)</p>
                  </div>
                </div>
                {currentLang === 'vi' && <Check size={18} className="text-emerald-700 shrink-0" />}
              </button>

              {/* Option 2: English */}
              <button
                onClick={() => {
                  onChangeLang('en');
                  setIsLangModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  currentLang === 'en'
                    ? 'border-emerald-500 bg-emerald-50 text-[#1E4D3E] font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div className="text-left">
                    <p className="text-xs font-bold">English</p>
                    <p className="text-[10px] text-slate-400">Global / US / UK (Uses Carbon Points)</p>
                  </div>
                </div>
                {currentLang === 'en' && <Check size={18} className="text-emerald-700 shrink-0" />}
              </button>
            </div>

            <button
              onClick={() => setIsLangModalOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white hover:bg-[#16392E]"
            >
              {isEn ? 'Close' : 'Đóng'}
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-800">
                  {isEn ? 'App Settings' : 'Cài đặt ứng dụng'}
                </h4>
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
                  <p className="font-semibold text-slate-800">
                    {isEn ? 'Points Earn Notifications' : 'Thông báo cộng điểm'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isEn
                      ? 'Vibrate and alert when mission is completed'
                      : 'Rung và thông báo khi hoàn thành nhiệm vụ'}
                  </p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">
                    {isEn ? 'Camera Battery Saver Mode' : 'Chế độ tiết kiệm pin Camera'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isEn
                      ? 'Auto pause camera feed when switching tabs'
                      : 'Tự động tắt camera khi chuyển tab'}
                  </p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">
                    {isEn ? 'Offline Local Storage' : 'Tự động đồng bộ Offline'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isEn
                      ? 'Persist app data in browser LocalStorage'
                      : 'Lưu dữ liệu vào bộ nhớ máy (LocalStorage)'}
                  </p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
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
                      <p className="font-bold text-[#1E4D3E]">
                        {isEn ? 'Switch Account' : 'Đổi tài khoản'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {isEn
                          ? 'Choose from 4 demo profiles'
                          : 'Chọn trong 4 tài khoản mẫu'}
                      </p>
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
              {isEn ? 'Save Settings' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
