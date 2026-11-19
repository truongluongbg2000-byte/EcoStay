'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  MapPin,
  TreePine,
  Check,
  AlertCircle,
  Building2,
  ChevronDown,
  Gift,
  Ticket,
  Calendar,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { RewardItem, CategoryType, Voucher } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';
import { getDictionary, getLanguageMeta, formatText, Lang } from '@/lib/i18n';

interface TabRewardsProps {
  userPoints: number;
  rewards: RewardItem[];
  vouchers: Voucher[];
  currentLang?: Lang;
  onRedeemReward: (reward: RewardItem) => void;
  onSelectVoucher: (voucher: Voucher) => void;
  onNavigateToEarn: () => void;
}

export const TabRewards: React.FC<TabRewardsProps> = ({
  userPoints,
  rewards,
  vouchers,
  currentLang = 'vi',
  onRedeemReward,
  onSelectVoucher,
  onNavigateToEarn,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'store' | 'cart'>('store');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedRegion, setSelectedRegion] = useState('Miền Bắc');
  const [confirmReward, setConfirmReward] = useState<RewardItem | null>(null);
  const [insufficientReward, setInsufficientReward] = useState<RewardItem | null>(null);

  const t = getDictionary(currentLang);
  const langMeta = getLanguageMeta(currentLang);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: t.rewards.categories.all },
    { id: 'tree', label: t.rewards.categories.tree },
    { id: 'food', label: t.rewards.categories.food },
    { id: 'fashion', label: t.rewards.categories.fashion },
    { id: 'hotdeal', label: t.rewards.categories.hotdeal },
    { id: 'service', label: t.rewards.categories.service },
    { id: 'other', label: t.rewards.categories.other },
  ];

  const filteredRewards = rewards.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const activeVouchers = vouchers.filter((v) => !v.isUsed);

  const handleRedeemClick = (reward: RewardItem) => {
    if (userPoints >= reward.points) {
      setConfirmReward(reward);
    } else {
      setInsufficientReward(reward);
    }
  };

  const handleConfirmRedeem = () => {
    if (confirmReward) {
      triggerEcoConfetti();
      onRedeemReward(confirmReward);
      setConfirmReward(null);
      setActiveSubTab('cart');
    }
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Subtab Switcher */}
      <div className="flex rounded-2xl bg-emerald-100/60 p-1">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeSubTab === 'store'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.rewards.storeTab}
        </button>
        <button
          onClick={() => setActiveSubTab('cart')}
          className={`relative flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'cart'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{t.rewards.cartTab}</span>
          {activeVouchers.length > 0 && (
            <span className="rounded-full bg-[#D97736] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
              {activeVouchers.length}
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'store' ? (
        <>
          {/* Header with Region Dropdown */}
          <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Gift size={15} />
                <span>{t.rewards.storeTab} • EcoStay</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm font-bold text-slate-800">
                  {t.map.regionPrefix}
                </span>
                <div className="relative inline-block">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none rounded-xl bg-emerald-100/70 px-2.5 py-1 pr-6 text-xs font-bold text-[#1E4D3E] focus:outline-none cursor-pointer"
                  >
                    <option value="Miền Bắc">
                      {t.data.locations['Ninh Bình'] || 'Ninh Bình'} - {t.data.locations['Cúc Phương'] || 'Cúc Phương'}
                    </option>
                    <option value="Miền Trung">
                      {t.data.locations['Hội An'] || 'Hội An'} - {t.data.locations['Đà Lạt'] || 'Đà Lạt'}
                    </option>
                    <option value="Miền Nam">
                      {t.data.locations['Nam Cát Tiên'] || 'Nam Cát Tiên'} - {t.data.locations['Sa Pa'] || 'Sa Pa'}
                    </option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Current Balance */}
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-400">
                {t.rewards.availableBalance}
              </p>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-[#1E4D3E] border border-emerald-200">
                <Sparkles size={12} className="text-amber-500" />
                <span>{userPoints} CB</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E4D3E] text-white shadow-emerald-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Rewards List */}
          <div className="space-y-3.5 lg:grid lg:gap-4 lg:space-y-0 lg:items-start lg:grid-cols-2 2xl:grid-cols-3">
            {filteredRewards.map((reward) => {
              const canAfford = userPoints >= reward.points;
              const trans = t.data.rewards[reward.id];
              const displayTitle = trans?.title || reward.title;
              const displayDesc = trans?.desc || reward.description;
              const displayCategory = trans?.categoryName || t.rewards.categories[reward.category] || reward.categoryName;
              const displayPartner = trans?.partner || reward.partner;
              const displayLocation = t.data.locations[reward.location] || reward.location;

              return (
                <div
                  key={reward.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm border border-emerald-950/5 hover:shadow-md transition-all"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={reward.image}
                      alt={displayTitle}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <span className="rounded-full bg-[#1E4D3E]/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        {displayCategory}
                      </span>
                      {reward.badge && (
                        <span className="rounded-full bg-[#D97736] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                          {reward.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                      ≈ {reward.originalPriceVnd.toLocaleString(langMeta.locale)}₫
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{displayTitle}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1 text-emerald-800 font-medium truncate pr-2">
                        <Building2 size={12} className="shrink-0" />
                        <span className="truncate">{displayPartner}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin size={12} />
                        {displayLocation}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-[#1E4D3E]">{reward.points}</span>
                          <span className="text-xs font-bold text-emerald-600">CB</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeemClick(reward)}
                        className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                          canAfford
                            ? 'bg-[#1E4D3E] text-white hover:bg-[#16392E]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Sparkles size={14} className="text-amber-400" />
                            <span>{t.rewards.redeemNow}</span>
                          </>
                        ) : (
                          <span>{t.rewards.insufficientBtn}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* SUBTAB 2: GREEN CART */
        <div className="space-y-3">
          <div className="border-b border-emerald-900/10 pb-2">
            <h3 className="text-base font-bold text-slate-800">
              {t.rewards.cartTab}
            </h3>
            <p className="text-xs text-slate-500">
              {t.rewards.cartEmptyDesc}
            </p>
          </div>

          {activeVouchers.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center border border-slate-100 shadow-sm">
              <ShoppingBag size={40} className="mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">
                {t.rewards.cartEmptyTitle}
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                {t.rewards.cartEmptyDesc}
              </p>
              <button
                onClick={() => setActiveSubTab('store')}
                className="mt-4 rounded-2xl bg-[#1E4D3E] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#16392E]"
              >
                {t.rewards.exploreStoreBtn}
              </button>
            </div>
          ) : (
            activeVouchers.map((voucher) => {
              const vTrans = t.data.rewards[voucher.rewardId];
              const vTitle = vTrans?.title || voucher.title;
              const vCat = vTrans?.categoryName || voucher.category;
              const vPartner = vTrans?.partner || voucher.partner;

              return (
                <div
                  key={voucher.id}
                  className="relative overflow-hidden rounded-3xl bg-white shadow-md border border-emerald-950/5 transition-all hover:shadow-lg"
                >
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-r border-slate-200 z-10" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-l border-slate-200 z-10" />

                  <div className="flex">
                    <div className="relative w-28 shrink-0 overflow-hidden bg-emerald-900">
                      <img
                        src={voucher.image}
                        alt={vTitle}
                        className="h-full w-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[9px] font-bold text-emerald-200 uppercase">
                          {vCat}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-3.5 pl-4 text-left flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-extrabold text-[#1E4D3E] bg-emerald-50 px-2 py-0.5 rounded-md">
                            {voucher.code}
                          </span>
                          <span className="text-[10px] text-slate-400">-{voucher.pointsUsed} CB</span>
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {vTitle}
                        </h4>
                        <p className="mt-1 text-[10px] text-slate-500 line-clamp-1 flex items-center gap-1">
                          <Building2 size={11} />
                          {vPartner}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={11} />
                          {t.rewards.expLabel} {voucher.expiryDate}
                        </span>
                        <button
                          onClick={() => onSelectVoucher(voucher)}
                          className="flex items-center gap-1 rounded-xl bg-[#1E4D3E] px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-[#16392E] active:scale-95 transition-all"
                        >
                          <QrCode size={12} />
                          <span>{t.rewards.useNowBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Confirm Redeem */}
      {confirmReward && (() => {
        const cTrans = t.data.rewards[confirmReward.id];
        const cTitle = cTrans?.title || confirmReward.title;
        const cPartner = cTrans?.partner || confirmReward.partner;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#1E4D3E]">
                <TreePine size={28} />
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-800">
                {t.rewards.confirmTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                {formatText(t.rewards.confirmDesc, {
                  points: confirmReward.points,
                  title: cTitle,
                })}
              </p>

              <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3 text-left border border-emerald-100">
                <p className="text-xs font-bold text-emerald-950">{cTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t.modals.voucherDetail.partnerLabel} {cPartner}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setConfirmReward(null)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="flex-1 rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white shadow hover:bg-[#16392E]"
                >
                  {t.rewards.confirmBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Insufficient Points */}
      {insufficientReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertCircle size={28} />
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-800">
              {t.rewards.insufficientTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              {formatText(t.rewards.insufficientDesc, {
                required: insufficientReward.points,
                current: userPoints,
                missing: insufficientReward.points - userPoints,
              })}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setInsufficientReward(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t.common.close}
              </button>
              <button
                onClick={() => {
                  setInsufficientReward(null);
                  onNavigateToEarn();
                }}
                className="flex-1 rounded-2xl bg-[#D97736] py-2.5 text-xs font-bold text-white shadow hover:bg-[#C26D45]"
              >
                {t.rewards.earnMoreBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
