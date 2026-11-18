// Web Audio API synthesizer for realistic spinner sound effects (offline, zero-latency)

class SoundFX {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastTickTime: number = 0;

  constructor() {
    const saved = localStorage.getItem('spinit_sound_muted');
    this.muted = saved === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('spinit_sound_muted', String(this.muted));
    return this.muted;
  }

  public setMute(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('spinit_sound_muted', String(this.muted));
  }

  /**
   * Play realistic pointer mechanical tick
   * Pitch slightly modulates according to rotation speed
   */
  public playTick(speedFactor: number = 1) {
    if (this.muted) return;
    const now = performance.now();
    // Throttle high-frequency clicks so audio doesn't glitch on high speeds
    if (now - this.lastTickTime < 35) return;
    this.lastTickTime = now;

    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime;
      // High click tone tapering down quickly
      const baseFreq = 700 + Math.min(speedFactor * 300, 600);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(180, startTime + 0.035);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.04);
    } catch {
      // AudioContext may be blocked before first user gesture
    }
  }

  /**
   * Play celebratory winner fanfare arpeggio
   */
  public playWin() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      const startTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStart = startTime + idx * 0.09;
        const noteDuration = idx === notes.length - 1 ? 0.6 : 0.2;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.05);
      });
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFX();
