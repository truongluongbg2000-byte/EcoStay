'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  Gift,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { AppNotification } from '@/data/types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  currentLang?: 'vi' | 'en';
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  currentLang = 'vi',
}) => {
  const isEn = currentLang === 'en';
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const [showConfirmReadAll, setShowConfirmReadAll] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedNotifId(null);
      setShowConfirmReadAll(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const selectedNotif = selectedNotifId
    ? notifications.find((n) => n.id === selectedNotifId) || null
    : null;

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'points':
        return <Sparkles className="text-emerald-600" size={16} />;
      case 'event':
        return <Gift className="text-amber-600" size={16} />;
      case 'reward':
        return <Gift className="text-emerald-600" size={16} />;
      default:
        return <CheckCircle2 className="text-emerald-600" size={16} />;
    }
  };

  const handleOpenNotification = (item: AppNotification) => {
    if (!item.isRead) {
      onMarkRead(item.id);
    }
    setShowConfirmReadAll(false);
    setSelectedNotifId(item.id);
  };

  const handleConfirmReadAll = () => {
    onMarkAllRead();
    setShowConfirmReadAll(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[86vh] flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            {selectedNotif ? (
              <button
                type="button"
                onClick={() => setSelectedNotifId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#1E4D3E] hover:bg-emerald-100 transition-colors"
                aria-label={isEn ? 'Back' : 'Quay lại'}
              >
                <ChevronLeft size={18} />
              </button>
            ) : (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedNotif
                  ? isEn
                    ? 'Notification Details'
                    : 'Chi tiết thông báo'
                  : isEn
                  ? 'Notifications'
                  : 'Thông báo'}
              </h3>
              {!selectedNotif && (
                <p className="text-[10px] font-semibold text-slate-500">
                  {unreadCount > 0
                    ? isEn
                      ? `${unreadCount} unread`
                      : `${unreadCount} thông báo chưa đọc`
                    : isEn
                    ? 'All caught up'
                    : 'Bạn đã đọc tất cả thông báo'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!selectedNotif && unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirmReadAll((prev) => !prev)}
                className="flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-[10px] font-bold text-[#1E4D3E] hover:bg-emerald-100 transition-colors"
              >
                <CheckCheck size={13} />
                <span>{isEn ? 'Read all' : 'Đọc tất cả'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
              aria-label={isEn ? 'Close' : 'Đóng'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Confirmation Bar for "Đọc tất cả" */}
        {!selectedNotif && showConfirmReadAll && unreadCount > 0 && (
          <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 animate-fadeIn">
            <p className="text-xs font-bold text-[#1E4D3E]">
              {isEn
                ? 'Mark all notifications as read?'
                : 'Xác nhận đánh dấu đã đọc tất cả thông báo?'}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-600">
              {isEn
                ? 'The unread red badge will be cleared after confirming.'
                : 'Chấm đỏ chưa đọc trên biểu tượng chuông sẽ tự động biến mất.'}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmReadAll}
                className="flex-1 rounded-xl bg-[#1E4D3E] py-1.5 text-[11px] font-bold text-white hover:bg-[#16392E] transition-colors"
              >
                {isEn ? 'Confirm' : 'Xác nhận'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReadAll(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
            </div>
          </div>
        )}

        {/* Body: Either Full Notification Detail OR List */}
        {selectedNotif ? (
          <div className="mt-3 flex-1 overflow-y-auto animate-fadeIn space-y-3">
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-emerald-100 shadow-2xs">
                  {getCategoryIcon(selectedNotif.category)}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 border border-slate-200/70">
                  <Clock size={11} />
                  <span>{isEn ? selectedNotif.timeEn : selectedNotif.time}</span>
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {isEn ? selectedNotif.titleEn : selectedNotif.title}
              </h4>

              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {isEn ? selectedNotif.detailEn : selectedNotif.detail}
              </p>

              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
                <CheckCheck size={13} />
                <span>{isEn ? 'Marked as read' : 'Đã đánh dấu là đã đọc'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNotifId(null)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-white py-2.5 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-50 transition-colors"
            >
              <ChevronLeft size={15} />
              <span>{isEn ? 'Back to all notifications' : 'Quay lại danh sách thông báo'}</span>
            </button>
          </div>
        ) : (
          <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-0.5">
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOpenNotification(item)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all active:scale-98 ${
                  !item.isRead
                    ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-50'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80">
                  {getCategoryIcon(item.category)}
                  {!item.isRead && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-xs leading-snug ${
                        !item.isRead
                          ? 'font-extrabold text-slate-900'
                          : 'font-semibold text-slate-700'
                      }`}
                    >
                      {isEn ? item.titleEn : item.title}
                    </h4>
                    <ChevronRight size={14} className="text-slate-300 shrink-0 mt-0.5" />
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {isEn ? item.descEn : item.desc}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">
                      {isEn ? item.timeEn : item.time}
                    </span>
                    <span
                      className={`font-semibold ${
                        !item.isRead ? 'text-rose-500' : 'text-emerald-700'
                      }`}
                    >
                      {!item.isRead
                        ? isEn
                          ? 'Tap to read'
                          : 'Chạm để đọc'
                        : isEn
                        ? 'Read ✓'
                        : 'Đã đọc ✓'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E] transition-colors"
        >
          {isEn ? 'Close' : 'Đóng'}
        </button>
      </div>
    </div>
  );
};
