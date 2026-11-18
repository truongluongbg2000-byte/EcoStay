'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  Camera,
  RefreshCw,
  Flashlight,
  AlertTriangle,
  VideoOff,
  ImageUp,
  XCircle,
  Sparkles,
  Home,
  ScanLine,
} from 'lucide-react';
import { DetailedMission } from '@/data/types';
import { triggerEcoConfetti } from './Confetti';
import {
  createFastVideoQRScanner,
  decodeQRFromImageFile,
  FastQRScannerController,
  tryEnableContinuousFocus,
} from '@/lib/qr/fastScanner';

interface MissionQRModalProps {
  mission: DetailedMission | null;
  userPoints?: number;
  currentLang?: 'vi' | 'en';
  onClose: () => void;
  onSuccess: (missionId: string) => void;
  onScanNext?: () => void;
  onNavigateHome?: () => void;
}

export const MissionQRModal: React.FC<MissionQRModalProps> = ({
  mission,
  userPoints,
  currentLang = 'vi',
  onClose,
  onSuccess,
  onScanNext,
  onNavigateHome,
}) => {
  const isEn = currentLang === 'en';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerCtrlRef = useRef<FastQRScannerController | null>(null);
  const hasSucceededRef = useRef<boolean>(false);
  const lastMismatchRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest callbacks in refs so state updates in parent never restart camera
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const missionRef = useRef(mission);
  missionRef.current = mission;

  const [cameraActive, setCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'mismatch'>('scanning');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const handleDecodedQR = useCallback(
    (rawData: string) => {
      const activeMission = missionRef.current;
      if (!activeMission || hasSucceededRef.current) return;

      const scanned = rawData.trim();
      const expected = (activeMission.qrSampleCode || '').trim();

      const isMatch =
        expected.length > 0 &&
        (scanned === expected || scanned.includes(expected));

      if (isMatch) {
        hasSucceededRef.current = true;
        // 1. Immediately close camera hardware
        stopCamera();
        // 2. Show completion screen with 2 choices
        setScanStatus('success');
        setStatusMessage(
          isEn
            ? `+${activeMission.points} CB has been added to your account!`
            : `Đã cộng thật +${activeMission.points} CB vào tài khoản của bạn!`
        );

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }

        triggerEcoConfetti();
        // 3. Award real CB points & save to LocalStorage
        onSuccessRef.current(activeMission.id);
        return;
      }

      // Mismatch or unrelated QR code -> keep camera running & warn
      const now = Date.now();
      if (
        scanned === lastMismatchRef.current.code &&
        now - lastMismatchRef.current.time < 2500
      ) {
        return;
      }
      lastMismatchRef.current = { code: scanned, time: now };

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(150);
      }

      setScanStatus('mismatch');
      if (scanned.toUpperCase().startsWith('ECOSTAY:')) {
        setStatusMessage(
          isEn
            ? 'Wrong mission QR! Please scan the exact QR code for this mission.'
            : 'Sai mã nhiệm vụ đang chọn! Vui lòng quét đúng mã QR của nhiệm vụ này.'
        );
      } else {
        setStatusMessage(
          isEn
            ? 'Invalid QR code — not an EcoStay mission code.'
            : 'Mã QR không hợp lệ — không thuộc hệ thống nhiệm vụ EcoStay.'
        );
      }

      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        if (!hasSucceededRef.current) {
          setScanStatus('scanning');
          setStatusMessage(null);
        }
      }, 2600);
    },
    [isEn, stopCamera]
  );

  const startCamera = useCallback(async () => {
    if (hasSucceededRef.current) return;
    stopCamera();
    setCameraError(null);
    setIsStartingCamera(true);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        isEn
          ? 'Camera is unavailable (HTTPS required). You can upload a QR image below to scan.'
          : 'Trình duyệt không hỗ trợ mở Camera (cần kết nối HTTPS). Bạn có thể chọn ảnh QR từ thiết bị bên dưới.'
      );
      setIsStartingCamera(false);
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

      if (hasSucceededRef.current) {
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
          onDetect: handleDecodedQR,
          intervalMs: 75,
        });
        scannerCtrlRef.current = ctrl;
        ctrl.start();
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError(
          isEn
            ? 'Camera access denied. Please allow camera permission in your browser settings.'
            : 'Bạn đã từ chối quyền Camera. Vui lòng cấp quyền máy ảnh trong trình duyệt để quét mã.'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError(
          isEn
            ? 'No camera found on this device. You can upload a QR image below.'
            : 'Không tìm thấy camera trên thiết bị này. Bạn có thể chọn ảnh QR từ máy bên dưới.'
        );
      } else {
        setCameraError(
          isEn
            ? `Cannot open camera: ${error.message || 'Unknown error'}`
            : `Không thể mở camera: ${error.message || 'Lỗi không xác định'}`
        );
      }
      setCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  }, [facingMode, handleDecodedQR, isEn, stopCamera]);

  const missionId = mission?.id ?? null;

  useEffect(() => {
    if (!missionId) {
      stopCamera();
      return;
    }

    hasSucceededRef.current = false;
    lastMismatchRef.current = { code: '', time: 0 };
    setScanStatus('scanning');
    setStatusMessage(null);
    startCamera();

    return () => {
      stopCamera();
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [missionId, facingMode, startCamera, stopCamera]);

  const toggleFlashlight = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = track.getCapabilities
        ? (track.getCapabilities() as { torch?: boolean })
        : {};
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashlightOn } as MediaTrackConstraintSet],
        });
        setFlashlightOn((prev) => !prev);
      }
    } catch {
      // Torch unsupported on this device
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !missionRef.current) return;

    const decoded = await decodeQRFromImageFile(file);
    if (decoded) {
      handleDecodedQR(decoded);
    } else {
      setScanStatus('mismatch');
      setStatusMessage(
        isEn
          ? 'No readable QR code found in the selected image.'
          : 'Không tìm thấy mã QR hợp lệ trong ảnh vừa chọn.'
      );
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        if (!hasSucceededRef.current) {
          setScanStatus('scanning');
          setStatusMessage(null);
        }
      }, 2600);
    }
  };

  if (!mission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-4 sm:p-5 shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${scanStatus === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-800'
                }`}
            >
              {scanStatus === 'success' ? <CheckCircle2 size={18} /> : <Camera size={17} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {scanStatus === 'success'
                  ? isEn
                    ? 'Mission Completed!'
                    : 'Hoàn Thành Nhiệm Vụ!'
                  : isEn
                    ? 'Live Mission QR Scanner'
                    : 'Quét Camera Nhiệm Vụ Xanh'}
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold">
                {mission.categoryName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label={isEn ? 'Close' : 'Đóng'}
          >
            <X size={16} />
          </button>
        </div>

        {scanStatus === 'success' ? (
          /* COMPLETED VIEW: Camera is OFF + Success Summary + 2 Action Buttons */
          <div className="py-2 text-center animate-fadeIn">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#1E4D3E] text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 size={36} />
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-sm font-black text-[#1E4D3E] border border-emerald-200">
              <Sparkles size={15} className="text-amber-500" />
              <span>+{mission.points} CB</span>
            </div>

            <h4 className="mt-2.5 text-sm font-extrabold text-slate-900 px-2 leading-snug">
              {mission.title}
            </h4>

            <p className="mt-1 text-xs text-slate-500 leading-relaxed px-2">
              {statusMessage}
            </p>

            {typeof userPoints === 'number' && (
              <div className="mt-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  {isEn ? 'Updated CB Balance:' : 'Số dư điểm CB hiện tại:'}
                </span>
                <span className="text-sm font-black text-[#1E4D3E]">
                  {userPoints.toLocaleString()} CB
                </span>
              </div>
            )}

            {/* 2 Choice Buttons */}
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  if (onScanNext) {
                    onScanNext();
                  } else {
                    onClose();
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] py-3 text-xs font-bold text-white shadow-md hover:from-[#16392E] hover:to-[#225242] active:scale-98 transition-all"
              >
                <ScanLine size={15} className="text-emerald-300" />
                <span>
                  {isEn ? 'Scan Next Mission QR' : 'Quét mã làm nhiệm vụ tiếp'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  if (onNavigateHome) {
                    onNavigateHome();
                  } else {
                    onClose();
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 py-3 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-100 active:scale-98 transition-all"
              >
                <Home size={15} />
                <span>{isEn ? 'Done (Back to Home)' : 'Hoàn thành'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* LIVE SCANNING VIEW */
          <>
            {/* Mission Info Card */}
            <div className="rounded-2xl bg-emerald-50/80 p-3 border border-emerald-100 mb-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {mission.title}
                </h4>
                <span className="shrink-0 rounded-full bg-[#1E4D3E] px-2.5 py-0.5 text-xs font-extrabold text-white">
                  +{mission.points} CB
                </span>
              </div>
              {mission.subtitle && (
                <p className="mt-1 text-[11px] text-slate-600 leading-tight">
                  {mission.subtitle}
                </p>
              )}
              {mission.isPenalty && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span>
                    {isEn
                      ? 'Partner food-waste report applies a -5 CB penalty.'
                      : 'Nếu quán đối tác phản ánh lãng phí thức ăn sẽ bị trừ 5 CB.'}
                  </span>
                </div>
              )}
            </div>

            {/* Live Camera Viewfinder */}
            <div
              className={`relative mx-auto h-64 w-full overflow-hidden rounded-2xl bg-slate-950 border-2 shadow-inner transition-colors ${scanStatus === 'mismatch'
                  ? 'border-rose-500'
                  : 'border-emerald-500/70'
                }`}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`h-full w-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Active Camera Overlay: Target Box & Laser */}
              {cameraActive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-44 w-44 rounded-2xl border border-white/25 shadow-[0_0_0_9999px_rgba(0,0,0,0.42)]">
                    <div
                      className={`absolute -top-0.5 -left-0.5 h-6 w-6 rounded-tl-xl border-t-4 border-l-4 ${scanStatus === 'mismatch' ? 'border-rose-400' : 'border-emerald-400'
                        }`}
                    />
                    <div
                      className={`absolute -top-0.5 -right-0.5 h-6 w-6 rounded-tr-xl border-t-4 border-r-4 ${scanStatus === 'mismatch' ? 'border-rose-400' : 'border-emerald-400'
                        }`}
                    />
                    <div
                      className={`absolute -bottom-0.5 -left-0.5 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 ${scanStatus === 'mismatch' ? 'border-rose-400' : 'border-emerald-400'
                        }`}
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-br-xl border-b-4 border-r-4 ${scanStatus === 'mismatch' ? 'border-rose-400' : 'border-emerald-400'
                        }`}
                    />
                    <div className="absolute top-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
                  </div>
                </div>
              )}

              {/* Top Camera Controls (Flash & Flip) */}
              {cameraActive && (
                <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleFlashlight}
                    className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${flashlightOn
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    title={isEn ? 'Toggle Flashlight' : 'Bật/Tắt đèn Flash'}
                  >
                    <Flashlight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
                    title={isEn ? 'Flip Camera' : 'Đổi camera trước/sau'}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isStartingCamera && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white gap-2">
                  <QrCode size={32} className="text-emerald-400 animate-pulse" />
                  <p className="text-xs font-semibold text-emerald-200">
                    {isEn ? 'Opening live camera...' : 'Đang mở Camera quét mã...'}
                  </p>
                </div>
              )}

              {/* Camera Permission / Device Error */}
              {cameraError && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-5 text-center text-white">
                  <VideoOff size={32} className="text-amber-400 mb-2" />
                  <p className="text-xs text-slate-200 leading-relaxed">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-3 rounded-xl bg-emerald-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors"
                  >
                    {isEn ? 'Retry Camera' : 'Thử mở lại Camera'}
                  </button>
                </div>
              )}

              {/* Mismatch Warning Banner */}
              {scanStatus === 'mismatch' && statusMessage && (
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 rounded-xl bg-rose-600/95 px-3 py-2 text-[11px] font-bold text-white shadow-lg flex items-center gap-2 backdrop-blur-sm animate-fadeIn">
                  <XCircle size={16} className="shrink-0" />
                  <span className="leading-snug">{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Location Guidance */}
            <p className="mt-2.5 text-center text-[11px] text-slate-600 leading-relaxed px-1">
              📍{' '}
              {mission.qrInstruction ||
                (isEn
                  ? 'Point your camera directly at the partner QR code to verify and earn points.'
                  : 'Đưa camera vào mã QR thật tại điểm đối tác để xác thực và cộng điểm.')}
            </p>

            {/* Real QR Image Upload Fallback */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/60 py-2.5 text-xs font-bold text-[#1E4D3E] hover:bg-emerald-100/80 transition-colors"
              >
                <ImageUp size={15} />
                <span>
                  {isEn ? 'Scan from QR Image File' : 'Quét từ ảnh mã QR có sẵn'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
