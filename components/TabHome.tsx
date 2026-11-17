'use client';

import React, { useState } from 'react';
import {
  Search,
  X,
  MapPin,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Building2,
  UtensilsCrossed,
  Bike,
  Compass,
  LayoutGrid,
  Leaf
} from 'lucide-react';
import { UserProfile, GreenDestination, DestinationCategory } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabHomeProps {
  user: UserProfile;
  destinations: GreenDestination[];
  onBookService: (destination: GreenDestination) => void;
  onNavigateToEarn: () => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  user,
  destinations,
  onBookService,
  onNavigateToEarn,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Hội An');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>('all');
  const [viewingDestination, setViewingDestination] = useState<GreenDestination | null>(null);

  const locations = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Cúc Phương', label: 'Cúc Phương' },
    { id: 'Hội An', label: 'Hội An' },
    { id: 'Đà Lạt', label: 'Đà Lạt' },
    { id: 'Nam Cát Tiên', label: 'Nam Cát Tiên' },
    { id: 'Ninh Bình', label: 'Ninh Bình' },
  ];

  const categories: { id: DestinationCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Tất cả', icon: <LayoutGrid size={15} /> },
    { id: 'food', label: 'Ăn uống', icon: <UtensilsCrossed size={15} /> },
    { id: 'hotel', label: 'Khách sạn', icon: <Building2 size={15} /> },
    { id: 'activity', label: 'Vui chơi', icon: <Compass size={15} /> },
    { id: 'transport', label: 'Xe cộ', icon: <Bike size={15} /> },
  ];

  // Filtering destinations
  const filtered = destinations.filter((item) => {
    const matchesLocation =
      selectedLocation === 'all' ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLocation && matchesCategory && matchesQuery;
  });

  const handleSelectMapPoint = (loc: string) => {
    setSelectedLocation(loc);
    setSearchQuery('');
  };

  const handleConfirmBooking = (dest: GreenDestination) => {
    triggerEcoConfetti();
    onBookService(dest);
    setViewingDestination(null);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. CACBON POINT Card (Clean & Modern: NO 1đ=1000đ, NO 3 metric bars) */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-emerald-950/5 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ĐIỂM CACBON HIỆN CÓ
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-[#1E4D3E] tracking-tight">
                {user.carbonPoints}
              </span>
              <span className="text-sm font-extrabold text-emerald-600">CP</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              20 điểm sẽ hết hạn vào {user.expiryDate}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100">
            <Leaf size={22} />
          </div>
        </div>

        {/* Quick link to earn points */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Muốn tích lũy thêm điểm xanh?</span>
          <button
            onClick={onNavigateToEarn}
            className="flex items-center gap-1 font-bold text-[#1E4D3E] hover:text-emerald-700 transition-colors"
          >
            <span>Làm nhiệm vụ</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Search Input: "Bạn muốn đi đâu?" */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-emerald-700 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bạn muốn đi đâu? (Hội An, Cúc Phương, Đà Lạt...)"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 rounded-full p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Bản đồ Điểm đến Xanh Việt Nam (Interactive Vector Eco-Map) */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-[#1E4D3E]" />
            <h3 className="text-xs font-bold text-slate-800">
              Bản đồ Điểm đến Xanh Việt Nam
            </h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60">
            Khu vực: {selectedLocation === 'all' ? 'Toàn quốc' : selectedLocation}
          </span>
        </div>

        {/* Visual S-Curve Map Illustration with interactive clickable nodes */}
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-emerald-100/30 border border-emerald-100 p-2">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E4D3E_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* S-curve path representation of Vietnam */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 320 160">
            <path
              d="M 90 25 Q 120 40 150 70 T 180 110 T 160 145"
              fill="none"
              stroke="#A5D6A7"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <path
              d="M 90 25 Q 120 40 150 70 T 180 110 T 160 145"
              fill="none"
              stroke="#2E7D5B"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Interactive Destination Nodes */}
          {/* Cúc Phương Node */}
          <button
            onClick={() => handleSelectMapPoint('Cúc Phương')}
            className={`absolute top-4 left-16 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold shadow transition-all ${
              selectedLocation === 'Cúc Phương'
                ? 'bg-[#1E4D3E] text-white ring-2 ring-emerald-300 scale-105'
                : 'bg-white text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <span>🌲 Cúc Phương</span>
          </button>

          {/* Hội An Node (Active Center) */}
          <button
            onClick={() => handleSelectMapPoint('Hội An')}
            className={`absolute top-16 left-36 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md transition-all ${
              selectedLocation === 'Hội An'
                ? 'bg-[#1E4D3E] text-white ring-2 ring-emerald-300 scale-110'
                : 'bg-white text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>🏮 Hội An</span>
          </button>

          {/* Đà Lạt Node */}
          <button
            onClick={() => handleSelectMapPoint('Đà Lạt')}
            className={`absolute top-24 right-14 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold shadow transition-all ${
              selectedLocation === 'Đà Lạt'
                ? 'bg-[#1E4D3E] text-white ring-2 ring-emerald-300 scale-105'
                : 'bg-white text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <span>🌸 Đà Lạt</span>
          </button>

          {/* Nam Cát Tiên Node */}
          <button
            onClick={() => handleSelectMapPoint('Nam Cát Tiên')}
            className={`absolute bottom-3 left-28 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold shadow transition-all ${
              selectedLocation === 'Nam Cát Tiên'
                ? 'bg-[#1E4D3E] text-white ring-2 ring-emerald-300 scale-105'
                : 'bg-white text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <span>🦜 Nam Cát Tiên</span>
          </button>

          {/* "Tất cả" shortcut button on bottom right */}
          <button
            onClick={() => handleSelectMapPoint('all')}
            className={`absolute bottom-2 right-2 rounded-xl px-2 py-1 text-[10px] font-extrabold transition-all border ${
              selectedLocation === 'all'
                ? 'bg-[#1E4D3E] text-white border-transparent'
                : 'bg-white/90 text-emerald-800 border-emerald-200 hover:bg-white'
            }`}
          >
            🌐 Tất cả
          </button>
        </div>
      </div>

      {/* 4. Danh Mục Dịch Vụ Xanh (Pill category filters) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            DANH MỤC DỊCH VỤ XANH
          </p>
          <span className="text-[11px] font-semibold text-emerald-700">
            {filtered.length} cơ sở đạt chuẩn Xanh
          </span>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-[#1E4D3E] text-white shadow-emerald-950/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Danh Sách Kết Quả Cơ Sở Đạt Chuẩn Xanh (Matching Reference Mockup!) */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
            <Compass size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-700">
              Không tìm thấy địa điểm phù hợp
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Thử tìm kiếm với từ khóa khác như "Hội An", "Ninh Bình" hoặc chọn danh mục "Tất cả".
            </p>
            <button
              onClick={() => {
                setSelectedLocation('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
            >
              Xem tất cả điểm đến
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm border border-emerald-950/5 hover:shadow-md transition-all text-left"
            >
              {/* Image banner */}
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Badges on image */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-[#1E4D3E]/95 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span>{item.greenBadge}</span>
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                    +{item.pointsReward} CP
                  </span>
                </div>

                {item.priceEstimate && (
                  <div className="absolute bottom-2.5 right-2.5 rounded-xl bg-black/60 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    {item.priceEstimate}
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                  <span>{item.categoryName}</span>
                  <span>•</span>
                  <span>{item.location}</span>
                </div>

                <h4 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
                  {item.name}
                </h4>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Footer action */}
                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 line-clamp-1">
                    <MapPin size={12} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{item.address || item.location}</span>
                  </span>

                  <button
                    onClick={() => setViewingDestination(item)}
                    className="flex shrink-0 items-center gap-1 rounded-2xl bg-[#1E4D3E] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#16392E] active:scale-95 transition-all"
                  >
                    <span>Xem & Đặt dịch vụ</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Destination Booking Modal */}
      {viewingDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setViewingDestination(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden">
              <img
                src={viewingDestination.image}
                alt={viewingDestination.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                <span className="rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-[10px] font-bold w-fit">
                  {viewingDestination.greenBadge}
                </span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {viewingDestination.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-slate-700">Địa chỉ:</p>
                <p className="text-slate-600 mt-0.5">{viewingDestination.address || viewingDestination.location}</p>
              </div>

              <div>
                <p className="font-bold text-slate-700">Tiêu chuẩn sinh thái & Điểm thưởng:</p>
                <div className="mt-1 rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
                  <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                    {viewingDestination.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span>Thưởng khi trải nghiệm:</span>
                    <span className="text-sm font-extrabold text-[#1E4D3E]">
                      +{viewingDestination.pointsReward} Điểm CP
                    </span>
                  </div>
                </div>
              </div>

              {viewingDestination.priceEstimate && (
                <div>
                  <p className="font-bold text-slate-700">Mức giá tham khảo:</p>
                  <p className="text-sm font-extrabold text-[#1E4D3E] mt-0.5">
                    {viewingDestination.priceEstimate}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleConfirmBooking(viewingDestination)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1E4D3E] py-3 text-xs font-bold text-white shadow-md hover:bg-[#16392E] transition-all"
              >
                <Sparkles size={15} className="text-amber-400" />
                <span>Đặt Dịch Vụ Ngay (+{viewingDestination.pointsReward} CP)</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  viewingDestination.name + ' ' + viewingDestination.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Navigation size={14} className="text-emerald-700" />
                <span>Mở Google Maps Dẫn Đường (Miễn phí)</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
