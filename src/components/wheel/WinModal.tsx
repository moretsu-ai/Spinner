import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCw, Trash2, X, Sparkles } from 'lucide-react';
import { SpinnerOption } from '../../types';

interface WinModalProps {
  isOpen: boolean;
  winner: SpinnerOption | null;
  spinnerName: string;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveAndSpinAgain: (optionId: string) => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  winner,
  spinnerName,
  onClose,
  onSpinAgain,
  onRemoveAndSpinAgain,
}) => {
  // Trigger multi-stage vibrant confetti fireworks when modal opens
  useEffect(() => {
    if (isOpen && winner) {
      // Immediate center burst
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: [winner.color || '#8B5CF6', '#06B6D4', '#F59E0B', '#EC4899', '#10B981'],
        disableForReducedMotion: true,
      });

      // Left cannon
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#8B5CF6', '#3B82F6', '#10B981'],
        });
      }, 200);

      // Right cannon
      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#EC4899', '#F97316', '#F59E0B'],
        });
      }, 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#11131c] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
          style={{
            boxShadow: `0 0 50px -10px ${winner.color || '#8B5CF6'}40, 0 25px 50px -12px rgba(0, 0, 0, 0.9)`,
          }}
        >
          {/* Top colored highlight line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: winner.color || '#8B5CF6' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            {/* Trophy badge */}
            <div className="relative mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: `${winner.color || '#8B5CF6'}22`,
                  border: `2px solid ${winner.color || '#8B5CF6'}66`,
                }}
              >
                <Trophy size={40} style={{ color: winner.color || '#8B5CF6' }} />
              </div>
              <div className="absolute -top-2 -right-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black text-xs font-bold shadow-md animate-bounce">
                  <Sparkles size={14} />
                </span>
              </div>
            </div>

            {/* Spinner name context */}
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
              Result for &ldquo;{spinnerName}&rdquo;
            </span>

            <h3 className="text-sm text-slate-300 font-medium mb-3">
              The wheel has spoken!
            </h3>

            {/* Winning Option Display */}
            <div
              className="w-full py-5 px-6 rounded-2xl my-2 border flex items-center justify-center shadow-inner relative overflow-hidden"
              style={{
                backgroundColor: `${winner.color || '#8B5CF6'}18`,
                borderColor: `${winner.color || '#8B5CF6'}44`,
              }}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  background: `radial-gradient(circle at center, ${winner.color || '#8B5CF6'}, transparent 70%)`,
                }}
              />
              <span className="relative text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-words text-center">
                {winner.text}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-6">
              Saved to your spin history.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onSpinAgain}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <RotateCw size={17} className="animate-spin-slow" />
                Spin Again
              </button>

              <button
                onClick={() => onRemoveAndSpinAgain(winner.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-medium text-sm bg-slate-800/80 hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                title="Remove this winning option and immediately spin again"
              >
                <Trash2 size={16} />
                Remove & Spin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
