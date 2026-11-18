'use client';

import React, { useState } from 'react';
import { X, History, TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react';
import { ImpactLog, Voucher } from '@/data/types';
import { getDictionary, Lang } from '@/lib/i18n';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ImpactLog[];
  vouchers: Voucher[];
  initialTab?: 'points' | 'orders';
  currentLang?: Lang;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  logs,
  vouchers,
  initialTab = 'points',
  currentLang = 'vi',
}) => {
  const [activeTab, setActiveTab] = useState<'points' | 'orders'>(initialTab);
  const t = getDictionary(currentLang);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <History size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {t.modals.history.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
            aria-label={t.common.close}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-3 flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              activeTab === 'points'
                ? 'bg-white text-[#1E4D3E] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.modals.history.pointsTab} ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-[#1E4D3E] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.modals.history.ordersTab} ({vouchers.length})
          </button>
        </div>

        {/* Content list */}
        <div className="mt-3 flex-1 overflow-y-auto divide-y divide-slate-100 space-y-2">
          {activeTab === 'points' ? (
            logs.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                {t.modals.history.emptyPoints}
              </p>
            ) : (
              logs.map((item) => {
                const displayDate =
                  item.date === 'Vừa xong' || item.date === 'Just now'
                    ? t.common.justNow
                    : item.date;

                return (
                  <div key={item.id} className="pt-2 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          item.type === 'earn'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.type === 'earn' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{displayDate}</p>
                        {item.detail && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.detail}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span
                        className={`text-xs font-extrabold ${
                          item.type === 'earn' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {item.type === 'earn' ? `+${item.points}` : item.points} CB
                      </span>
                    </div>
                  </div>
                );
              })
            )
          ) : vouchers.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">
              {t.modals.history.emptyOrders}
            </p>
          ) : (
            vouchers.map((v) => {
              const vTrans = t.data.rewards[v.rewardId];
              const displayTitle = vTrans?.title || v.title;

              return (
                <div key={v.id} className="pt-2 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <ShoppingBag size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{displayTitle}</p>
                      <p className="text-[10px] text-slate-400">
                        {v.code} • {v.issueDate} •{' '}
                        {v.isUsed ? t.modals.history.statusUsed : t.modals.history.statusUnused}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[11px] font-semibold text-slate-700">
                      -{v.pointsUsed} CB
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E]"
        >
          {t.common.close}
        </button>
      </div>
    </div>
  );
};
