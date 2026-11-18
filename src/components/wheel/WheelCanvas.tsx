import React, { useRef, useEffect, useCallback } from 'react';
import { SpinnerOption } from '../../types';
import { soundFX } from '../../utils/audio';

interface WheelCanvasProps {
  options: SpinnerOption[];
  isSpinning: boolean;
  onSpinEnd: (winner: SpinnerOption) => void;
  size?: number;
  triggerSpinRef?: React.MutableRefObject<(() => void) | null>;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  options,
  isSpinning,
  onSpinEnd,
  size = 560,
  triggerSpinRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Track continuous rotation angle in radians
  const rotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(5000);
  const startRotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const winningOptionRef = useRef<SpinnerOption | null>(null);
  const lastTickIndexRef = useRef<number>(-1);
  const isSpinningInternalRef = useRef<boolean>(false);

  // Filter only enabled options
  const activeOptions = options.filter((o) => o.enabled);

  // Draw the entire wheel onto the canvas
  const drawWheel = useCallback(
    (currentAngle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = size;
      const height = size;
      const cx = width / 2;
      const cy = height / 2;
      const radius = width / 2 - 24; // leave margin for outer rim and shadow

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (activeOptions.length === 0) {
        // Draw empty state placeholder
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#1e2235';
        ctx.fill();
        ctx.strokeStyle = '#3b4261';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No active options', cx, cy - 10);
        ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Enable or add options in Dashboard', cx, cy + 18);
        ctx.restore();
        return;
      }

      const numSegments = activeOptions.length;
      const sliceAngle = (2 * Math.PI) / numSegments;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow and rim shadow
      ctx.save();
      ctx.shadowColor = 'rgba(139, 92, 246, 0.35)';
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f111a';
      ctx.fill();
      ctx.restore();

      // Outer decorative bezel
      const rimGradient = ctx.createRadialGradient(0, 0, radius - 4, 0, 0, radius + 10);
      rimGradient.addColorStop(0, '#1e202e');
      rimGradient.addColorStop(0.5, '#2d334d');
      rimGradient.addColorStop(1, '#11131c');

      ctx.beginPath();
      ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
      ctx.fillStyle = rimGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer gold/neon studs
      const numStuds = Math.max(numSegments * 2, 16);
      for (let s = 0; s < numStuds; s++) {
        const studAngle = (s * 2 * Math.PI) / numStuds;
        const sx = (radius + 4) * Math.cos(studAngle);
        const sy = (radius + 4) * Math.sin(studAngle);
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Rotate wheel for current animation frame
      ctx.rotate(currentAngle);

      // Draw each segment slice
      for (let i = 0; i < numSegments; i++) {
        const opt = activeOptions[i];
        const startA = i * sliceAngle;
        const endA = startA + sliceAngle;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startA, endA);
        ctx.closePath();

        // Base color
        const baseColor = opt.color || '#8B5CF6';
        ctx.fillStyle = baseColor;
        ctx.fill();

        // Subtle gradient overlay for 3D depth
        const segGrad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        segGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        segGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.0)');
        segGrad.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
        ctx.fillStyle = segGrad;
        ctx.fill();

        // Segment divider line
        ctx.strokeStyle = 'rgba(10, 11, 16, 0.85)';
        ctx.lineWidth = numSegments > 30 ? 1.5 : 2.5;
        ctx.stroke();
        ctx.restore();

        // Draw text inside segment
        ctx.save();
        const midA = startA + sliceAngle / 2;
        ctx.rotate(midA);

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Dynamic text size based on segment count
        let fontSize = 16;
        if (numSegments <= 6) fontSize = 20;
        else if (numSegments <= 12) fontSize = 16;
        else if (numSegments <= 24) fontSize = 13;
        else if (numSegments <= 36) fontSize = 11;
        else fontSize = 9;

        ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;

        // Text clipping / formatting
        const maxTextWidth = radius * 0.65;
        let displayText = opt.text;
        if (ctx.measureText(displayText).width > maxTextWidth) {
          while (ctx.measureText(displayText + '…').width > maxTextWidth && displayText.length > 2) {
            displayText = displayText.slice(0, -1);
          }
          displayText += '…';
        }

        // Text shadow for high contrast
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = '#ffffff';

        // Position text along the slice radius
        const textDist = radius - 20;
        ctx.fillText(displayText, textDist, 0);

        ctx.restore();
      }

      // Center decorative ring background
      ctx.restore(); // restores back from wheel rotation

      // Fixed Center Hub (stays stationary, spins behind SPIN button)
      ctx.save();
      ctx.translate(cx, cy);

      // Hub Outer metallic ring
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, 2 * Math.PI);
      const hubGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 48);
      hubGrad.addColorStop(0, '#2d334d');
      hubGrad.addColorStop(0.8, '#151824');
      hubGrad.addColorStop(1, '#0b0c13');
      ctx.fillStyle = hubGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.restore();
    },
    [activeOptions, size]
  );

  // Resize canvas according to device pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    drawWheel(rotationRef.current);
  }, [size, drawWheel]);

  // Easing function: Quintic Ease-Out for dramatic slow down
  const easeOutQuint = (t: number): number => {
    return 1 - Math.pow(1 - t, 5);
  };

  // Perform spin animation
  const startSpin = useCallback(() => {
    if (isSpinningInternalRef.current || activeOptions.length < 2) return;

    isSpinningInternalRef.current = true;
    const numSegments = activeOptions.length;
    const sliceAngle = (2 * Math.PI) / numSegments;

    // Pick unbiased random winning index using crypto random or Math.random
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    const winningIndex = randomArray[0] % numSegments;
    const winner = activeOptions[winningIndex];
    winningOptionRef.current = winner;

    // Math pointer alignment:
    // Pointer is at the TOP (12 o'clock), which is 3*PI/2 (270 deg)
    const pointerAngle = (3 * Math.PI) / 2;

    // Inside winning segment, pick safe offset away from edges (20% to 80% of slice)
    const segmentInnerOffset = sliceAngle * (0.25 + 0.5 * Math.random());
    const targetLocalAngle = winningIndex * sliceAngle + segmentInnerOffset;

    // We want: (pointerAngle - targetRotation) % 2PI == targetLocalAngle % 2PI
    const currentRot = rotationRef.current;
    startRotationRef.current = currentRot;

    // Number of full spins (6 to 9 full spins for suspense)
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const baseRotations = fullSpins * 2 * Math.PI;

    // Calculate delta to land exactly on targetLocalAngle under pointer
    let angleDifference = (pointerAngle - targetLocalAngle - currentRot) % (2 * Math.PI);
    if (angleDifference < 0) {
      angleDifference += 2 * Math.PI;
    }

    const totalAngleChange = baseRotations + angleDifference;
    targetRotationRef.current = currentRot + totalAngleChange;

    spinDurationRef.current = 5200 + Math.random() * 600; // ~5.5 seconds
    spinStartTimeRef.current = performance.now();
    lastTickIndexRef.current = -1;

    // Animation frame step
    const animate = (currentTime: number) => {
      const elapsed = currentTime - spinStartTimeRef.current;
      const progress = Math.min(elapsed / spinDurationRef.current, 1);
      const easedProgress = easeOutQuint(progress);

      const currentAngle =
        startRotationRef.current +
        (targetRotationRef.current - startRotationRef.current) * easedProgress;

      rotationRef.current = currentAngle;
      drawWheel(currentAngle);

      // Sound tick detection:
      // Local angle currently under pointer:
      const currentPointerLocal = ((pointerAngle - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentSegmentUnderPointer = Math.floor(currentPointerLocal / sliceAngle);

      if (currentSegmentUnderPointer !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentSegmentUnderPointer;
        // Modulate tick pitch by remaining speed
        const speed = 1 - progress;
        soundFX.playTick(speed);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished!
        isSpinningInternalRef.current = false;
        soundFX.playWin();
        if (winningOptionRef.current) {
          onSpinEnd(winningOptionRef.current);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [activeOptions, drawWheel, onSpinEnd]);

  // Expose triggerSpin method via ref
  useEffect(() => {
    if (triggerSpinRef) {
      triggerSpinRef.current = startSpin;
    }
    return () => {
      if (triggerSpinRef) {
        triggerSpinRef.current = null;
      }
    };
  }, [triggerSpinRef, startSpin]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {/* Pointer fixed at TOP (12 o'clock) pointing downwards */}
      <div 
        className="absolute -top-4 z-20 flex flex-col items-center pointer-events-none"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 12px rgba(244, 63, 94, 0.6))',
        }}
      >
        <div className="w-8 h-10 relative">
          <svg viewBox="0 0 32 40" className="w-full h-full fill-rose-500 stroke-rose-300 stroke-1">
            <path d="M 16 38 L 4 10 C 4 4 28 4 28 10 Z" />
            <circle cx="16" cy="14" r="4" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* The HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-pointer transition-transform duration-200"
        onClick={() => {
          if (!isSpinning && !isSpinningInternalRef.current && activeOptions.length >= 2) {
            startSpin();
          }
        }}
        title={activeOptions.length >= 2 ? 'Click to Spin!' : 'Add at least 2 options'}
      />

      {/* Prominent Center SPIN button */}
      <div className="absolute z-10">
        <button
          onClick={startSpin}
          disabled={isSpinning || isSpinningInternalRef.current || activeOptions.length < 2}
          aria-label="Spin the wheel"
          className={`
            relative group flex items-center justify-center
            w-20 h-20 rounded-full font-extrabold text-sm tracking-wider uppercase
            transition-all duration-300 transform
            ${
              isSpinning || isSpinningInternalRef.current || activeOptions.length < 2
                ? 'opacity-80 cursor-not-allowed bg-slate-800 text-slate-500 scale-95 border border-slate-700'
                : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-xl hover:scale-105 active:scale-95 border-2 border-white/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]'
            }
          `}
        >
          <span className="relative z-10 drop-shadow-md">
            {isSpinning || isSpinningInternalRef.current ? '...' : 'SPIN'}
          </span>
          {/* Subtle pulse ring when ready */}
          {!isSpinning && !isSpinningInternalRef.current && activeOptions.length >= 2 && (
            <span className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping pointer-events-none" />
          )}
        </button>
      </div>
    </div>
  );
};
