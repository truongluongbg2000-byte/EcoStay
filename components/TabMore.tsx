'use client';

import React, { useState } from 'react';
import {
  Settings,
  Phone,
  FileQuestion,
  Share2,
  TreePine,
  ShieldAlert,
  Sparkles,
  History,
  BookOpen,
  ShoppingBag,
  Globe,
  LogOut,
  ChevronRight,
  Award,
  Leaf,
  Check,
  X
} from 'lucide-react';
import { UserProfile } from '@/data/types';

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
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

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
              <span>{user.rank}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Mã thành viên: {user.memberCode || 'ECO-TL-883921'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEcoImpact}
          className="rounded-xl bg-emerald-50 p-2 text-emerald-800 hover:bg-emerald-100 transition-colors"
          title="Xem tác động"
        >
          <Leaf size={18} />
        </button>
      </div>

      {/* 2. Special Highlight: "Xuất Báo Cáo Dấu Chân Sinh Thái" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] p-4 text-white shadow-lg">
        <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-emerald-300">
              <TreePine size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Hộ Chiếu Xanh EcoStay
              </h4>
              <p className="text-sm font-bold text-white">Xuất Báo Cáo Dấu Chân CO₂</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-900">
            HOT
          </span>
        </div>

        <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
          Tạo infographic chứng nhận cá nhân bạn đã cùng EcoStay giảm {user.co2Saved}kg CO₂ để chia sẻ lên Facebook/Story hoặc LinkedIn.
        </p>

        <button
          onClick={onOpenEcoImpact}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-bold text-[#1E4D3E] shadow hover:bg-emerald-50 active:scale-98 transition-all"
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>Tạo Báo Cáo & Chia Sẻ Story</span>
        </button>
      </div>

      {/* 3. Settings & Information Menu List (Replaced "Đường tới ECOSTAY" with "Cài đặt") */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
        
        {/* Cài đặt (Thay cho Đường tới EcoStay) */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Settings size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Cài đặt ứng dụng</span>
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
            <span className="text-xs font-semibold text-slate-700">Liên hệ & Hotline hỗ trợ</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Khảo sát sống xanh */}
        <button
          onClick={onOpenFeedback}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <FileQuestion size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Khảo sát ý kiến du khách (+15 CP)</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Mời bạn bè */}
        <button
          onClick={onOpenEcoImpact}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Share2 size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Mời bạn bè sống xanh (+50 CP)</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Giới thiệu chương trình CACBON POINT */}
        <button
          onClick={onOpenAbout}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <TreePine size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Giới thiệu chương trình CACBON POINT</span>
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
            <span className="text-xs font-semibold text-slate-700">Thông tin pháp lý & Tiêu chuẩn ESG</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Lịch sử điểm */}
        <button
          onClick={() => onOpenHistory('points')}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <History size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Lịch sử điểm CACBON POINT</span>
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
            <span className="text-xs font-semibold text-slate-700">Hướng dẫn sử dụng App</span>
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
            <span className="text-xs font-semibold text-slate-700">Lịch sử mua sắm & đổi quà</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Ngôn ngữ (Chỉ Tiếng Việt và Tiếng Anh theo yêu cầu) */}
        <button
          onClick={() => setIsLangModalOpen(true)}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Globe size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Ngôn ngữ hiển thị</span>
          </div>
          <span className="text-xs font-bold text-[#1E4D3E] bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200">
            {currentLang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
          </span>
        </button>

        {/* Đặt lại dữ liệu mẫu */}
        <button
          onClick={onResetData}
          className="flex w-full items-center justify-between p-3 hover:bg-red-50 rounded-2xl transition-colors text-red-600"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-xs font-bold">Đặt lại dữ liệu Demo ban đầu</span>
          </div>
          <ChevronRight size={16} className="text-red-300" />
        </button>

      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 text-[10px] text-slate-400">
        <p>EcoStay Mobile Web • v2.0 (Thăng Long Kỳ Tích)</p>
        <p className="mt-0.5">Phát triển bởi Nhóm Tinh Hà Say Hi - Lớp QI3703</p>
      </div>

      {/* Language Selector Modal (Only Tiếng Việt and Tiếng Anh) */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-800">Chọn ngôn ngữ / Language</h4>
              </div>
              <button
                onClick={() => setIsLangModalOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onChangeLang('vi');
                  setIsLangModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  currentLang === 'vi'
                    ? 'border-emerald-500 bg-emerald-50 text-[#1E4D3E] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇻🇳</span>
                  <span className="text-xs">Tiếng Việt (Mặc định)</span>
                </div>
                {currentLang === 'vi' && <Check size={16} className="text-emerald-700" />}
              </button>

              <button
                onClick={() => {
                  onChangeLang('en');
                  setIsLangModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  currentLang === 'en'
                    ? 'border-emerald-500 bg-emerald-50 text-[#1E4D3E] font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇬🇧</span>
                  <span className="text-xs">English (US/UK)</span>
                </div>
                {currentLang === 'en' && <Check size={16} className="text-emerald-700" />}
              </button>
            </div>

            <button
              onClick={() => setIsLangModalOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white hover:bg-[#16392E]"
            >
              Xác nhận
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
                <h4 className="text-sm font-bold text-slate-800">Cài đặt ứng dụng</h4>
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
                  <p className="font-semibold text-slate-800">Thông báo cộng điểm</p>
                  <p className="text-[10px] text-slate-400">Rung và thông báo khi hoàn thành nhiệm vụ</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">Chế độ tiết kiệm pin Camera</p>
                  <p className="text-[10px] text-slate-400">Tự động tắt camera khi chuyển tab</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-slate-800">Tự động đồng bộ Offline</p>
                  <p className="text-[10px] text-slate-400">Lưu dữ liệu vào bộ nhớ máy (LocalStorage)</p>
                </div>
                <div className="h-5 w-9 bg-emerald-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="h-4 w-4 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white hover:bg-[#16392E]"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
