'use client';

import React from 'react';
import {
  Navigation,
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
  Leaf
} from 'lucide-react';
import { UserProfile } from '@/data/types';

interface TabMoreProps {
  user: UserProfile;
  onOpenEcoImpact: () => void;
  onOpenDirections: () => void;
  onOpenHandbook: () => void;
  onOpenHistory: (tab?: 'points' | 'orders') => void;
  onOpenFeedback: () => void;
  onOpenAbout: () => void;
  onResetData: () => void;
}

export const TabMore: React.FC<TabMoreProps> = ({
  user,
  onOpenEcoImpact,
  onOpenDirections,
  onOpenHandbook,
  onOpenHistory,
  onOpenFeedback,
  onOpenAbout,
  onResetData,
}) => {
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
              Tài khoản đã định danh • {user.roomNumber}
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

      {/* 3. Settings & Information Menu List (Matching original image 6) */}
      <div className="rounded-3xl bg-white p-2 shadow-sm border border-emerald-950/5 divide-y divide-slate-100">
        
        {/* Đường tới ECOSTAY */}
        <button
          onClick={onOpenDirections}
          className="flex w-full items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Navigation size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Đường tới ECOSTAY</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>

        {/* Liên hệ */}
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
            <span className="text-xs font-semibold text-slate-700">Khảo sát ý kiến du khách (+15 CB)</span>
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
            <span className="text-xs font-semibold text-slate-700">Mời bạn bè sống xanh</span>
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

        {/* Thông tin pháp lý */}
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

        {/* Ngôn ngữ */}
        <div className="flex w-full items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="text-emerald-800">
              <Globe size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700">Ngôn ngữ hiển thị</span>
          </div>
          <span className="text-xs font-bold text-[#1E4D3E] bg-emerald-50 px-2.5 py-1 rounded-xl">
            Tiếng Việt (VN)
          </span>
        </div>

        {/* Đăng xuất / Đặt lại dữ liệu mẫu */}
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
        <p>EcoStay Mobile Web • v1.0.4 (Thăng Long Kỳ Tích)</p>
        <p className="mt-0.5">Phát triển bởi Nhóm Tinh Hà Say Hi - Lớp QI3703</p>
      </div>
    </div>
  );
};
