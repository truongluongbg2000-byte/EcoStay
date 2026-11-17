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

interface TabRewardsProps {
  userPoints: number;
  rewards: RewardItem[];
  vouchers: Voucher[];
  currentLang?: 'vi' | 'en';
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
  const isEn = currentLang === 'en';
  const [activeSubTab, setActiveSubTab] = useState<'store' | 'cart'>('store');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedRegion, setSelectedRegion] = useState('Miền Bắc');
  const [confirmReward, setConfirmReward] = useState<RewardItem | null>(null);
  const [insufficientReward, setInsufficientReward] = useState<RewardItem | null>(null);

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả', icon: '🌿' },
    { id: 'tree', label: 'Trồng cây', icon: '🌲' },
    { id: 'food', label: 'Ẩm thực', icon: '🥗' },
    { id: 'fashion', label: 'Thời trang', icon: '👜' },
    { id: 'hotdeal', label: 'Hot deal', icon: '🔥' },
    { id: 'service', label: 'Dịch vụ', icon: '💆' },
    { id: 'other', label: 'Khác', icon: '🎁' },
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
      // Auto switch to cart to show the newly added item
      setActiveSubTab('cart');
    }
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Subtab Switcher: [ Kho đổi quà ] vs [ Giỏ hàng xanh ] */}
      <div className="flex rounded-2xl bg-emerald-100/60 p-1">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeSubTab === 'store'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isEn ? '🎁 Rewards Store' : '🎁 Kho đổi quà'}
        </button>
        <button
          onClick={() => setActiveSubTab('cart')}
          className={`relative flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'cart'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{isEn ? '🛒 Green Cart' : '🛒 Giỏ hàng xanh'}</span>
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
                <span>Kho quà sinh thái EcoStay</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm font-bold text-slate-800">Khu vực:</span>
                <div className="relative inline-block">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none rounded-xl bg-emerald-100/70 px-2.5 py-1 pr-6 text-xs font-bold text-[#1E4D3E] focus:outline-none cursor-pointer"
                  >
                    <option value="Miền Bắc">Miền Bắc (Ninh Bình - Cúc Phương)</option>
                    <option value="Miền Trung">Miền Trung (Quảng Nam - Hội An)</option>
                    <option value="Miền Nam">Miền Nam (Nam Cát Tiên - Côn Đảo)</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Current Balance */}
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Số dư hiện tại</p>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-[#1E4D3E] border border-emerald-200">
                <Sparkles size={12} className="text-amber-500" />
                <span>{userPoints} CP</span>
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
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Rewards List */}
          <div className="space-y-3.5">
            {filteredRewards.map((reward) => {
              const canAfford = userPoints >= reward.points;
              return (
                <div
                  key={reward.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm border border-emerald-950/5 hover:shadow-md transition-all"
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <span className="rounded-full bg-[#1E4D3E]/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        {reward.categoryName}
                      </span>
                      {reward.badge && (
                        <span className="rounded-full bg-[#D97736] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                          {reward.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                      Trị giá: {reward.originalPriceVnd.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{reward.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1 text-emerald-800 font-medium">
                        <Building2 size={12} />
                        {reward.partner}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {reward.location}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-slate-400">Yêu cầu:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-[#1E4D3E]">{reward.points}</span>
                          <span className="text-xs font-bold text-emerald-600">CP</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeemClick(reward)}
                        className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                          canAfford
                            ? 'bg-[#1E4D3E] text-white hover:bg-[#16392E]'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <Sparkles size={14} className={canAfford ? 'text-amber-300' : 'text-emerald-600'} />
                        <span>{canAfford ? 'Đổi quà ngay' : 'Chưa đủ điểm'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Subtab 2: GIỎ HÀNG XANH */
        <div className="space-y-3.5">
          <div className="rounded-2xl bg-emerald-50/80 p-3 border border-emerald-200/60">
            <h4 className="text-xs font-bold text-[#1E4D3E] flex items-center gap-1.5">
              <ShoppingBag size={15} />
              <span>Vật phẩm & Voucher đã đổi</span>
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Xuất trình mã QR/Barcode trong từng voucher cho nhân viên khách sạn hoặc nhà hàng để áp dụng.
            </p>
          </div>

          {activeVouchers.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
              <Ticket size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-600">Giỏ hàng xanh đang trống</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Bạn chưa dùng điểm carbon để đổi voucher hoặc vật phẩm nào.
              </p>
              <button
                onClick={() => setActiveSubTab('store')}
                className="mt-4 rounded-2xl bg-[#1E4D3E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#16392E]"
              >
                Khám phá kho đổi quà
              </button>
            </div>
          ) : (
            activeVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="relative overflow-hidden rounded-3xl bg-white shadow-md border border-emerald-950/5 transition-all hover:shadow-lg"
              >
                {/* Visual Ticket Cut-outs */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-r border-slate-200 z-10" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-l border-slate-200 z-10" />

                <div className="flex">
                  <div className="relative w-28 shrink-0 overflow-hidden bg-emerald-900">
                    <img
                      src={voucher.image}
                      alt={voucher.title}
                      className="h-full w-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[9px] font-bold text-emerald-200 uppercase">
                        {voucher.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 pl-4 text-left flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-extrabold text-[#1E4D3E] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {voucher.code}
                        </span>
                        <span className="text-[10px] text-slate-400">-{voucher.pointsUsed} CP</span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {voucher.title}
                      </h4>
                      <p className="mt-1 text-[10px] text-slate-500 line-clamp-1 flex items-center gap-1">
                        <Building2 size={11} />
                        {voucher.partner}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar size={11} />
                        Hạn: {voucher.expiryDate}
                      </span>
                      <button
                        onClick={() => onSelectVoucher(voucher)}
                        className="flex items-center gap-1 rounded-xl bg-[#1E4D3E] px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-[#16392E] active:scale-95 transition-all"
                      >
                        <QrCode size={12} />
                        <span>Sử dụng ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Confirm Redeem */}
      {confirmReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#1E4D3E]">
              <TreePine size={28} />
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-800">Xác nhận đổi quà</h3>
            <p className="mt-1 text-xs text-slate-600">
              Bạn có chắc muốn dùng <strong className="text-emerald-700">{confirmReward.points} Điểm CP</strong> để đổi:
            </p>

            <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3 text-left border border-emerald-100">
              <p className="text-xs font-bold text-emerald-950">{confirmReward.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Đối tác: {confirmReward.partner}</p>
              {confirmReward.treeDetails && (
                <div className="mt-2 text-[10px] text-emerald-800 bg-white/80 p-2 rounded-xl">
                  🌲 <strong>Cây trồng:</strong> {confirmReward.treeDetails.treeType} tại {confirmReward.treeDetails.forestName}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmReward(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white shadow hover:bg-[#16392E]"
              >
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Insufficient Points */}
      {insufficientReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertCircle size={28} />
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-800">Chưa đủ điểm tích lũy</h3>
            <p className="mt-1 text-xs text-slate-600">
              Phần quà này cần <strong>{insufficientReward.points} Điểm CP</strong>, bạn hiện có <strong>{userPoints} Điểm CP</strong> (còn thiếu {insufficientReward.points - userPoints} CP).
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setInsufficientReward(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Để sau
              </button>
              <button
                onClick={() => {
                  setInsufficientReward(null);
                  onNavigateToEarn();
                }}
                className="flex-1 rounded-2xl bg-[#D97736] py-2.5 text-xs font-bold text-white shadow hover:bg-[#C26D45]"
              >
                Làm nhiệm vụ xanh ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
