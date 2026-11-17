'use client';

import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  LayoutGrid,
  Leaf,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { UserProfile, GreenDestination, DestinationCategory } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';
import { destinationTranslations, destinationCategoryTranslations, mapLocationTranslations } from '@/data/translations';
import { EcoMap } from './EcoMap';

interface TabHomeProps {
  user: UserProfile;
  destinations: GreenDestination[];
  currentLang?: 'vi' | 'en';
  onBookService: (destination: GreenDestination) => void;
  onNavigateToEarn: () => void;
  onOpenAIChat: () => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  user,
  destinations,
  currentLang = 'vi',
  onBookService,
  onNavigateToEarn,
  onOpenAIChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('Hội an');
  const [selectedLocation, setSelectedLocation] = useState<string>('Hội An');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>('all');
  const [viewingDestination, setViewingDestination] = useState<GreenDestination | null>(null);

  const isEn = currentLang === 'en';

  // Automatically fly to location when user types in search
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // If empty and was set by user typing, don't force
      return;
    }
    if (q.includes('hội an') || q.includes('hoi an') || q.includes('hoian')) {
      setSelectedLocation('Hội An');
    } else if (q.includes('cúc phương') || q.includes('cuc phuong')) {
      setSelectedLocation('Cúc Phương');
    } else if (q.includes('đà lạt') || q.includes('da lat') || q.includes('dalat')) {
      setSelectedLocation('Đà Lạt');
    } else if (q.includes('nam cát tiên') || q.includes('nam cat tien') || q.includes('cat tien')) {
      setSelectedLocation('Nam Cát Tiên');
    } else if (q.includes('ninh bình') || q.includes('ninh binh')) {
      setSelectedLocation('Ninh Bình');
    } else if (q.includes('tất cả') || q.includes('all') || q.includes('toàn quốc')) {
      setSelectedLocation('all');
    }
  }, [searchQuery]);

  const categories: { id: DestinationCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: isEn ? 'All' : 'Tất cả', icon: <LayoutGrid size={15} /> },
    { id: 'food', label: isEn ? 'Dining' : 'Ăn uống', icon: <UtensilsCrossed size={15} /> },
    { id: 'hotel', label: isEn ? 'Hotels' : 'Khách sạn', icon: <Building2 size={15} /> },
    { id: 'transport', label: isEn ? 'Transit' : 'Di chuyển', icon: <Bike size={15} /> },
    { id: 'activity', label: isEn ? 'Activities' : 'Vui chơi', icon: <Compass size={15} /> },
    { id: 'shopping', label: isEn ? 'Shopping' : 'Mua sắm', icon: <ShoppingBag size={15} /> },
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
    if (loc === 'all') {
      setSearchQuery('');
    } else {
      setSearchQuery(loc);
    }
  };

  const handleConfirmBooking = (dest: GreenDestination) => {
    triggerEcoConfetti();
    onBookService(dest);
    setViewingDestination(null);
  };

  const getCategoryIconBox = (cat: DestinationCategory) => {
    switch (cat) {
      case 'hotel':
        return <Building2 size={18} className="text-emerald-700" />;
      case 'food':
        return <UtensilsCrossed size={18} className="text-emerald-700" />;
      case 'transport':
        return <Bike size={18} className="text-emerald-700" />;
      case 'activity':
        return <Compass size={18} className="text-emerald-700" />;
      case 'shopping':
        return <ShoppingBag size={18} className="text-emerald-700" />;
      default:
        return <Leaf size={18} className="text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-3.5 px-4 pt-3 pb-24 text-left relative">
      {/* 1. CACBON POINT Card (Clean: NO 1đ=1000đ, NO 3 metric bars) */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isEn ? 'AVAILABLE CARBON POINTS' : 'ĐIỂM CACBON HIỆN CÓ'}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1E4D3E] tracking-tight">
                {user.carbonPoints}
              </span>
              <span className="text-sm font-extrabold text-emerald-600">CP</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {isEn
                ? `20 points will expire on ${user.expiryDate}`
                : `20 điểm sẽ hết hạn vào ${user.expiryDate}`}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100">
            <Leaf size={20} />
          </div>
        </div>

        {/* Quick link to earn points */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px]">
            {isEn ? 'Want to collect more eco points?' : 'Muốn tích lũy thêm điểm xanh?'}
          </span>
          <button
            onClick={onNavigateToEarn}
            className="flex items-center gap-1 font-bold text-[#1E4D3E] hover:text-emerald-700 transition-colors text-xs"
          >
            <span>{isEn ? 'Missions' : 'Làm nhiệm vụ'}</span>
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
            placeholder={
              isEn
                ? 'Where do you want to go? (Hoi An, Da Lat...)'
                : 'Bạn muốn đi đâu? (Hội An, Cúc Phương, Đà Lạt...)'
            }
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLocation('all');
              }}
              className="absolute right-3.5 rounded-full p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Bản đồ Điểm đến Xanh Việt Nam Chuyên nghiệp (Realistic Interactive Street Eco-Map with Leaflet) */}
      <EcoMap
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectMapPoint}
        currentLang={currentLang}
        destinations={destinations}
        onSelectVenue={setViewingDestination}
      />

      {/* 4. Danh Mục Dịch Vụ Xanh (Pills: Tất cả, Ăn uống, Khách sạn, Di chuyển, Vui chơi, Mua sắm) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isEn ? 'GREEN SERVICE CATEGORIES' : 'DANH MỤC DỊCH VỤ XANH'}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700">
            {filtered.length} {isEn ? 'certified green venues' : 'cơ sở đạt chuẩn Xanh'}
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

      {/* 5. Danh Sách Kết Quả Cơ Sở Đạt Chuẩn Xanh (Clean Card Layout Matching Mockup!) */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center border border-slate-100">
            <Compass size={28} className="mx-auto text-slate-300 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">
              {isEn ? 'No venues found' : 'Không tìm thấy địa điểm phù hợp'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isEn
                ? 'Try searching "Hoi An" or tap "All".'
                : 'Thử tìm kiếm với từ khóa khác như "Hội An", "Đà Lạt" hoặc bấm "Tất cả".'}
            </p>
            <button
              onClick={() => {
                setSelectedLocation('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
            >
              {isEn ? 'View all venues' : 'Xem tất cả điểm đến'}
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const trans = isEn ? destinationTranslations[item.id] : null;
            const displayName = trans?.name || item.name;
            const displayLocation = isEn
              ? mapLocationTranslations[item.location] || item.location
              : item.location;
            const displayCategoryName = isEn
              ? destinationCategoryTranslations[item.category] || item.categoryName
              : item.categoryName;
            const displayTitle = trans?.title || item.title;
            const displayDesc = trans?.desc || item.description;
            const displayBadge = trans?.badge || item.greenBadge;

            const translatedItem: GreenDestination = {
              ...item,
              name: displayName,
              location: displayLocation,
              categoryName: displayCategoryName,
              title: displayTitle,
              description: displayDesc,
              greenBadge: displayBadge,
            };

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5 hover:border-emerald-200 hover:shadow-md transition-all text-left"
              >
                {/* Top row: 100% Xanh pill on left & +300 CP on right (matching mockup) */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>{isEn ? '100% Green' : '100% Xanh'}</span>
                  </span>

                  <span className="rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    +{item.pointsReward} CP
                  </span>
                </div>

                {/* Title & Category with Icon */}
                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 shadow-2xs">
                    {getCategoryIconBox(item.category)}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      {displayCategoryName} • {displayLocation}
                    </p>
                    <h4 className="mt-0.5 text-sm font-extrabold text-slate-900 leading-snug">
                      {displayName}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {displayDesc}
                </p>

                {/* Bottom Row: Green Certificate Badge + Action Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 line-clamp-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-700 shrink-0" />
                    <span>{displayBadge}</span>
                  </span>

                  <button
                    onClick={() => setViewingDestination(translatedItem)}
                    className="shrink-0 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-100 active:scale-95 transition-all shadow-2xs border border-emerald-200/60"
                  >
                    {isEn ? 'View & Book' : 'Xem & Đặt dịch vụ'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Prominent Floating AI Chatbot Avatar Button (Matching user's circular robot photo!) */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end">
        <button
          onClick={onOpenAIChat}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#1E4D3E] via-[#2D6A56] to-emerald-500 shadow-xl ring-4 ring-white/90 hover:scale-105 active:scale-95 transition-all"
          aria-label="Hỏi EcoBot AI"
        >
          {/* Subtle pulse glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

          {/* Avatar image */}
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-200 shadow-inner bg-[#16392E]">
            <img
              src="/chatbot-avatar.png"
              alt="EcoBot AI"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Bot size={22} className="text-emerald-300 absolute inset-0 m-auto" />
          </div>

          {/* Mini online green dot */}
          <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs" />
        </button>

        <span className="mt-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 backdrop-blur-sm shadow pointer-events-none">
          EcoBot AI
        </span>
      </div>

      {/* 7. Modal "Xem & Đặt dịch vụ" */}
      {viewingDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  {getCategoryIconBox(viewingDestination.category)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {viewingDestination.categoryName}
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    {viewingDestination.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDestination(null)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-3 text-xs text-slate-600 leading-relaxed pr-1">
              <div className="h-36 w-full rounded-2xl overflow-hidden relative shadow-sm">
                <img
                  src={viewingDestination.image}
                  alt={viewingDestination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-black text-white shadow">
                  +{viewingDestination.pointsReward} CP
                </div>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {viewingDestination.name}
                </h4>
                <p className="text-[11px] font-medium text-emerald-800 mt-0.5">
                  {viewingDestination.title}
                </p>
              </div>

              <p className="text-xs text-slate-600">{viewingDestination.description}</p>

              <div className="rounded-2xl bg-emerald-50/80 p-3 border border-emerald-100 space-y-1.5">
                <p className="text-[11px] font-bold text-[#1E4D3E]">
                  🌿 {isEn ? 'Green Certifications & Rewards:' : 'Tiêu chí Xanh & Quyền lợi tích điểm:'}
                </p>
                <p className="text-[11px] text-slate-700">
                  • <strong>{viewingDestination.greenBadge}</strong>
                </p>
                <p className="text-[11px] text-slate-700">
                  • {isEn ? 'Reward:' : 'Thưởng ngay:'}{' '}
                  <strong className="text-emerald-700">+{viewingDestination.pointsReward} CP</strong>{' '}
                  {isEn ? 'credited directly to your EcoStay balance.' : 'khi sử dụng dịch vụ tại đây.'}
                </p>
                {viewingDestination.priceEstimate && (
                  <p className="text-[11px] text-slate-700">
                    • {isEn ? 'Price reference:' : 'Mức giá tham khảo:'}{' '}
                    <strong>{viewingDestination.priceEstimate}</strong>
                  </p>
                )}
              </div>

              {viewingDestination.address && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                  <MapPin size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>{viewingDestination.address}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => handleConfirmBooking(viewingDestination)}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white shadow hover:bg-[#16392E] active:scale-98 transition-all"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>
                  {isEn ? 'Book Service & Earn' : 'Đặt Dịch Vụ & Tích'}{' '}
                  +{viewingDestination.pointsReward} CP
                </span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  viewingDestination.name + ' ' + (viewingDestination.address || viewingDestination.location)
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Navigation size={13} className="text-emerald-700" />
                <span>{isEn ? 'Get Directions on Google Maps' : 'Chỉ đường qua Google Maps'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
