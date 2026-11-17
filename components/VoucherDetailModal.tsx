'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Sparkles, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { Voucher } from '@/data/types';

interface VoucherDetailModalProps {
  voucher: Voucher | null;
  onClose: () => void;
  onMarkUsed?: (voucherId: string) => void;
  currentLang?: 'vi' | 'en';
}

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  voucher,
  onClose,
  onMarkUsed,
  currentLang = 'vi',
}) => {
  const [copied, setCopied] = useState(false);
  const isEn = currentLang === 'en';

  if (!voucher) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors"
          aria-label={isEn ? 'Close' : 'Đóng'}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles size={12} className="text-emerald-600" />
            {voucher.category}
          </span>
          <h3 className="mt-2 text-base font-bold text-slate-800 leading-snug">{voucher.title}</h3>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Building2 size={13} />
            <span>
              {isEn ? 'Partner:' : 'Đối tác:'} {voucher.partner}
            </span>
          </div>
        </div>

        {/* Voucher Digital Ticket */}
        <div className="mt-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-gradient-to-b from-emerald-50/70 to-white p-4 text-center">
          <p className="text-xs font-medium text-slate-500">
            {isEn ? 'Your Eco Voucher Code' : 'Mã ưu đãi của bạn'}
          </p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-mono text-xl font-extrabold tracking-widest text-[#1E4D3E]">
              {voucher.code}
            </span>
            <button
              onClick={handleCopyCode}
              className="rounded-lg bg-emerald-100 p-1.5 text-emerald-800 hover:bg-emerald-200 transition-colors"
              title={isEn ? 'Copy Code' : 'Sao chép mã'}
            >
              {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Barcode Graphic Simulation */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex h-12 w-48 items-center justify-between px-2 bg-white rounded border border-slate-200">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 2, 3, 2, 1, 3, 2, 4, 1].map((w, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 h-10"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-slate-400">
              * {voucher.code} *
            </p>
          </div>

          {/* QR Code Graphic Simulation */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2 shadow-inner border border-slate-200">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* Corner markers */}
                <rect x="5" y="5" width="25" height="25" fill="#1E4D3E" rx="2" />
                <rect x="9" y="9" width="17" height="17" fill="white" rx="1" />
                <rect x="13" y="13" width="9" height="9" fill="#1E4D3E" />

                <rect x="70" y="5" width="25" height="25" fill="#1E4D3E" rx="2" />
                <rect x="74" y="9" width="17" height="17" fill="white" rx="1" />
                <rect x="78" y="13" width="9" height="9" fill="#1E4D3E" />

                <rect x="5" y="70" width="25" height="25" fill="#1E4D3E" rx="2" />
                <rect x="9" y="74" width="17" height="17" fill="white" rx="1" />
                <rect x="13" y="78" width="9" height="9" fill="#1E4D3E" />

                {/* Random Pattern Matrix */}
                <rect x="36" y="8" width="8" height="6" fill="#1E4D3E" />
                <rect x="50" y="8" width="12" height="6" fill="#1E4D3E" />
                <rect x="36" y="20" width="6" height="10" fill="#1E4D3E" />
                <rect x="48" y="22" width="14" height="6" fill="#1E4D3E" />
                <rect x="10" y="38" width="14" height="6" fill="#1E4D3E" />
                <rect x="30" y="38" width="8" height="8" fill="#1E4D3E" />
                <rect x="45" y="36" width="12" height="12" fill="#1E4D3E" />
                <rect x="65" y="38" width="10" height="6" fill="#1E4D3E" />
                <rect x="80" y="40" width="12" height="8" fill="#1E4D3E" />
                <rect x="36" y="55" width="10" height="8" fill="#1E4D3E" />
                <rect x="52" y="55" width="14" height="8" fill="#1E4D3E" />
                <rect x="72" y="55" width="8" height="12" fill="#1E4D3E" />
                <rect x="36" y="72" width="8" height="18" fill="#1E4D3E" />
                <rect x="50" y="75" width="16" height="6" fill="#1E4D3E" />
                <rect x="72" y="75" width="18" height="14" fill="#1E4D3E" />
                <rect x="52" y="86" width="12" height="8" fill="#1E4D3E" />
              </svg>
            </div>
            <p className="mt-1 text-[11px] font-medium text-emerald-800">
              {isEn ? 'Scan at counter to redeem' : 'Quét mã tại quầy để áp dụng'}
            </p>
          </div>

          {/* Details */}
          <div className="mt-3 flex items-center justify-between border-t border-emerald-200/60 pt-2.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {isEn ? 'Expires:' : 'Hạn dùng:'}
            </span>
            <span className="font-semibold text-slate-800">{voucher.expiryDate}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-left text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>{isEn ? 'Usage Instructions:' : 'Hướng dẫn sử dụng:'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {isEn
              ? 'Present this code to hotel front desk, housekeeping or dining cashier before payment. Each voucher is single-use only.'
              : 'Xuất trình mã này cho nhân viên lễ tân, buồng phòng hoặc quầy thu ngân nhà hàng trước khi thanh toán. Mỗi mã chỉ có giá trị sử dụng một lần.'}
          </p>
        </div>

        {/* Action button */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-[#1E4D3E] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#16392E] transition-colors"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
          {onMarkUsed && !voucher.isUsed && (
            <button
              onClick={() => {
                onMarkUsed(voucher.id);
                onClose();
              }}
              className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isEn ? 'Mark as Used' : 'Đã dùng'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
