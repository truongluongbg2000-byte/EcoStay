'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Building2,
  ImageUp,
  XCircle,
  AlertTriangle,
  Home
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';
import {
  createFastVideoQRScanner,
  decodeQRFromImageFile,
  FastQRScannerController,
  tryEnableContinuousFocus,
} from '@/lib/qr/fastScanner';
import { getDictionary, Lang } from '@/lib/i18n';

export interface LiveQRScanResult {
  status: 'success' | 'already_completed' | 'invalid';
  message: string;
  points?: number;
  missionTitle?: string;
  categoryName?: string;
}

interface TabScannerProps {
  user: UserProfile;
  currentLang?: Lang;
  onSimulateQRScan: (type: 'room' | 'food' | 'transport') => void;
  onLiveQRScan: (decodedData: string) => LiveQRScanResult | void;
  onNavigateHome?: () => void;
}

export const TabScanner: React.FC<TabScannerProps> = ({
  user,
  currentLang = 'vi',
  onLiveQRScan,
  onNavigateHome,
}) => {
  const t = getDictionary(currentLang);
  const [activeScannerTab, setActiveScannerTab] = useState<'camera' | 'my_qr'>('camera');
  const [copiedCode, setCopiedCode] = useState(false);

  // Camera Refs & States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerCtrlRef = useRef<FastQRScannerController | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedCodeRef = useRef<string>('');
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedForSuccessRef = useRef<boolean>(false);

  // Keep latest scan handler in ref so parent CB/mission updates never restart camera
  const onLiveQRScanRef = useRef(onLiveQRScan);
  onLiveQRScanRef.current = onLiveQRScan;

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanFeedback, setScanFeedback] = useState<LiveQRScanResult | null>(null);
  const [completedScan, setCompletedScan] = useState<LiveQRScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (scannerCtrlRef.current) {
      scannerCtrlRef.current.stop();
      scannerCtrlRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFlashlightOn(false);
  }, []);

  const processDecodedCode = useCallback(
    (decodedText: string) => {
      if (isPausedForSuccessRef.current) return;

      const result = onLiveQRScanRef.current(decodedText);
      const feedback: LiveQRScanResult = result || {
        status: 'success',
        message: decodedText.slice(0, 36),
      };

      if (feedback.status === 'success') {
        isPausedForSuccessRef.current = true;
        // 1. Immediately turn off camera hardware
        stopCamera();
        // 2. Show completion card with 2 choices
        setScanFeedback(null);
        setCompletedScan(feedback);

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        triggerEcoConfetti();
        return;
      }

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(140);
      }

      setScanFeedback(feedback);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      resultTimerRef.current = setTimeout(() => {
        setScanFeedback(null);
      }, 3600);
    },
    [stopCamera]
  );

  const handleVideoCodeDetected = useCallback(
    (codeData: string) => {
      const now = Date.now();
      if (codeData !== lastScannedCodeRef.current || now - lastScannedTimeRef.current > 2500) {
        lastScannedTimeRef.current = now;
        lastScannedCodeRef.current = codeData;
        processDecodedCode(codeData);
      }
    },
    [processDecodedCode]
  );

  // Start live camera stream
  const startCamera = useCallback(async () => {
    if (isPausedForSuccessRef.current) return;
    stopCamera();
    setCameraPermissionError(null);
    setIsProcessing(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionError(t.scanner.errHttps);
      setIsProcessing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 720 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      if (isPausedForSuccessRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      tryEnableContinuousFocus(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);

        const ctrl = createFastVideoQRScanner({
          video: videoRef.current,
          onDetect: handleVideoCodeDetected,
          intervalMs: 75,
        });
        scannerCtrlRef.current = ctrl;
        ctrl.start();
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraPermissionError(t.scanner.errDenied);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraPermissionError(t.scanner.errNotFound);
      } else {
        setCameraPermissionError(t.scanner.errGeneric + (error.message || ''));
      }
      setCameraActive(false);
    } finally {
      setIsProcessing(false);
    }
  }, [facingMode, handleVideoCodeDetected, stopCamera, t.scanner.errDenied, t.scanner.errGeneric, t.scanner.errHttps, t.scanner.errNotFound]);

  useEffect(() => {
    if (activeScannerTab === 'camera' && !completedScan) {
      isPausedForSuccessRef.current = false;
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [activeScannerTab, completedScan, startCamera, stopCamera]);

  const handleScanNextMission = () => {
    isPausedForSuccessRef.current = false;
    lastScannedCodeRef.current = '';
    lastScannedTimeRef.current = 0;
    setScanFeedback(null);
    setCompletedScan(null);
  };

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

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const decoded = await decodeQRFromImageFile(file);
    if (decoded) {
      processDecodedCode(decoded);
    } else {
      setScanFeedback({
        status: 'invalid',
        message: t.scanner.noQrInImage,
      });
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      resultTimerRef.current = setTimeout(() => setScanFeedback(null), 3500);
    }
  };

  const handleCopyMemberCode = () => {
    navigator.clipboard.writeText(user.memberCode || 'ECO-TL-883921');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-8 text-left">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* 1. Mode Switcher */}
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
          <span>{t.scanner.cameraTab}</span>
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
          <span>{t.scanner.myQrTab}</span>
        </button>
      </div>

      {activeScannerTab === 'camera' ? (
        /* MODE 1: LIVE CAMERA QR SCANNER OR COMPLETION CARD */
        <div className="space-y-3">
          {completedScan ? (
            /* COMPLETION CARD: Camera is CLOSED + Real Points Summary + 2 Action Buttons */
            <div className="rounded-3xl bg-white p-6 shadow-md border border-emerald-200/80 text-center animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#1E4D3E] text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>

              <span className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {completedScan.categoryName || t.earn.headerTitle}
              </span>

              <h3 className="mt-2 text-base font-black text-slate-900">
                {t.scanner.completedTitle}
              </h3>

              {typeof completedScan.points === 'number' && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1 text-base font-black text-[#1E4D3E] border border-emerald-200">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>+{completedScan.points} CB</span>
                </div>
              )}

              {completedScan.missionTitle && (
                <p className="mt-2.5 text-xs font-bold text-slate-800 px-2 leading-snug">
                  {completedScan.missionTitle}
                </p>
              )}

              <p className="mt-1 text-[11px] text-slate-500">
                {t.scanner.cameraClosedNotice}
              </p>

              {/* Live Updated Balance Box */}
              <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 px-4 py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  {t.scanner.currentBalanceLabel}
                </span>
                <span className="text-base font-black text-[#1E4D3E]">
                  {user.carbonPoints.toLocaleString()} CB
                </span>
              </div>

              {/* 2 Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleScanNextMission}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] py-3.5 text-xs font-bold text-white shadow-md hover:from-[#16392E] hover:to-[#225242] active:scale-98 transition-all"
                >
                  <ScanLine size={16} className="text-emerald-300" />
                  <span>{t.scanner.scanNextBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onNavigateHome?.();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 py-3.5 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-100 active:scale-98 transition-all"
                >
                  <Home size={16} />
                  <span>{t.scanner.doneToHomeBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-emerald-900/10 pb-2">
                <h3 className="text-base font-bold text-slate-800">
                  {t.scanner.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.scanner.subtitle}
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
                      {cameraActive ? t.scanner.liveCamera : t.scanner.cameraReady}
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
                      title={t.scanner.toggleFlash}
                    >
                      <Flashlight size={14} />
                    </button>
                    <button
                      onClick={flipCamera}
                      className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
                      title={t.scanner.flipCamera}
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
                            {t.scanner.retryCamera}
                          </button>
                        </>
                      ) : (
                        <>
                          <Camera size={36} className="text-emerald-400/60 animate-bounce mb-2" />
                          <p className="text-xs font-medium text-slate-300">
                            {isProcessing ? t.scanner.startingCamera : t.scanner.tapToActivate}
                          </p>
                          <button
                            onClick={startCamera}
                            className="mt-3 rounded-xl bg-[#1E4D3E] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
                          >
                            {t.scanner.turnOnCamera}
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

                {scanFeedback && (
                  <div
                    className={`mt-2 rounded-2xl p-2.5 text-center text-xs font-bold animate-fadeIn flex items-center justify-center gap-1.5 border ${
                      scanFeedback.status === 'already_completed'
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                        : 'bg-rose-500/25 border-rose-400/60 text-rose-200'
                    }`}
                  >
                    {scanFeedback.status === 'already_completed' ? (
                      <AlertTriangle size={15} className="shrink-0" />
                    ) : (
                      <XCircle size={15} className="shrink-0" />
                    )}
                    <span>{scanFeedback.message}</span>
                  </div>
                )}

                {/* Scan from Real QR Image File */}
                <div className="mt-3 text-center border-t border-white/10 pt-2.5">
                  <p className="text-[10px] text-slate-400 mb-2">
                    {t.scanner.scanAny15Hint}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold text-emerald-200 hover:bg-emerald-600/30 active:scale-98 transition-all border border-white/15"
                  >
                    <ImageUp size={15} />
                    <span>{t.scanner.scanFromImageBtn}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* MODE 2: MY MEMBER QR */
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-emerald-950/5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#1E4D3E]">
              {t.scanner.memberCardBadge}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-400">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-emerald-700 font-semibold">
                {t.data.ranks[user.rank] || user.rank}
              </p>
            </div>
          </div>

          {/* Points display */}
          <div className="mt-3 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] p-3 text-white">
            <p className="text-[10px] text-emerald-200 uppercase">
              {t.scanner.currentPointsLabel}
            </p>
            <p className="text-2xl font-black">{user.carbonPoints} CB</p>
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

            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t.scanner.memberCodeLabel}
            </p>

            {/* Member Code with Copy */}
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-mono text-sm font-extrabold tracking-wider text-[#1E4D3E] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {user.memberCode || 'ECO-TL-883921'}
              </span>
              <button
                onClick={handleCopyMemberCode}
                className="rounded-xl bg-emerald-100 p-1.5 text-emerald-800 hover:bg-emerald-200 transition-colors"
                title={copiedCode ? t.scanner.copiedBtn : t.scanner.copyCodeBtn}
              >
                {copiedCode ? (
                  <Check size={16} className="text-emerald-700" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-500 max-w-xs">
              {t.scanner.showStaffHint}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
