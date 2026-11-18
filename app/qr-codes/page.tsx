'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  Download,
  Maximize2,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TreePine,
  BedDouble,
  UtensilsCrossed,
  Bike,
  Compass,
  Smartphone,
  Footprints,
  Copy,
  Check,
} from 'lucide-react';
import { initialMissions } from '@/data/mockData';
import { DetailedMission } from '@/data/types';

export default function QRCodesSheetPage() {
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generate 100% genuine scannable ISO QR code PNGs for all 15 missions
  useEffect(() => {
    let isMounted = true;

    const generateAll = async () => {
      const entries = await Promise.all(
        initialMissions.map(async (mission) => {
          const payload = mission.qrSampleCode || `ECOSTAY:MISSION:${mission.id}`;
          try {
            const dataUrl = await QRCode.toDataURL(payload, {
              width: 600,
              margin: 3,
              errorCorrectionLevel: 'H',
              color: {
                dark: '#0A1F18',
                light: '#FFFFFF',
              },
            });
            return [mission.id, dataUrl] as const;
          } catch {
            return [mission.id, ''] as const;
          }
        })
      );

      if (isMounted) {
        setQrMap(Object.fromEntries(entries));
      }
    };

    generateAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: 'all', label: `Tất cả (${initialMissions.length})`, icon: <Footprints size={14} /> },
    { id: 'room', label: 'Trong phòng', icon: <BedDouble size={14} /> },
    { id: 'food', label: 'Ăn uống', icon: <UtensilsCrossed size={14} /> },
    { id: 'transport', label: 'Di chuyển', icon: <Bike size={14} /> },
    { id: 'experience', label: 'Trải nghiệm', icon: <Compass size={14} /> },
    { id: 'app', label: 'Tương tác app', icon: <Smartphone size={14} /> },
  ];

  const filteredMissions = initialMissions.filter((m) =>
    selectedCategory === 'all' ? true : m.category === selectedCategory
  );

  const handleDownloadPNG = (mission: DetailedMission) => {
    const dataUrl = qrMap[mission.id];
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `EcoStay-QR-${mission.id}-${mission.points}CP.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = (mission: DetailedMission) => {
    const code = mission.qrSampleCode || '';
    navigator.clipboard.writeText(code);
    setCopiedId(mission.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const spotlightMission =
    spotlightIndex !== null ? filteredMissions[spotlightIndex] : null;

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 pb-16 print:bg-white print:pb-0">
      {/* Top Bar (Hidden when printing) */}
      <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E4D3E] to-emerald-500 text-white shadow-md">
              <TreePine size={22} />
            </div>
            <div>
              <h1 className="text-base font-black text-[#1E4D3E] flex items-center gap-2">
                <span>EcoStay • Bộ 15 Mã QR Nhiệm Vụ Thật</span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  ISO QR • SCAN LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Mở trang này trên màn hình khác hoặc in A4, rồi dùng Camera thật trong app EcoStay để quét cộng điểm CP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-[#1E4D3E] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#16392E] transition-colors"
            >
              <Printer size={15} />
              <span>In bộ mã QR (A4)</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Về ứng dụng</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 print:max-w-none print:p-2">
        {/* Print-only Header */}
        <div className="hidden print:block mb-4 border-b-2 border-[#1E4D3E] pb-2 text-center">
          <h1 className="text-lg font-black text-[#1E4D3E]">
            BỘ MÃ QR NHIỆM VỤ XANH • HỆ SINH THÁI DU LỊCH NET ZERO ECOSTAY
          </h1>
          <p className="text-xs text-slate-600">
            Dùng Camera trong ứng dụng EcoStay (Tab Tích điểm hoặc Tab Quét mã) để quét xác thực và cộng điểm Carbon Points (CP)
          </p>
        </div>

        {/* Category Filter Bar (Hidden when printing) */}
        <div className="mb-5 flex flex-wrap items-center gap-2 print:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSpotlightIndex(null);
              }}
              className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1E4D3E] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 15 QR Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-3">
          {filteredMissions.map((mission, idx) => {
            const qrSrc = qrMap[mission.id];
            return (
              <div
                key={mission.id}
                className="flex flex-col justify-between rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow break-inside-avoid print:rounded-xl print:border-slate-300 print:p-3 print:shadow-none"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-lg bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {mission.categoryName}
                    </span>
                    <span className="rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-black text-white">
                      +{mission.points} CP
                    </span>
                  </div>

                  {/* Scannable QR Code Image */}
                  <div
                    onClick={() => setSpotlightIndex(idx)}
                    className="group relative mx-auto mb-3 flex aspect-square w-52 items-center justify-center rounded-2xl border-2 border-emerald-100 bg-white p-2 cursor-pointer overflow-hidden print:w-40 print:border-slate-200"
                    title="Bấm để phóng to quét nhanh"
                  >
                    {qrSrc ? (
                      <img
                        src={qrSrc}
                        alt={mission.qrSampleCode || mission.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <QrCode size={40} className="animate-pulse" />
                        <span className="text-[11px]">Đang sinh mã QR...</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-[#1E4D3E]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                      <span className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#1E4D3E] shadow">
                        <Maximize2 size={14} />
                        <span>Phóng to quét</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Instruction */}
                  <h2 className="text-sm font-extrabold text-slate-900 leading-snug text-center print:text-xs">
                    {mission.title}
                  </h2>
                  {mission.qrInstruction && (
                    <p className="mt-1 text-[11px] text-slate-500 text-center leading-snug print:text-[10px]">
                      📍 {mission.qrInstruction}
                    </p>
                  )}
                </div>

                {/* Code Payload & Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 border border-slate-200/70">
                    <code className="truncate font-mono text-[10px] font-bold text-emerald-900">
                      {mission.qrSampleCode}
                    </code>
                    <button
                      onClick={() => handleCopyCode(mission)}
                      className="shrink-0 text-slate-400 hover:text-emerald-700 print:hidden"
                      title="Sao chép chuỗi mã"
                    >
                      {copiedId === mission.id ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 print:hidden">
                    <button
                      onClick={() => setSpotlightIndex(idx)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 py-1.5 text-[11px] font-bold text-[#1E4D3E] hover:bg-emerald-100 transition-colors"
                    >
                      <Maximize2 size={13} />
                      <span>Phóng to</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPNG(mission)}
                      className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 border border-slate-200 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <Download size={13} />
                      <span>Tải PNG</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fullscreen Spotlight Modal for Instant Camera Scanning */}
      {spotlightMission && spotlightIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm print:hidden"
          onClick={() => setSpotlightIndex(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSpotlightIndex(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <span>{spotlightMission.categoryName}</span>
              <span>•</span>
              <span className="text-[#1E4D3E] font-black">+{spotlightMission.points} CP</span>
            </div>

            <h3 className="mt-3 text-base font-black text-slate-900 px-4">
              {spotlightMission.title}
            </h3>

            {/* Huge High-Contrast QR Image */}
            <div className="mx-auto my-4 flex h-72 w-72 items-center justify-center rounded-2xl border-4 border-emerald-500/30 bg-white p-3 shadow-inner">
              {qrMap[spotlightMission.id] && (
                <img
                  src={qrMap[spotlightMission.id]}
                  alt={spotlightMission.qrSampleCode || spotlightMission.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <code className="inline-block rounded-xl bg-slate-100 px-3 py-1.5 font-mono text-xs font-bold text-emerald-900">
              {spotlightMission.qrSampleCode}
            </code>

            <p className="mt-2 text-xs text-slate-500">
              Đưa camera trong ứng dụng EcoStay vào mã QR này để cộng thật +{spotlightMission.points} CP
            </p>

            {/* Prev / Next Navigation */}
            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  setSpotlightIndex(
                    (spotlightIndex - 1 + filteredMissions.length) % filteredMissions.length
                  )
                }
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ChevronLeft size={16} />
                <span>Mã trước</span>
              </button>

              <span className="text-xs font-bold text-slate-400">
                {spotlightIndex + 1} / {filteredMissions.length}
              </span>

              <button
                onClick={() =>
                  setSpotlightIndex((spotlightIndex + 1) % filteredMissions.length)
                }
                className="flex items-center gap-1 rounded-xl bg-[#1E4D3E] px-3 py-2 text-xs font-bold text-white hover:bg-[#16392E]"
              >
                <span>Mã tiếp</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
