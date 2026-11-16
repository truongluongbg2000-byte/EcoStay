'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  Flashlight,
  RefreshCw,
  Sparkles,
  TreePine,
  CheckCircle2,
  Footprints,
  Thermometer,
  UtensilsCrossed,
  BedDouble,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GreenMission } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabScannerProps {
  missions: GreenMission[];
  onToggleMission: (missionId: string) => void;
  onSimulateQRScan: (type: 'room' | 'food' | 'transport') => void;
}

export const TabScanner: React.FC<TabScannerProps> = ({
  missions,
  onToggleMission,
  onSimulateQRScan,
}) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScanAction = (type: 'room' | 'food' | 'transport', title: string) => {
    setScanning(true);
    setScanResult(`Đang nhận diện mã QR: ${title}...`);

    setTimeout(() => {
      setScanning(false);
      setScanResult(`Thành công! Đã ghi nhận mã QR ${title}`);
      triggerEcoConfetti();
      onSimulateQRScan(type);

      setTimeout(() => {
        setScanResult(null);
      }, 3500);
    }, 1200);
  };

  const getMissionIcon = (id: string) => {
    switch (id) {
      case 'mis-1':
        return <BedDouble size={20} className="text-emerald-700" />;
      case 'mis-2':
        return <UtensilsCrossed size={20} className="text-emerald-700" />;
      case 'mis-3':
        return <Thermometer size={20} className="text-emerald-700" />;
      case 'mis-4':
        return <Footprints size={20} className="text-emerald-700" />;
      default:
        return <TreePine size={20} className="text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      {/* 1. Header & Title */}
      <div className="border-b border-emerald-900/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <QrCode size={16} />
          <span>Trung tâm Hành động Xanh</span>
        </div>
        <h3 className="mt-1 text-base font-bold text-slate-800">
          Quét mã & Nhận điểm CACBON POINT
        </h3>
        <p className="text-xs text-slate-500">
          Ghi nhận các lựa chọn thân thiện môi trường trong suốt thời gian lưu trú
        </p>
      </div>

      {/* 2. Camera Viewfinder Scanner Simulation */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-xl">
        {/* Camera HUD bar */}
        <div className="flex items-center justify-between text-slate-400 mb-2 px-1">
          <div className="flex items-center gap-1 text-[11px]">
            <Camera size={14} className="text-emerald-400" />
            <span>Eco-Scanner v2.5</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`rounded-full p-1.5 transition-colors ${
                flashlightOn ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white'
              }`}
            >
              <Flashlight size={14} />
            </button>
            <button className="rounded-full bg-white/10 p-1.5 text-white">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Viewfinder Reticle */}
        <div className="relative mx-auto my-3 flex h-52 w-full max-w-[260px] items-center justify-center rounded-2xl border border-white/20 bg-slate-900/80 overflow-hidden">
          {/* Target Corner Borders */}
          <div className="absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
          <div className="absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

          {/* Animated Laser Scan Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-line" />

          {/* Center Graphic */}
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <QrCode size={48} className="text-emerald-400/30 animate-pulse" />
            <p className="mt-3 text-[11px] font-medium text-slate-300">
              Đặt mã QR tại phòng hoặc quầy dịch vụ vào khung hình
            </p>
          </div>

          {/* Flash Effect */}
          {flashlightOn && (
            <div className="absolute inset-0 bg-amber-100/10 pointer-events-none" />
          )}
        </div>

        {/* Quick Simulator Scan Buttons */}
        <div className="mt-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold mb-2">
            Mô phỏng quét mã thực tế tại Resort:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleScanAction('room', 'Thẻ Phòng Xanh')}
              disabled={scanning}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10 disabled:opacity-50"
            >
              🏷️ Buồng phòng
            </button>
            <button
              onClick={() => handleScanAction('food', 'Bàn Ăn Zero Waste')}
              disabled={scanning}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10 disabled:opacity-50"
            >
              🍽️ Ăn sạch đĩa
            </button>
            <button
              onClick={() => handleScanAction('transport', 'Xe Điện Xanh SM')}
              disabled={scanning}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10 disabled:opacity-50"
            >
              🚗 Xe điện / Bus
            </button>
          </div>
        </div>

        {/* Scan Status Toast Banner */}
        {scanResult && (
          <div className="mt-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 p-2 text-center text-xs font-bold text-emerald-300 animate-fadeIn">
            {scanResult}
          </div>
        )}
      </div>

      {/* 3. Quick Toggles: In-Stay Guest Green Commitments */}
      <div className="rounded-3xl bg-white p-4 shadow-sm border border-emerald-950/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#1E4D3E]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Công tắc Cam kết Xanh (Lưu trú)
            </h4>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            Tự động tích điểm
          </span>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => {
            const isDone = mission.completed;
            return (
              <div
                key={mission.id}
                className={`rounded-2xl p-3 border transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-emerald-100">
                      {getMissionIcon(mission.id)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 leading-snug">
                        {mission.title}
                      </h5>
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                        {mission.subtitle}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" />
                        <span>{mission.impactNote}</span>
                      </p>
                    </div>
                  </div>

                  {/* Toggle / Action Trigger */}
                  <div className="shrink-0 text-right">
                    <span className="block text-xs font-extrabold text-[#1E4D3E] mb-1">
                      +{mission.points} CB
                    </span>

                    {mission.type === 'toggle' ? (
                      <button
                        onClick={() => onToggleMission(mission.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isDone ? 'bg-[#1E4D3E]' : 'bg-slate-300'
                        }`}
                        role="switch"
                        aria-checked={isDone}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isDone ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleMission(mission.id)}
                        disabled={isDone}
                        className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all shadow-sm active:scale-95 ${
                          isDone
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-[#D97736] text-white hover:bg-[#C26D45]'
                        }`}
                      >
                        {isDone ? 'Đã nhận' : 'Xác nhận'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
