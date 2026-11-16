'use client';

import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  Building2,
  QrCode,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { Voucher, UserProfile } from '@/data/types';
import { TabId } from './BottomNav';

interface TabVoucherProps {
  user: UserProfile;
  vouchers: Voucher[];
  onSelectVoucher: (voucher: Voucher) => void;
  onNavigate: (tab: TabId) => void;
}

export const TabVoucher: React.FC<TabVoucherProps> = ({
  user,
  vouchers,
  onSelectVoucher,
  onNavigate,
}) => {
  const [pointType, setPointType] = useState<'cacbon' | 'avn'>('cacbon');
  const [subTab, setSubTab] = useState<'my_vouchers' | 'redeem_more'>('my_vouchers');

  const activeVouchers = vouchers.filter((v) => !v.isUsed);
  const usedVouchers = vouchers.filter((v) => v.isUsed);

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Header & Main Point Switcher (AVN Point vs CACBON POINT) */}
      <div className="flex rounded-2xl bg-emerald-100/60 p-1">
        <button
          onClick={() => setPointType('avn')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            pointType === 'avn'
              ? 'bg-white text-[#1E4D3E] shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          AVN Point ({user.avnPoints})
        </button>
        <button
          onClick={() => setPointType('cacbon')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            pointType === 'cacbon'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          CACBON POINT ({user.carbonPoints})
        </button>
      </div>

      {/* 2. Sub-tab Switcher (Đổi điểm vs Voucher của bạn) */}
      <div className="flex border-b border-emerald-950/10">
        <button
          onClick={() => setSubTab('redeem_more')}
          className={`relative pb-2.5 text-xs font-bold transition-colors flex-1 text-center ${
            subTab === 'redeem_more'
              ? 'text-[#1E4D3E]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Đổi điểm voucher/coupon
          {subTab === 'redeem_more' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E4D3E] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSubTab('my_vouchers')}
          className={`relative pb-2.5 text-xs font-bold transition-colors flex-1 text-center ${
            subTab === 'my_vouchers'
              ? 'text-[#1E4D3E]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Voucher/Coupon của bạn ({activeVouchers.length})
          {subTab === 'my_vouchers' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E4D3E] rounded-full" />
          )}
        </button>
      </div>

      {/* 3. Point Status Notification Banner (Matching original docx design) */}
      <div className="rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200/60 text-center">
        <p className="text-xs font-medium text-slate-700">
          Bạn có <strong className="text-[#1E4D3E] text-sm">{user.carbonPoints} điểm CACBON POINT</strong>.
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Trong đó, {user.carbonPoints} điểm sẽ hết hạn vào ngày <strong>{user.expiryDate}</strong>. Hãy đổi voucher ngay nhé!
        </p>
      </div>

      {/* 4. Subtab Content */}
      {subTab === 'my_vouchers' ? (
        <div className="space-y-3.5">
          {activeVouchers.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center border border-slate-100">
              <Ticket size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-medium text-slate-600">Bạn chưa có voucher nào</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hãy dùng điểm CACBON POINT để đổi ưu đãi ẩm thực, spa hoặc trồng cây.
              </p>
              <button
                onClick={() => onNavigate('rewards')}
                className="mt-4 rounded-2xl bg-[#1E4D3E] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#16392E]"
              >
                Khám phá kho quà
              </button>
            </div>
          ) : (
            activeVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="relative overflow-hidden rounded-3xl bg-white shadow-md border border-emerald-950/5 transition-all hover:shadow-lg"
              >
                {/* Visual Ticket Notches */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-r border-slate-200 z-10" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#F8FAF8] border-l border-slate-200 z-10" />

                <div className="flex">
                  {/* Left voucher thumbnail */}
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

                  {/* Right voucher info */}
                  <div className="flex-1 p-3.5 pl-4 text-left flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-extrabold text-[#1E4D3E] bg-emerald-50 px-2 py-0.5 rounded-md">
                          {voucher.code}
                        </span>
                        <span className="text-[10px] text-slate-400">-{voucher.pointsUsed} CB</span>
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
                        <span>Sử dụng</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Used vouchers section if any */}
          {usedVouchers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h5 className="text-xs font-bold text-slate-400 mb-2">Đã sử dụng ({usedVouchers.length})</h5>
              {usedVouchers.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl bg-slate-100 p-3 opacity-60 flex items-center justify-between mb-2 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{v.title}</p>
                    <p className="text-[10px] text-slate-400">Mã: {v.code}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    Đã áp dụng
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Tab: Đổi điểm voucher */
        <div className="space-y-3">
          <div className="rounded-3xl bg-gradient-to-br from-[#1E4D3E] to-[#2D6A56] p-4 text-white">
            <h4 className="text-sm font-bold">Quy đổi điểm CACBON POINT lấy Voucher</h4>
            <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">
              Mỗi 100 điểm = 100.000đ voucher dịch vụ tại hệ sinh thái đối tác EcoStay, nhà hàng hữu cơ và các dự án bảo tồn.
            </p>
            <button
              onClick={() => onNavigate('rewards')}
              className="mt-3 flex items-center gap-1 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-[#1E4D3E] shadow hover:bg-emerald-50 transition-colors"
            >
              <span>Vào Cửa Hàng Quà Tặng</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-emerald-950/5">
            <h5 className="text-xs font-bold text-slate-800 mb-2">Gợi ý đổi nhanh:</h5>
            <div className="space-y-2 text-xs">
              <div
                onClick={() => onNavigate('rewards')}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-emerald-700" />
                  <span>Voucher Nước ép Organic (120 CB)</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </div>

              <div
                onClick={() => onNavigate('rewards')}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-emerald-700" />
                  <span>Voucher Spa Giảm 30% (350 CB)</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </div>

              <div
                onClick={() => onNavigate('rewards')}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-emerald-700" />
                  <span>Trồng 1 cây bách xanh Cúc Phương (600 CB)</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
