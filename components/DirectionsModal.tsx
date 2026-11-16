'use client';

import React from 'react';
import { X, MapPin, Navigation, Car, Bus, Bike } from 'lucide-react';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Đường tới EcoStay</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mock Map Image */}
        <div className="mt-4 relative h-40 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
            alt="EcoStay Map"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-[#1E4D3E] px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-bounce">
              <MapPin size={14} className="text-emerald-300" />
              <span>EcoStay Ninh Bình</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-4 text-left">
          <h4 className="text-xs font-bold text-slate-800">Địa chỉ khu nghỉ dưỡng:</h4>
          <p className="mt-1 text-xs text-slate-600">
            Thung Nham, Xã Ninh Hải, Huyện Hoa Lư, Tỉnh Ninh Bình (Cửa ngõ Vườn Quốc Gia Cúc Phương).
          </p>
        </div>

        {/* Green Transport Options */}
        <div className="mt-4 space-y-2.5 text-left">
          <p className="text-xs font-bold text-[#1E4D3E]">Phương tiện di chuyển xanh ưu tiên:</p>
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Car size={16} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Xe điện Xanh SM / VinFast</p>
              <p className="text-[11px] text-slate-500">Giảm 15% cước khi nhập mã ECOSTAY trên app Xanh SM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Bus size={16} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Xe buýt điện Eco-Shuttle Bus</p>
              <p className="text-[11px] text-slate-500">Đón khách miễn phí từ Ga Ninh Bình mỗi 2 tiếng</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Bike size={16} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">Xe đạp công cộng TNGo</p>
              <p className="text-[11px] text-slate-500">Có trạm khóa xe ngay trước cổng vào resort</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E4D3E] py-3 text-xs font-semibold text-white shadow-md hover:bg-[#16392E]"
        >
          <Navigation size={14} />
          Mở chỉ đường trên Google Maps
        </button>
      </div>
    </div>
  );
};
