'use client';

import React, { useState } from 'react';
import { X, QrCode, Sparkles, CheckCircle2, Camera, Zap, AlertTriangle } from 'lucide-react';
import { DetailedMission } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface MissionQRModalProps {
  mission: DetailedMission | null;
  onClose: () => void;
  onSuccess: (missionId: string) => void;
  onOpenLiveScanner: () => void;
}

export const MissionQRModal: React.FC<MissionQRModalProps> = ({
  mission,
  onClose,
  onSuccess,
  onOpenLiveScanner,
}) => {
  const [isScanning, setIsScanning] = useState(false);

  if (!mission) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      triggerEcoConfetti();
      onSuccess(mission.id);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Quét QR Nhiệm Vụ Xanh</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">{mission.categoryName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={15} />
          </button>
        </div>

        {/* Mission Details */}
        <div className="rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100 mb-3.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-900 leading-snug">{mission.title}</h4>
            <span className="shrink-0 rounded-full bg-[#1E4D3E] px-2 py-0.5 text-xs font-extrabold text-white">
              +{mission.points} CP
            </span>
          </div>
          {mission.subtitle && (
            <p className="mt-1 text-[11px] text-slate-600 leading-tight">{mission.subtitle}</p>
          )}

          {mission.isPenalty && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-700 font-medium">
              <AlertTriangle size={12} className="shrink-0" />
              <span>Nếu quán đối tác phản ánh lãng phí thức ăn sẽ bị trừ 5 CP.</span>
            </div>
          )}
        </div>

        {/* Scanner Viewfinder Simulation */}
        <div className="relative mx-auto my-2 h-48 w-48 overflow-hidden rounded-2xl bg-slate-900 border-2 border-emerald-500/80 shadow-inner flex flex-col items-center justify-center">
          {/* Laser beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_2.5s_infinite]" />

          {/* Corner marks */}
          <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

          {/* QR Code illustration */}
          <div className="flex flex-col items-center justify-center text-emerald-400/80">
            <QrCode size={52} className={isScanning ? 'animate-pulse text-emerald-300' : ''} />
            <p className="mt-2 text-[10px] text-slate-300 font-mono text-center px-2">
              {mission.qrSampleCode || 'ECOSTAY:MISSION:SCAN'}
            </p>
          </div>

          {isScanning && (
            <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center backdrop-blur-xs">
              <div className="flex items-center gap-2 text-white text-xs font-bold animate-pulse">
                <Sparkles size={16} className="text-amber-400" />
                <span>Đang xác nhận mã QR...</span>
              </div>
            </div>
          )}
        </div>

        {/* Location / Instructions */}
        <p className="mt-2 text-center text-[11px] text-slate-500 leading-relaxed px-1">
          📍 {mission.qrInstruction || 'Hướng camera vào mã QR dán tại địa điểm đối tác để tích điểm.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] py-3 text-xs font-bold text-white shadow-md hover:from-[#16392E] hover:to-[#225242] active:scale-98 transition-all"
          >
            <Zap size={15} className="text-amber-300" />
            <span>⚡ Quét nhanh mã test (+{mission.points} CP)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLiveScanner();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-white py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <Camera size={14} />
            <span>Mở Camera quét thật</span>
          </button>
        </div>
      </div>
    </div>
  );
};
