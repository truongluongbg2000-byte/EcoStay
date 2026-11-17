'use client';

import React, { useState } from 'react';
import {
  Footprints,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  Bike,
  Compass,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Share2,
  Star,
  Users
} from 'lucide-react';
import { DetailedMission, UserProfile } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabEarnPointsProps {
  user: UserProfile;
  missions: DetailedMission[];
  onCompleteMission: (missionId: string) => void;
  onNavigateToScanner: () => void;
  onOpenEcoImpact: () => void;
}

export const TabEarnPoints: React.FC<TabEarnPointsProps> = ({
  user,
  missions,
  onCompleteMission,
  onNavigateToScanner,
  onOpenEcoImpact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả', icon: <Footprints size={15} /> },
    { id: 'room', label: 'Trong phòng', icon: <BedDouble size={15} /> },
    { id: 'food', label: 'Ăn uống', icon: <UtensilsCrossed size={15} /> },
    { id: 'transport', label: 'Di chuyển', icon: <Bike size={15} /> },
    { id: 'experience', label: 'Trải nghiệm', icon: <Compass size={15} /> },
    { id: 'app', label: 'Tương tác app', icon: <Smartphone size={15} /> },
  ];

  const filteredMissions = missions.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return <BedDouble size={18} className="text-emerald-700" />;
      case 'food':
        return <UtensilsCrossed size={18} className="text-emerald-700" />;
      case 'transport':
        return <Bike size={18} className="text-emerald-700" />;
      case 'experience':
        return <Compass size={18} className="text-emerald-700" />;
      case 'app':
        return <Smartphone size={18} className="text-emerald-700" />;
      default:
        return <Footprints size={18} className="text-emerald-700" />;
    }
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1E4D3E] via-[#245D4B] to-[#16392E] p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-emerald-300">
              <Footprints size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nhiệm Vụ Tích Điểm</h3>
              <p className="text-[10px] text-emerald-200">Thực hành hành vi xanh để nhận CACBON POINT</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-200">Đã xong:</span>
            <p className="text-xs font-extrabold text-amber-300">{completedCount}/{missions.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / missions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Category Filter Pills */}
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

      {/* 3. Detailed Mission List by Category */}
      <div className="space-y-2.5">
        {filteredMissions.map((item) => {
          const isDone = item.completed;
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/70'
                  : 'border-slate-100 bg-white shadow-sm hover:border-emerald-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                        {item.categoryName}
                      </span>
                      {item.isPenalty && (
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 flex items-center gap-0.5">
                          <AlertTriangle size={9} />
                          Lưu ý lãng phí
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>

                    {item.subtitle && (
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right action button */}
                <div className="shrink-0 text-right">
                  <span className="block text-xs font-extrabold text-[#1E4D3E] mb-1">
                    +{item.points} CP
                  </span>

                  {item.actionType === 'toggle' ? (
                    <button
                      onClick={() => onCompleteMission(item.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDone ? 'bg-[#1E4D3E]' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={isDone}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isDone ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : item.actionType === 'qr' ? (
                    <button
                      onClick={onNavigateToScanner}
                      className="flex items-center gap-1 rounded-xl bg-[#1E4D3E] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#16392E] active:scale-95 transition-all"
                    >
                      <QrCode size={12} />
                      <span>Quét mã</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onCompleteMission(item.id)}
                      disabled={isDone}
                      className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all shadow-sm active:scale-95 ${
                        isDone
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#D97736] text-white hover:bg-[#C26D45]'
                      }`}
                    >
                      {isDone ? 'Đã xong ✓' : 'Thực hiện'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
