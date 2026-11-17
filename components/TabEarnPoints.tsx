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
  Check
} from 'lucide-react';
import { DetailedMission, UserProfile } from '@/data/types';
import { missionTranslations } from '@/data/translations';

interface TabEarnPointsProps {
  user: UserProfile;
  missions: DetailedMission[];
  currentLang?: 'vi' | 'en';
  onOpenMissionQR: (mission: DetailedMission) => void;
  onNavigateToScanner: () => void;
  onOpenEcoImpact: () => void;
}

export const TabEarnPoints: React.FC<TabEarnPointsProps> = ({
  user,
  missions,
  currentLang = 'vi',
  onOpenMissionQR,
  onNavigateToScanner,
  onOpenEcoImpact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isEn = currentLang === 'en';

  const categories = [
    { id: 'all', label: isEn ? 'All' : 'Tất cả', icon: <Footprints size={15} /> },
    { id: 'room', label: isEn ? 'In-Room' : 'Trong phòng', icon: <BedDouble size={15} /> },
    { id: 'food', label: isEn ? 'Dining' : 'Ăn uống', icon: <UtensilsCrossed size={15} /> },
    { id: 'transport', label: isEn ? 'Transit' : 'Di chuyển', icon: <Bike size={15} /> },
    { id: 'experience', label: isEn ? 'Eco-Tours' : 'Trải nghiệm', icon: <Compass size={15} /> },
    { id: 'app', label: isEn ? 'App Tasks' : 'Tương tác app', icon: <Smartphone size={15} /> },
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
              <h3 className="text-sm font-bold text-white">
                {isEn ? 'Eco Missions & QR Earn' : 'Nhiệm Vụ Tích Điểm Xanh'}
              </h3>
              <p className="text-[10px] text-emerald-200">
                {isEn
                  ? 'Scan QR to collect EcoStay CARBON POINTS'
                  : 'Quét mã QR tại điểm đối tác để nhận CACBON POINT'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-200">{isEn ? 'Completed:' : 'Đã xong:'}</span>
            <p className="text-xs font-extrabold text-amber-300">
              {completedCount}/{missions.length}
            </p>
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

      {/* 3. Detailed Mission List by Category (100% QR Scan Powered) */}
      <div className="space-y-2.5">
        {filteredMissions.map((item) => {
          const isDone = item.completed;
          const trans = isEn ? missionTranslations[item.id] : null;
          const displayTitle = trans?.title || item.title;
          const displaySubtitle = trans?.subtitle || item.subtitle;
          const displayCategoryName = trans?.categoryName || item.categoryName;
          const displayQrInstruction = trans?.qrInstruction || item.qrInstruction;

          const translatedMissionItem: DetailedMission = {
            ...item,
            title: displayTitle,
            subtitle: displaySubtitle,
            categoryName: displayCategoryName,
            qrInstruction: displayQrInstruction,
          };

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/70 shadow-xs'
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
                        {displayCategoryName}
                      </span>
                      {item.isPenalty && (
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 flex items-center gap-0.5">
                          <AlertTriangle size={9} />
                          {isEn ? 'Penalty warning' : 'Lưu ý lãng phí'}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-slate-900 leading-snug">
                      {displayTitle}
                    </h4>

                    {displaySubtitle && (
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                        {displaySubtitle}
                      </p>
                    )}

                    {displayQrInstruction && (
                      <p className="mt-1 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                        <span>📍</span>
                        <span>{displayQrInstruction}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right action button: 100% QR Scanning */}
                <div className="shrink-0 text-right">
                  <span className="block text-xs font-extrabold text-[#1E4D3E] mb-1.5">
                    +{item.points} CP
                  </span>

                  {isDone ? (
                    <button
                      onClick={() => onOpenMissionQR(translatedMissionItem)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                    >
                      <Check size={12} className="stroke-[3]" />
                      <span>{isEn ? 'Done ✓' : 'Đã quét ✓'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenMissionQR(translatedMissionItem)}
                      className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:from-[#16392E] hover:to-[#225242] active:scale-95 transition-all"
                    >
                      <QrCode size={13} className="text-amber-300" />
                      <span>{isEn ? 'Scan QR' : 'Quét QR'}</span>
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
