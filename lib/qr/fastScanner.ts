import jsQR from 'jsqr';

interface NativeBarcodeResult {
  rawValue: string;
}

interface NativeBarcodeDetector {
  detect(source: HTMLVideoElement | HTMLCanvasElement | ImageBitmap): Promise<NativeBarcodeResult[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats?: string[] }) => NativeBarcodeDetector;
  }
}

export interface FastQRScannerController {
  start: () => void;
  stop: () => void;
}

/**
 * Creates a high-speed QR scanner loop for a live <video> element:
 * - Tier 1: Uses native hardware-accelerated `BarcodeDetector` when supported (~15-40ms).
 * - Tier 2: Uses center-cropped, downscaled (360x360) canvas + `jsQR` (~80-200ms) without
 *   re-allocating canvas buffers or blocking the React main thread.
 */
export function createFastVideoQRScanner(params: {
  video: HTMLVideoElement;
  onDetect: (code: string) => void;
  intervalMs?: number;
}): FastQRScannerController {
  const { video, onDetect, intervalMs = 80 } = params;

  let running = false;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let frameCounter = 0;

  // Initialize native hardware detector if supported by browser (Chrome Android, Edge, etc.)
  let nativeDetector: NativeBarcodeDetector | null = null;
  if (typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function') {
    try {
      nativeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch {
      nativeDetector = null;
    }
  }

  // Reusable fixed-size offscreen canvas (never re-allocated per frame!)
  const SCAN_SIZE = 384;
  const offscreenCanvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (offscreenCanvas) {
    offscreenCanvas.width = SCAN_SIZE;
    offscreenCanvas.height = SCAN_SIZE;
  }
  const offscreenCtx = offscreenCanvas
    ? offscreenCanvas.getContext('2d', { willReadFrequently: true })
    : null;

  const scheduleNext = () => {
    if (!running) return;
    timerId = setTimeout(tick, intervalMs);
  };

  const tick = async () => {
    if (!running) return;

    if (video.readyState < video.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0) {
      scheduleNext();
      return;
    }

    // Tier 1: Hardware-accelerated BarcodeDetector directly on <video>
    if (nativeDetector) {
      try {
        const barcodes = await nativeDetector.detect(video);
        if (!running) return;
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          onDetect(barcodes[0].rawValue);
          if (!running) return;
        }
        scheduleNext();
        return;
      } catch {
        // Fallback smoothly to jsQR if native detector fails on this device
        nativeDetector = null;
      }
    }

    // Tier 2: Optimized Center-Cropped + Downscaled jsQR
    if (offscreenCtx) {
      frameCounter += 1;
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // Alternate between tight center crop (75% of short side) and full-frame square every 4th frame
      const useFullSquare = frameCounter % 4 === 0;
      const cropSide = useFullSquare ? Math.min(vw, vh) : Math.round(Math.min(vw, vh) * 0.78);
      const sx = Math.round((vw - cropSide) / 2);
      const sy = Math.round((vh - cropSide) / 2);

      offscreenCtx.drawImage(video, sx, sy, cropSide, cropSide, 0, 0, SCAN_SIZE, SCAN_SIZE);
      const imageData = offscreenCtx.getImageData(0, 0, SCAN_SIZE, SCAN_SIZE);

      // Fast non-inverted scan most frames (2x faster); attemptBoth every 5th frame for dark-bg QR codes
      const inversionAttempts = frameCounter % 5 === 0 ? 'attemptBoth' : 'dontInvert';

      const result = jsQR(imageData.data, SCAN_SIZE, SCAN_SIZE, {
        inversionAttempts,
      });

      if (result && result.data) {
        onDetect(result.data);
        if (!running) return;
      }
    }

    scheduleNext();
  };

  return {
    start: () => {
      if (running) return;
      running = true;
      frameCounter = 0;
      tick();
    },
    stop: () => {
      running = false;
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Enable continuous autofocus on a video track when supported by mobile cameras.
 */
export async function tryEnableContinuousFocus(stream: MediaStream): Promise<void> {
  const track = stream.getVideoTracks()[0];
  if (!track || typeof track.getCapabilities !== 'function') return;

  try {
    const caps = track.getCapabilities() as { focusMode?: string[] };
    if (Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
      await track.applyConstraints({
        advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
      });
    }
  } catch {
    // Ignore if device/browser does not support focusMode constraint
  }
}

/**
 * Fast QR decoder for uploaded image files: scales large phone photos (e.g. 4000x3000)
 * down to max 800px before decoding with native BarcodeDetector or jsQR.
 */
export function decodeQRFromImageFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = async () => {
      try {
        const MAX_DIM = 800;
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);

        // Try native hardware detector first
        if (typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function') {
          try {
            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(canvas);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              resolve(barcodes[0].rawValue);
              return;
            }
          } catch {
            // Fall through to jsQR
          }
        }

        const imageData = ctx.getImageData(0, 0, w, h);
        const code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
        resolve(code?.data || null);
      } finally {
        URL.revokeObjectURL(imgUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(imgUrl);
      resolve(null);
    };

    img.src = imgUrl;
  });
}
