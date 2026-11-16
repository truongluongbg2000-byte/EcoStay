'use client';

import React from 'react';
import { X, Bell, Sparkles, CheckCircle2, Gift } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Cộng 50 CACBON POINT',
      desc: 'Bạn đã hoàn thành cam kết không dọn phòng ngày hôm nay tại phòng Suite Eco-402.',
      time: '10 phút trước',
      icon: <Sparkles className="text-emerald-600" size={16} />,
      unread: true,
    },
    {
      id: 2,
      title: 'Chào mừng bạn đến với EcoStay!',
      desc: 'Tài khoản CACBON POINT của bạn đã sẵn sàng với 54 điểm khởi tạo.',
      time: 'Hôm qua',
      icon: <CheckCircle2 className="text-emerald-600" size={16} />,
      unread: false,
    },
    {
      id: 3,
      title: 'Sự kiện: Ngày hội Xanh cuối tuần',
      desc: 'Nhân đôi điểm thưởng khi sử dụng dịch vụ xe đạp hoặc xe điện nội khu.',
      time: '2 ngày trước',
      icon: <Gift className="text-amber-600" size={16} />,
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Bell size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Thông báo</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 divide-y divide-slate-100 overflow-y-auto space-y-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`pt-2 flex items-start gap-3 rounded-2xl p-2.5 transition-colors ${
                item.unread ? 'bg-emerald-50/60' : 'bg-transparent'
              }`}
            >
              <div className="mt-0.5 rounded-full bg-white p-2 shadow-sm border border-slate-100">
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#16392E]"
        >
          Đã đọc tất cả
        </button>
      </div>
    </div>
  );
};
