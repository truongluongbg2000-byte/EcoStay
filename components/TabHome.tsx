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
import { getDictionary, formatText, Lang } from '@/lib/i18n';
import { EcoMap } from './EcoMap';

interface TabHomeProps {
  user: UserProfile;
  destinations: GreenDestination[];
  currentLang?: Lang;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('Hội An');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>('all');
  const [viewingDestination, setViewingDestination] = useState<GreenDestination | null>(null);

  const t = getDictionary(currentLang);

  // Automatically fly to location when user types in search (supports all 5 languages)
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return;
    }
    if (
      q.includes('hội an') ||
      q.includes('hoi an') ||
      q.includes('hoian') ||
      q.includes('호이안') ||
      q.includes('ホイアン') ||
      q.includes('会安')
    ) {
      setSelectedLocation('Hội An');
    } else if (
      q.includes('cúc phương') ||
      q.includes('cuc phuong') ||
      q.includes('꾹프엉') ||
      q.includes('クックフォン') ||
      q.includes('菊芳')
    ) {
      setSelectedLocation('Cúc Phương');
    } else if (
      q.includes('đà lạt') ||
      q.includes('da lat') ||
      q.includes('dalat') ||
      q.includes('달랏') ||
      q.includes('ダラット') ||
      q.includes('大叻')
    ) {
      setSelectedLocation('Đà Lạt');
    } else if (
      q.includes('nam cát tiên') ||
      q.includes('nam cat tien') ||
      q.includes('cat tien') ||
      q.includes('남깟띠엔') ||
      q.includes('ナムカッティエン') ||
      q.includes('南吉仙')
    ) {
      setSelectedLocation('Nam Cát Tiên');
    } else if (
      q.includes('ninh bình') ||
      q.includes('ninh binh') ||
      q.includes('닌빈') ||
      q.includes('ニンビン') ||
      q.includes('宁平')
    ) {
      setSelectedLocation('Ninh Bình');
    } else if (
      q.includes('sa pa') ||
      q.includes('sapa') ||
      q.includes('사파') ||
      q.includes('サパ') ||
      q.includes('沙巴')
    ) {
      setSelectedLocation('Sa Pa');
    } else if (
      q.includes('tất cả') ||
      q.includes('all') ||
      q.includes('toàn quốc') ||
      q.includes('전체') ||
      q.includes('すべて') ||
      q.includes('全部')
    ) {
      setSelectedLocation('all');
    }
  }, [searchQuery]);

  // Pre-calculate counts per category for the current region + search query
  const locationScopedDestinations = destinations.filter((item) => {
    const trans = t.data.destinations[item.id];
    const displayName = trans?.name || item.name;
    const displayLocation = t.data.locations[item.location] || item.location;
    const displayCategoryName =
      trans?.categoryName || t.data.destinationCategories[item.category] || item.categoryName;
    const displayDesc = trans?.desc || item.description;

    const matchesLocation =
      selectedLocation === 'all' ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.greenBadge.toLowerCase().includes(q) ||
      (item.address && item.address.toLowerCase().includes(q)) ||
      displayName.toLowerCase().includes(q) ||
      displayLocation.toLowerCase().includes(q) ||
      displayCategoryName.toLowerCase().includes(q) ||
      displayDesc.toLowerCase().includes(q);

    return matchesLocation && matchesQuery;
  });

  const categories: { id: DestinationCategory; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: t.data.destinationCategories.all || t.common.all,
      count: locationScopedDestinations.length,
      icon: <LayoutGrid size={15} />,
    },
    {
      id: 'food',
      label: t.data.destinationCategories.food,
      count: locationScopedDestinations.filter((d) => d.category === 'food').length,
      icon: <UtensilsCrossed size={15} />,
    },
    {
      id: 'hotel',
      label: t.data.destinationCategories.hotel,
      count: locationScopedDestinations.filter((d) => d.category === 'hotel').length,
      icon: <Building2 size={15} />,
    },
    {
      id: 'transport',
      label: t.data.destinationCategories.transport,
      count: locationScopedDestinations.filter((d) => d.category === 'transport').length,
      icon: <Bike size={15} />,
    },
    {
      id: 'activity',
      label: t.data.destinationCategories.activity,
      count: locationScopedDestinations.filter((d) => d.category === 'activity').length,
      icon: <Compass size={15} />,
    },
    {
      id: 'shopping',
      label: t.data.destinationCategories.shopping,
      count: locationScopedDestinations.filter((d) => d.category === 'shopping').length,
      icon: <ShoppingBag size={15} />,
    },
  ];

  // Filtering destinations
  const filtered = locationScopedDestinations.filter((item) => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const handleSelectMapPoint = (loc: string) => {
    setSelectedLocation(loc);
    if (loc === 'all') {
      setSearchQuery('');
    } else {
      setSearchQuery(t.data.locations[loc] || loc);
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
              {t.home.availablePoints}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#1E4D3E] tracking-tight">
                {user.carbonPoints}
              </span>
              <span className="text-sm font-extrabold text-emerald-600">CB</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {formatText(t.home.expiryNotice, { date: user.expiryDate })}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100">
            <Leaf size={20} />
          </div>
        </div>

        {/* Quick link to earn points */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px] truncate pr-2">
            {t.earn.headerTitle}
          </span>
          <button
            onClick={onNavigateToEarn}
            className="flex shrink-0 items-center gap-1 font-bold text-[#1E4D3E] hover:text-emerald-700 transition-colors text-xs"
          >
            <span>{t.nav.earn}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-emerald-700 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.home.searchPlaceholder}
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

      {/* 3. Interactive Street Eco-Map with Leaflet */}
      <EcoMap
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectMapPoint}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currentLang={currentLang}
        destinations={destinations}
        onSelectVenue={setViewingDestination}
      />

      {/* 4. Green Service Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {t.home.categoriesTitle}
          </p>
          <span className="shrink-0 text-[11px] font-semibold text-emerald-700">
            {formatText(t.home.certifiedVenues, { count: filtered.length })}
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
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-400/25 text-emerald-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Certified Green Venues List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center border border-slate-100">
            <Compass size={28} className="mx-auto text-slate-300 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">
              {t.home.noVenuesFound}
            </p>
            <button
              onClick={() => {
                setSelectedLocation('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
            >
              {t.home.resetFilter}
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const trans = t.data.destinations[item.id];
            const displayName = trans?.name || item.name;
            const displayLocation = t.data.locations[item.location] || item.location;
            const displayCategoryName =
              trans?.categoryName ||
              t.data.destinationCategories[item.category] ||
              item.categoryName;
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
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80 flex items-center gap-1 truncate">
                    <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{displayBadge}</span>
                  </span>

                  <span className="shrink-0 rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                    +{item.pointsReward} CB
                  </span>
                </div>

                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 shadow-2xs">
                    {getCategoryIconBox(item.category)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      {displayCategoryName} • {displayLocation}
                    </p>
                    <h4 className="mt-0.5 text-sm font-extrabold text-slate-900 leading-snug">
                      {displayName}
                    </h4>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {displayDesc}
                </p>

                {item.address && (
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin size={12} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{item.address}</span>
                  </p>
                )}

                <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 truncate flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-700 shrink-0" />
                    <span className="truncate">{item.priceEstimate || t.home.greenBadge100}</span>
                  </span>

                  <button
                    onClick={() => setViewingDestination(translatedItem)}
                    className="shrink-0 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-100 active:scale-95 transition-all shadow-2xs border border-emerald-200/60"
                  >
                    {t.home.viewAndBook}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Prominent Floating AI Chatbot Avatar Button */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end">
        <button
          onClick={onOpenAIChat}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#1E4D3E] via-[#2D6A56] to-emerald-500 shadow-xl ring-4 ring-white/90 hover:scale-105 active:scale-95 transition-all"
          aria-label={t.home.ecoBotLabel}
        >
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-200 shadow-inner bg-[#16392E] flex items-center justify-center">
            <Bot size={22} className="text-emerald-300 absolute inset-0 m-auto z-0" />
            <img
              src="/chatbot-avatar.png"
              alt="EcoBot AI"
              className="relative z-10 h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs" />
        </button>

        <span className="mt-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 backdrop-blur-sm shadow pointer-events-none">
          EcoBot AI
        </span>
      </div>

      {/* 7. Modal "View & Book" */}
      {viewingDestination && (() => {
        const modalTrans = t.data.destinations[viewingDestination.id];
        const modalName = modalTrans?.name || viewingDestination.name;
        const modalTitle = modalTrans?.title || viewingDestination.title;
        const modalDesc = modalTrans?.desc || viewingDestination.description;
        const modalBadge = modalTrans?.badge || viewingDestination.greenBadge;
        const modalCat =
          modalTrans?.categoryName ||
          t.data.destinationCategories[viewingDestination.category] ||
          viewingDestination.categoryName;
        const modalLoc =
          t.data.locations[viewingDestination.location] || viewingDestination.location;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    {getCategoryIconBox(viewingDestination.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {modalCat}
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-semibold">
                      {modalLoc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingDestination(null)}
                  className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
                  aria-label={t.common.close}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 flex-1 overflow-y-auto space-y-3 text-xs text-slate-600 leading-relaxed pr-1">
                <div className="h-36 w-full rounded-2xl overflow-hidden relative shadow-sm">
                  <img
                    src={viewingDestination.image}
                    alt={modalName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-black text-white shadow">
                    +{viewingDestination.pointsReward} CB
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {modalName}
                  </h4>
                  <p className="text-[11px] font-medium text-emerald-800 mt-0.5">
                    {modalTitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600">{modalDesc}</p>

                <div className="rounded-2xl bg-emerald-50/80 p-3 border border-emerald-100 space-y-1.5">
                  <p className="text-[11px] font-bold text-[#1E4D3E]">
                    🌿 {modalBadge}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    • {formatText(t.home.earnRewardNote, { points: viewingDestination.pointsReward })}
                  </p>
                  {viewingDestination.priceEstimate && (
                    <p className="text-[11px] text-slate-700">
                      • {t.home.priceEstimateLabel}{' '}
                      <strong>{viewingDestination.priceEstimate}</strong>
                    </p>
                  )}
                </div>

                {viewingDestination.address && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <MapPin size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-600">{t.home.addressLabel}</strong>{' '}
                      {viewingDestination.address}
                    </span>
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
                    {formatText(t.home.bookAndEarnBtn, { points: viewingDestination.pointsReward })}
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
                  <span>{t.home.openGoogleMaps}</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
