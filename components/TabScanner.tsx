'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
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
  AlertTriangle,
  VideoOff,
  ScanLine
} from 'lucide-react';
import { GreenMission } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabScannerProps {
  missions: GreenMission[];
  onToggleMission: (missionId: string) => void;
  onSimulateQRScan: (type: 'room' | 'food' | 'transport') => void;
  onLiveQRScan: (decodedData: string) => void;
}

export const TabScanner: React.FC<TabScannerProps> = ({
  missions,
  onToggleMission,
  onSimulateQRScan,
  onLiveQRScan,
}) => {
  // Camera Refs & States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedCodeRef = useRef<string>('');

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Frame processing loop with jsQR
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          const now = Date.now();
          // Debounce same QR code within 3 seconds
          if (code.data !== lastScannedCodeRef.current || now - lastScannedTimeRef.current > 3000) {
            lastScannedTimeRef.current = now;
            lastScannedCodeRef.current = code.data;

            // Haptic vibration feedback if supported
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate([100, 50, 100]);
            }

            triggerEcoConfetti();
            setScanResult(`Đã nhận diện: ${code.data.slice(0, 36)}${code.data.length > 36 ? '...' : ''}`);
            onLiveQRScan(code.data);

            // Clear result status after 4 seconds
            setTimeout(() => {
              setScanResult(null);
            }, 4000);
          }
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanFrame);
  }, [onLiveQRScan]);

  // Start live camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraPermissionError(null);
    setIsProcessing(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionError('Trình duyệt không hỗ trợ truy cập máy ảnh (cần kết nối HTTPS).');
      setIsProcessing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setCameraActive(true);
        animFrameIdRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or failed:', err);
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraPermissionError('Bạn đã từ chối quyền truy cập máy ảnh. Vui lòng cho phép quyền trong cài đặt trình duyệt để quét trực tiếp.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraPermissionError('Không tìm thấy thiết bị máy ảnh/webcam trên thiết bị này.');
      } else {
        setCameraPermissionError('Không thể mở camera: ' + (error.message || 'Lỗi không xác định'));
      }
      setCameraActive(false);
    } finally {
      setIsProcessing(false);
    }
  }, [facingMode, scanFrame, stopCamera]);

  // Auto start camera when component mounts, clean up on unmount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Toggle Torch/Flashlight if supported
  const toggleFlashlight = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashlightOn } as MediaTrackConstraintSet],
          });
          setFlashlightOn(!flashlightOn);
        } else {
          setFlashlightOn(!flashlightOn); // Toggle state visual
        }
      } catch (e) {
        setFlashlightOn(!flashlightOn);
      }
    }
  };

  // Flip Camera between front & back
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Fallback simulator scan handler
  const handleSimulateScan = (type: 'room' | 'food' | 'transport', title: string) => {
    setScanResult(`Đang mô phỏng nhận diện: ${title}...`);
    setTimeout(() => {
      triggerEcoConfetti();
      onSimulateQRScan(type);
      setScanResult(`Thành công! Đã ghi nhận mã QR ${title}`);
      setTimeout(() => setScanResult(null), 3500);
    }, 700);
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
      {/* Hidden canvas used by jsQR to sample frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. Header & Title */}
      <div className="border-b border-emerald-900/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <ScanLine size={16} />
          <span>Camera Quét Mã Trực Tiếp</span>
        </div>
        <h3 className="mt-1 text-base font-bold text-slate-800">
          Quét mã QR bằng Camera thật
        </h3>
        <p className="text-xs text-slate-500">
          Đưa camera lại gần mã QR bất kỳ để tự động giải mã và tích lũy CACBON POINT
        </p>
      </div>

      {/* 2. Live Camera Viewfinder Screen */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-3 text-white shadow-xl">
        {/* Camera HUD bar */}
        <div className="flex items-center justify-between text-slate-400 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-[11px]">
            <div className={`h-2 w-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="font-semibold text-white">
              {cameraActive ? 'LIVE CAMERA (jsQR)' : 'CAMERA SẴN SÀNG'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlashlight}
              className={`rounded-full p-1.5 transition-colors ${
                flashlightOn ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Bật/Tắt đèn Flash"
            >
              <Flashlight size={14} />
            </button>
            <button
              onClick={flipCamera}
              className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
              title="Đổi camera trước / sau"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Viewfinder Reticle Frame */}
        <div className="relative mx-auto my-2 flex h-60 w-full max-w-[280px] items-center justify-center rounded-2xl border-2 border-emerald-400/40 bg-slate-900 overflow-hidden shadow-inner">
          
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              cameraActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Placeholder when Camera is loading / off */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {cameraPermissionError ? (
                <>
                  <VideoOff size={36} className="text-amber-400 mb-2" />
                  <p className="text-[11px] text-amber-200 leading-snug">
                    {cameraPermissionError}
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-3 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-500"
                  >
                    Thử lại Camera
                  </button>
                </>
              ) : (
                <>
                  <Camera size={36} className="text-emerald-400/60 animate-bounce mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    {isProcessing ? 'Đang mở máy ảnh...' : 'Nhấn nút để kích hoạt Camera'}
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-3 rounded-xl bg-[#1E4D3E] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                  >
                    Bật Camera Quét Thật
                  </button>
                </>
              )}
            </div>
          )}

          {/* Target Corner Guides */}
          <div className="absolute top-3 left-3 h-7 w-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-3 right-3 h-7 w-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-3 left-3 h-7 w-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-3 right-3 h-7 w-7 border-b-4 border-r-4 border-emerald-400 rounded-br-xl pointer-events-none" />

          {/* Animated Laser Scanning Line */}
          {cameraActive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scan-line pointer-events-none" />
          )}

          {/* Flashlight Overlay Simulation */}
          {flashlightOn && (
            <div className="absolute inset-0 bg-amber-100/15 pointer-events-none" />
          )}
        </div>

        {/* Scan Status Toast Banner */}
        {scanResult && (
          <div className="mt-2 rounded-2xl bg-emerald-500/25 border border-emerald-400/60 p-2.5 text-center text-xs font-bold text-emerald-300 animate-fadeIn">
            ✨ {scanResult}
          </div>
        )}

        {/* Quick Simulator Scan Buttons (Fallback for PC / Demo) */}
        <div className="mt-3 text-center border-t border-white/10 pt-2.5">
          <p className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold mb-2">
            Hoặc chọn kịch bản mẫu nhanh:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulateScan('room', 'Thẻ Phòng Xanh')}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
            >
              🏷️ Buồng phòng
            </button>
            <button
              onClick={() => handleSimulateScan('food', 'Bàn Ăn Zero Waste')}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
            >
              🍽️ Ăn sạch đĩa
            </button>
            <button
              onClick={() => handleSimulateScan('transport', 'Xe Điện Xanh SM')}
              className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
            >
              🚗 Xe điện / Bus
            </button>
          </div>
        </div>
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
