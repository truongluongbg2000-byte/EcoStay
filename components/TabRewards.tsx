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
  Gift
} from 'lucide-react';
import { RewardItem, CategoryType } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabRewardsProps {
  userPoints: number;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => void;
  onNavigateToScanner: () => void;
}

export const TabRewards: React.FC<TabRewardsProps> = ({
  userPoints,
  rewards,
  onRedeemReward,
  onNavigateToScanner,
}) => {
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
    }
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-6 text-left">
      {/* 1. Header with Region Dropdown */}
      <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <Gift size={16} />
            <span>Kho quà sinh thái EcoStay</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-base font-bold text-slate-800">Khu vực:</span>
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

        {/* User Balance Reminder */}
        <div className="text-right">
          <p className="text-[10px] text-slate-400">Số dư hiện tại</p>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-[#1E4D3E] border border-emerald-200">
            <Sparkles size={12} className="text-amber-500" />
            <span>{userPoints} CB</span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
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

      {/* 3. Rewards Grid/List */}
      <div className="space-y-3.5">
        {filteredRewards.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
            <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">Chưa có quà tặng trong danh mục này</p>
          </div>
        ) : (
          filteredRewards.map((reward) => {
            const canAfford = userPoints >= reward.points;
            return (
              <div
                key={reward.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm border border-emerald-950/5 transition-all hover:shadow-md"
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
                    Giá gốc: {reward.originalPriceVnd.toLocaleString('vi-VN')}đ
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{reward.title}</h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {reward.description}
                  </p>

                  {/* Partner & Location */}
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

                  {/* Action Bar */}
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-slate-400">Yêu cầu:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-[#1E4D3E]">{reward.points}</span>
                        <span className="text-xs font-bold text-emerald-600">Điểm CB</span>
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
          })
        )}
      </div>

      {/* Modal Confirm Redeem */}
      {confirmReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#1E4D3E]">
              <TreePine size={28} />
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-800">Xác nhận đổi quà</h3>
            <p className="mt-1 text-xs text-slate-600">
              Bạn có chắc muốn dùng <strong className="text-emerald-700">{confirmReward.points} Điểm CB</strong> để đổi lấy:
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

            <p className="mt-2 text-[11px] text-slate-400">
              Số dư còn lại sau khi đổi: <strong>{userPoints - confirmReward.points} Điểm CB</strong>
            </p>

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
              Món quà này cần <strong>{insufficientReward.points} Điểm CB</strong>, bạn hiện có <strong>{userPoints} Điểm CB</strong> (còn thiếu {insufficientReward.points - userPoints} điểm).
            </p>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-left border border-emerald-100 text-xs text-emerald-900">
              💡 <strong>Mẹo nhận điểm nhanh:</strong>
              <ul className="mt-1 list-disc pl-4 space-y-1 text-[11px]">
                <li>Gạt tắt dọn phòng hôm nay: +50 CB</li>
                <li>Ăn sạch đĩa (Zero Food Waste): +30 CB</li>
                <li>Đi bộ 5.000 bước khám phá resort: +20 CB</li>
              </ul>
            </div>

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
                  onNavigateToScanner();
                }}
                className="flex-1 rounded-2xl bg-[#D97736] py-2.5 text-xs font-bold text-white shadow hover:bg-[#C26D45]"
              >
                Làm nhiệm vụ ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
