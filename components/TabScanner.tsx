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
  ScanLine,
  UserCheck,
  VideoOff,
  Copy,
  Check,
  Building2
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';

interface TabScannerProps {
  user: UserProfile;
  currentLang?: 'vi' | 'en';
  onSimulateQRScan: (type: 'room' | 'food' | 'transport') => void;
  onLiveQRScan: (decodedData: string) => void;
}

export const TabScanner: React.FC<TabScannerProps> = ({
  user,
  currentLang = 'vi',
  onSimulateQRScan,
  onLiveQRScan,
}) => {
  const isEn = currentLang === 'en';
  const [activeScannerTab, setActiveScannerTab] = useState<'camera' | 'my_qr'>('camera');
  const [copiedCode, setCopiedCode] = useState(false);

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
          if (code.data !== lastScannedCodeRef.current || now - lastScannedTimeRef.current > 3000) {
            lastScannedTimeRef.current = now;
            lastScannedCodeRef.current = code.data;

            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate([100, 50, 100]);
            }

            triggerEcoConfetti();
            setScanResult(`Đã nhận diện: ${code.data.slice(0, 36)}${code.data.length > 36 ? '...' : ''}`);
            onLiveQRScan(code.data);

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
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        animFrameIdRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: unknown) {
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

  useEffect(() => {
    if (activeScannerTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeScannerTab, startCamera, stopCamera]);

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
          setFlashlightOn(!flashlightOn);
        }
      } catch (e) {
        setFlashlightOn(!flashlightOn);
      }
    }
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSimulateScan = (type: 'room' | 'food' | 'transport', title: string) => {
    setScanResult(`Đang nhận diện: ${title}...`);
    setTimeout(() => {
      triggerEcoConfetti();
      onSimulateQRScan(type);
      setScanResult(`Thành công! Đã ghi nhận mã QR ${title}`);
      setTimeout(() => setScanResult(null), 3500);
    }, 700);
  };

  const handleCopyMemberCode = () => {
    navigator.clipboard.writeText(user.memberCode || 'ECO-TL-883921');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. Mode Switcher: [ Quét mã QR ] vs [ MÃ QR CỦA TÔI ] */}
      <div className="flex rounded-2xl bg-emerald-100/60 p-1">
        <button
          onClick={() => setActiveScannerTab('camera')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeScannerTab === 'camera'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ScanLine size={15} />
          <span>{isEn ? 'Camera Scanner' : 'Quét mã camera'}</span>
        </button>
        <button
          onClick={() => setActiveScannerTab('my_qr')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeScannerTab === 'my_qr'
              ? 'bg-[#1E4D3E] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck size={15} />
          <span>{isEn ? 'MY MEMBER QR' : 'MÃ QR CỦA TÔI'}</span>
        </button>
      </div>

      {activeScannerTab === 'camera' ? (
        /* MODE 1: LIVE CAMERA QR SCANNER */
        <div className="space-y-3">
          <div className="border-b border-emerald-900/10 pb-2">
            <h3 className="text-base font-bold text-slate-800">
              {isEn ? 'Scan QR with Live Camera' : 'Quét mã QR bằng Camera thật'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'Point camera at any QR code to automatically recognize and earn CARBON POINTS'
                : 'Đưa camera vào mã QR bất kỳ để tự động nhận diện và cộng CACBON POINT'}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-3 text-white shadow-xl">
            {/* Camera HUD bar */}
            <div className="flex items-center justify-between text-slate-400 mb-2 px-1">
              <div className="flex items-center gap-1.5 text-[11px]">
                <div
                  className={`h-2 w-2 rounded-full ${
                    cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="font-semibold text-white">
                  {cameraActive
                    ? isEn
                      ? 'LIVE CAMERA (jsQR)'
                      : 'CAMERA ĐANG CHẠY'
                    : isEn
                    ? 'CAMERA READY'
                    : 'CAMERA SẴN SÀNG'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFlashlight}
                  className={`rounded-full p-1.5 transition-colors ${
                    flashlightOn
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isEn ? 'Toggle Flash' : 'Bật/Tắt Flash'}
                >
                  <Flashlight size={14} />
                </button>
                <button
                  onClick={flipCamera}
                  className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
                  title={isEn ? 'Flip Camera' : 'Đổi camera'}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Viewfinder Frame */}
            <div className="relative mx-auto my-2 flex h-60 w-full max-w-[280px] items-center justify-center rounded-2xl border-2 border-emerald-400/40 bg-slate-900 overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  cameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

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
                        {isEn ? 'Retry Camera' : 'Thử lại Camera'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Camera size={36} className="text-emerald-400/60 animate-bounce mb-2" />
                      <p className="text-xs font-medium text-slate-300">
                        {isProcessing
                          ? isEn
                            ? 'Starting camera...'
                            : 'Đang mở máy ảnh...'
                          : isEn
                          ? 'Tap to activate live camera'
                          : 'Nhấn nút để kích hoạt Camera'}
                      </p>
                      <button
                        onClick={startCamera}
                        className="mt-3 rounded-xl bg-[#1E4D3E] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                      >
                        {isEn ? 'Turn On Live Camera' : 'Bật Camera Quét Thật'}
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

              {cameraActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scan-line pointer-events-none" />
              )}
            </div>

            {scanResult && (
              <div className="mt-2 rounded-2xl bg-emerald-500/25 border border-emerald-400/60 p-2.5 text-center text-xs font-bold text-emerald-300 animate-fadeIn">
                ✨ {scanResult}
              </div>
            )}

            {/* Quick Simulation Buttons */}
            <div className="mt-3 text-center border-t border-white/10 pt-2.5">
              <p className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-semibold mb-2">
                {isEn ? 'Or choose test scenarios:' : 'Hoặc chọn kịch bản mẫu nhanh:'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    handleSimulateScan(
                      'room',
                      isEn ? 'In-Room Eco Card' : 'Thẻ Phòng Xanh'
                    )
                  }
                  className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
                >
                  {isEn ? '🏷️ In-Room' : '🏷️ Buồng phòng'}
                </button>
                <button
                  onClick={() =>
                    handleSimulateScan(
                      'food',
                      isEn ? 'Clean Plate Zero Waste' : 'Bàn Ăn Zero Waste'
                    )
                  }
                  className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
                >
                  {isEn ? '🍽️ Clean Plate' : '🍽️ Ăn sạch đĩa'}
                </button>
                <button
                  onClick={() =>
                    handleSimulateScan(
                      'transport',
                      isEn ? 'Green E-Bike Ride' : 'Xe Điện Xanh SM'
                    )
                  }
                  className="rounded-xl bg-white/10 p-2 text-[11px] font-semibold text-white hover:bg-emerald-600/40 active:scale-95 transition-all border border-white/10"
                >
                  {isEn ? '🚗 E-Bike / Bus' : '🚗 Xe điện / Bus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: MÃ QR CỦA TÔI (CHO NHÂN VIÊN/ĐỐI TÁC QUÉT) */
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-emerald-950/5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#1E4D3E]">
              {isEn ? 'EcoStay Member Card' : 'Thẻ Thành Viên EcoStay'}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-400">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-emerald-700 font-semibold">
                {isEn ? 'Green Member • Sprout Tier' : user.rank}
              </p>
            </div>
          </div>

          {/* Points display */}
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] p-3 text-white">
            <p className="text-[10px] text-emerald-200">
              {isEn ? 'CURRENT BALANCE' : 'SỐ DƯ HIỆN CÓ'}
            </p>
            <p className="text-2xl font-black">{user.carbonPoints} CP</p>
          </div>

          {/* Member QR Code */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3 shadow-md border-2 border-dashed border-emerald-300">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* 3 Corner Markers */}
                <rect x="5" y="5" width="25" height="25" fill="#1E4D3E" rx="3" />
                <rect x="9" y="9" width="17" height="17" fill="white" rx="1.5" />
                <rect x="13" y="13" width="9" height="9" fill="#1E4D3E" />

                <rect x="70" y="5" width="25" height="25" fill="#1E4D3E" rx="3" />
                <rect x="74" y="9" width="17" height="17" fill="white" rx="1.5" />
                <rect x="78" y="13" width="9" height="9" fill="#1E4D3E" />

                <rect x="5" y="70" width="25" height="25" fill="#1E4D3E" rx="3" />
                <rect x="9" y="74" width="17" height="17" fill="white" rx="1.5" />
                <rect x="13" y="78" width="9" height="9" fill="#1E4D3E" />

                {/* Center Member Icon */}
                <circle cx="50" cy="50" r="10" fill="#1E4D3E" />
                <path
                  d="M 46 50 L 49 53 L 55 47"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Pattern blocks */}
                <rect x="36" y="8" width="8" height="6" fill="#1E4D3E" />
                <rect x="50" y="8" width="12" height="6" fill="#1E4D3E" />
                <rect x="36" y="20" width="6" height="10" fill="#1E4D3E" />
                <rect x="48" y="22" width="14" height="6" fill="#1E4D3E" />
                <rect x="10" y="38" width="14" height="6" fill="#1E4D3E" />
                <rect x="80" y="40" width="12" height="8" fill="#1E4D3E" />
                <rect x="36" y="66" width="10" height="8" fill="#1E4D3E" />
                <rect x="52" y="66" width="14" height="8" fill="#1E4D3E" />
                <rect x="72" y="72" width="18" height="14" fill="#1E4D3E" />
              </svg>
            </div>

            {/* Member Code with Copy */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="font-mono text-sm font-extrabold tracking-wider text-[#1E4D3E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {user.memberCode || 'ECO-TL-883921'}
              </span>
              <button
                onClick={handleCopyMemberCode}
                className="rounded-xl bg-emerald-100 p-1.5 text-emerald-800 hover:bg-emerald-200 transition-colors"
                title={isEn ? 'Copy member code' : 'Sao chép mã thành viên'}
              >
                {copiedCode ? (
                  <Check size={16} className="text-emerald-700" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-500 max-w-xs">
              {isEn
                ? 'Present this QR code to hotel receptionist, housekeeping or cashier to earn points or apply discounts upon checkout.'
                : 'Xuất trình mã này cho nhân viên lễ tân, buồng phòng hoặc quầy thu ngân đối tác để tích điểm hoặc áp dụng cấn trừ trực tiếp khi thanh toán.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
