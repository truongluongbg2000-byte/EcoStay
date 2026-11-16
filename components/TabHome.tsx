'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Droplets,
  Zap,
  BookOpen,
  MessageSquareQuote,
  Gift,
  CalendarDays,
  Handshake,
  Navigation,
  History,
  ShoppingBag,
  TreePine,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import { TabId } from './BottomNav';

interface TabHomeProps {
  user: UserProfile;
  onNavigate: (tab: TabId) => void;
  onOpenHandbook: () => void;
  onOpenDirections: () => void;
  onOpenHistory: (tab?: 'points' | 'orders') => void;
  onOpenFeedback: () => void;
  onOpenPartners: () => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  user,
  onNavigate,
  onOpenHandbook,
  onOpenDirections,
  onOpenHistory,
  onOpenFeedback,
  onOpenPartners,
}) => {
  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: 'Chiến Dịch Phủ Xanh 1 Vạn Cây Rừng',
      subtitle: 'Quy đổi CACBON POINT nhận ngay cây bách xanh Cúc Phương',
      tag: 'Chương Trình Trọng Điểm',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      action: () => onNavigate('rewards'),
      buttonText: 'Trồng cây ngay',
    },
    {
      title: 'Tour Du Lịch Xanh Behind-The-Scenes',
      subtitle: 'Khám phá quy trình tái chế và năng lượng mặt trời',
      tag: 'Trải Nghiệm Độc Quyền',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      action: () => onNavigate('rewards'),
      buttonText: 'Xem chi tiết',
    },
    {
      title: 'Hành Trình Net Zero 2050',
      subtitle: 'Mỗi đêm nghỉ tại EcoStay giảm tới 2.1kg phát thải CO₂',
      tag: 'Cam Kết Bền Vững',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      action: () => onNavigate('scanner'),
      buttonText: 'Làm nhiệm vụ',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="space-y-4 px-4 pt-3 pb-6 text-left">
      {/* 1. CACBON POINT Card (Gradient Forest Green) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E4D3E] via-[#16392E] to-[#0F2820] p-5 text-white shadow-xl">
        {/* Glow Effects */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-600/10 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300">
                <TreePine size={16} />
              </div>
              <span className="text-xs font-semibold tracking-wider text-emerald-200 uppercase">
                Tài Khoản Cacbon Point
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200">
              1 Điểm = 1.000đ
            </span>
          </div>

          {/* Big Points Display */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {user.carbonPoints}
            </span>
            <span className="text-sm font-semibold text-emerald-300">Điểm CB</span>
          </div>

          <p className="mt-1 text-[11px] text-emerald-100/70">
            Có {user.carbonPoints} điểm sẽ hết hạn vào {user.expiryDate}. Hãy đổi quà nhé!
          </p>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="text-[11px] text-white/70">
              Điểm AVN phụ: <span className="font-bold text-white">{user.avnPoints}</span>
            </div>
            <button
              onClick={() => onNavigate('rewards')}
              className="flex items-center gap-1.5 rounded-full bg-[#D97736] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#C26D45] active:scale-95 transition-all"
            >
              <span>Đổi voucher ngay</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Impact Dashboard (3 Metric Cards) */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#1E4D3E]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Chỉ số tác động kỳ này
            </h3>
          </div>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Thời gian thực
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Metric 1: CO2 */}
          <div className="rounded-2xl bg-gradient-to-b from-emerald-50/80 to-emerald-100/40 p-2.5 border border-emerald-100">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm mb-1">
              <TreePine size={14} />
            </div>
            <p className="text-base font-extrabold text-[#1E4D3E]">{user.co2Saved}</p>
            <p className="text-[10px] font-medium text-slate-500">kg CO₂ giảm</p>
          </div>

          {/* Metric 2: Water */}
          <div className="rounded-2xl bg-gradient-to-b from-cyan-50/80 to-cyan-100/40 p-2.5 border border-cyan-100">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-white shadow-sm mb-1">
              <Droplets size={14} />
            </div>
            <p className="text-base font-extrabold text-cyan-900">{user.waterSaved}L</p>
            <p className="text-[10px] font-medium text-slate-500">Nước tiết kiệm</p>
          </div>

          {/* Metric 3: Energy */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-50/80 to-amber-100/40 p-2.5 border border-amber-100">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm mb-1">
              <Zap size={14} />
            </div>
            <p className="text-base font-extrabold text-amber-900">{user.energySaved}</p>
            <p className="text-[10px] font-medium text-slate-500">kWh Điện sạch</p>
          </div>
        </div>
      </div>

      {/* 3. Banner Carousel */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md">
        <div className="relative h-44 w-full">
          <img
            src={banners[currentSlide].image}
            alt={banners[currentSlide].title}
            className="h-full w-full object-cover opacity-70 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <span className="w-fit rounded-full bg-[#1E4D3E]/80 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-semibold text-emerald-200 mb-1.5 border border-emerald-400/30">
              {banners[currentSlide].tag}
            </span>
            <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
              {banners[currentSlide].title}
            </h4>
            <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5">
              {banners[currentSlide].subtitle}
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <button
                onClick={banners[currentSlide].action}
                className="flex items-center gap-1 rounded-xl bg-white px-3 py-1 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-50 active:scale-95 transition-all shadow"
              >
                <span>{banners[currentSlide].buttonText}</span>
                <ArrowRight size={12} />
              </button>

              {/* Dots indicator */}
              <div className="flex gap-1.5">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === idx ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 8-Grid Quick Shortcuts (Matching original docx design) */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
          Tiện ích xanh EcoStay
        </h3>

        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          {/* 1. Cẩm nang */}
          <button
            onClick={onOpenHandbook}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <BookOpen size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Cẩm nang
            </span>
          </button>

          {/* 2. Gửi ý kiến */}
          <button
            onClick={onOpenFeedback}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <MessageSquareQuote size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Gửi ý kiến
            </span>
          </button>

          {/* 3. Quà tặng */}
          <button
            onClick={() => onNavigate('rewards')}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <Gift size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Quà tặng
            </span>
          </button>

          {/* 4. Ngày hội thành viên */}
          <button
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <CalendarDays size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Ngày hội xanh
            </span>
          </button>

          {/* 5. Đối tác */}
          <button
            onClick={onOpenPartners}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <Handshake size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Đối tác
            </span>
          </button>

          {/* 6. Đường tới ECOSTAY */}
          <button
            onClick={onOpenDirections}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <Navigation size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Đường tới nơi
            </span>
          </button>

          {/* 7. Lịch sử điểm */}
          <button
            onClick={() => onOpenHistory('points')}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <History size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Lịch sử điểm
            </span>
          </button>

          {/* 8. Lịch sử mua sắm */}
          <button
            onClick={() => onOpenHistory('orders')}
            className="flex flex-col items-center group transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1E4D3E] group-hover:bg-[#1E4D3E] group-hover:text-white transition-all shadow-sm">
              <ShoppingBag size={20} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1">
              Đơn đổi quà
            </span>
          </button>
        </div>
      </div>

      {/* 5. Quick mission tease banner */}
      <div
        onClick={() => onNavigate('scanner')}
        className="cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-800 to-[#1E4D3E] p-3.5 text-white flex items-center justify-between shadow-sm hover:opacity-95 transition-opacity"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-emerald-300">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs font-bold">Hôm nay bạn chưa làm nhiệm vụ xanh?</p>
            <p className="text-[10px] text-emerald-200">Gạt tắt dọn phòng nhận ngay +50 CB</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-emerald-300" />
      </div>
    </div>
  );
};
