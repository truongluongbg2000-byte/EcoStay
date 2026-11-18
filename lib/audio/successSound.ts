/**
 * Plays a gentle, crisp two-tone "check / tick" chime using the Web Audio API.
 * Requires zero external audio assets and safely no-ops if audio is unavailable.
 */
export function playSuccessTickSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: crisp soft tick (E5 - 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Tone 2: bright confirmation chime (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.075);
    gain2.gain.setValueAtTime(0.001, now + 0.075);
    gain2.gain.exponentialRampToValueAtTime(0.16, now + 0.095);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.075);
    osc2.stop(now + 0.25);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 350);
  } catch {
    // Ignore autoplay / audio context restrictions
  }
}
