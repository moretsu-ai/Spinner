import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Volume2,
  VolumeX,
  History,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import { useSpinners } from '../context/SpinnerContext';
import { WheelCanvas } from '../components/wheel/WheelCanvas';
import { WinModal } from '../components/wheel/WinModal';
import { SpinnerOption } from '../types';

interface SpinnerPageProps {
  onOpenHistory: () => void;
}

export const SpinnerPage: React.FC<SpinnerPageProps> = ({ onOpenHistory }) => {
  const {
    activeSpinner,
    spinners,
    setActiveSpinnerId,
    setCurrentPage,
    toggleOption,
    deleteOption,
    recordSpin,
    isMuted,
    toggleSound,
    history,
  } = useSpinners();

  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<SpinnerOption | null>(null);
  const [wheelSize, setWheelSize] = useState(540);
  const [showOptionsTray, setShowOptionsTray] = useState(false);
  const [autoRemoveWin, setAutoRemoveWin] = useState(activeSpinner.removeOnWin || false);

  const triggerSpinRef = useRef<(() => void) | null>(null);

  // Responsive wheel sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const availableSpace = Math.min(width - 32, height - 260);

      if (availableSpace < 380) {
        setWheelSize(330);
      } else if (availableSpace < 480) {
        setWheelSize(390);
      } else if (availableSpace < 600) {
        setWheelSize(470);
      } else {
        setWheelSize(540);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !winnerModalOpen && !isSpinning) {
        // Prevent default spacebar scrolling
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          if (triggerSpinRef.current) {
            triggerSpinRef.current();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [winnerModalOpen, isSpinning]);

  const activeCount = activeSpinner.options.filter((o) => o.enabled).length;
  const totalCount = activeSpinner.options.length;

  const handleSpinEnd = (winner: SpinnerOption) => {
    setIsSpinning(false);
    setCurrentWinner(winner);
    setWinnerModalOpen(true);

    recordSpin({
      optionId: winner.id,
      text: winner.text,
      color: winner.color || '#8B5CF6',
    });

    if (autoRemoveWin) {
      deleteOption(activeSpinner.id, winner.id);
    }
  };

  const handleSpinAgain = () => {
    setWinnerModalOpen(false);
    setCurrentWinner(null);
    setTimeout(() => {
      if (triggerSpinRef.current) {
        triggerSpinRef.current();
      }
    }, 200);
  };

  const handleRemoveAndSpinAgain = (optionId: string) => {
    deleteOption(activeSpinner.id, optionId);
    setWinnerModalOpen(false);
    setCurrentWinner(null);
    setTimeout(() => {
      if (triggerSpinRef.current) {
        triggerSpinRef.current();
      }
    }, 250);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Top Bar / Header of Main Experience */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 glass-panel py-3 px-5 rounded-2xl mb-4">
        {/* Spinner Selector & Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeSpinner.id}
              onChange={(e) => setActiveSpinnerId(e.target.value)}
              className="appearance-none bg-slate-900/90 border border-white/10 hover:border-purple-500/50 text-white font-bold text-sm sm:text-base py-2 pl-3.5 pr-9 rounded-xl cursor-pointer focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            >
              {spinners.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
            />
          </div>

          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {activeSpinner.category}
          </span>
        </div>

        {/* Status & Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active options badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              activeCount < 2
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}
          >
            {activeCount < 2 ? (
              <AlertCircle size={14} className="text-rose-400" />
            ) : (
              <Check size={14} className="text-emerald-400" />
            )}
            <span>
              {activeCount} of {totalCount} active
            </span>
          </div>

          {/* Toggle Options Quick Tray */}
          <button
            onClick={() => setShowOptionsTray(!showOptionsTray)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showOptionsTray
                ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle quick options list"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Options Tray</span>
          </button>

          {/* Edit in Dashboard */}
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-white transition-all shadow-sm"
          >
            <span>Edit Spinner</span>
          </button>
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 relative w-full">
        {activeCount < 2 ? (
          <div className="glass-panel p-8 rounded-3xl max-w-md text-center border-rose-500/30 my-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertCircle size={30} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Need at least 2 active options</h3>
            <p className="text-sm text-slate-400 mb-6">
              You currently have {activeCount} active options in &ldquo;{activeSpinner.name}&rdquo;.
              Enable disabled options or add new ones in the Dashboard.
            </p>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="py-2.5 px-6 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all"
            >
              Open Dashboard to Add Options
            </button>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            {/* The Wheel */}
            <WheelCanvas
              options={activeSpinner.options}
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
              size={wheelSize}
              triggerSpinRef={triggerSpinRef}
            />

            {/* Instruction tooltip below wheel */}
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-medium">
              <span>Press</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-mono shadow-sm">
                SPACE
              </kbd>
              <span>or click the center button to spin</span>
            </p>
          </div>
        )}
      </div>

      {/* Quick Options Tray Drawer (Collapsible bottom bar) */}
      {showOptionsTray && (
        <div className="w-full max-w-4xl glass-panel p-4 rounded-2xl border border-white/10 mt-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-200">
                Quick Toggle Active Options
              </span>
              <span className="text-xs text-slate-400">
                (Click an item to include/exclude without deleting)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRemoveWin}
                  onChange={(e) => setAutoRemoveWin(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Auto-remove winner</span>
              </label>

              <button
                onClick={() => setCurrentPage('dashboard')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <Plus size={13} />
                Manage in Dashboard
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
            {activeSpinner.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleOption(activeSpinner.id, opt.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  opt.enabled
                    ? 'bg-slate-900/90 text-slate-200 border-white/10 hover:border-purple-500/50'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800 line-through opacity-60'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: opt.enabled ? opt.color || '#8B5CF6' : '#64748b' }}
                />
                <span className="truncate max-w-[140px]">{opt.text}</span>
                {opt.enabled ? (
                  <Eye size={12} className="text-slate-400" />
                ) : (
                  <EyeOff size={12} className="text-slate-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Stats and Quick Controls Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          <span>
            Spinner: <strong className="text-slate-200">{activeSpinner.name}</strong>
          </span>
          <span className="hidden sm:inline">
            Category: <strong className="text-slate-200">{activeSpinner.category}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          >
            <History size={14} />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Winner Modal */}
      <WinModal
        isOpen={winnerModalOpen}
        winner={currentWinner}
        spinnerName={activeSpinner.name}
        onClose={() => setWinnerModalOpen(false)}
        onSpinAgain={handleSpinAgain}
        onRemoveAndSpinAgain={handleRemoveAndSpinAgain}
      />
    </div>
  );
};
