import React from 'react';
import { WheelCanvas } from '../wheel/WheelCanvas';
import { SpinnerOption } from '../../types';
import { Play, Sparkles } from 'lucide-react';

interface MiniSpinnerPreviewProps {
  options: SpinnerOption[];
  spinnerName: string;
  onLaunchFullSpinner: () => void;
}

export const MiniSpinnerPreview: React.FC<MiniSpinnerPreviewProps> = ({
  options,
  spinnerName,
  onLaunchFullSpinner,
}) => {
  const activeOptions = options.filter((o) => o.enabled);

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col items-center border border-white/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Sparkles size={15} className="text-purple-400" />
            Live Preview
          </h3>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">{spinnerName}</p>
        </div>

        <button
          onClick={onLaunchFullSpinner}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Play size={13} fill="currentColor" />
          <span>Go to Spin</span>
        </button>
      </div>

      {/* The Mini Canvas Wheel */}
      <div className="my-2 transform scale-90 sm:scale-100 transition-transform">
        <WheelCanvas
          options={options}
          isSpinning={false}
          onSpinEnd={() => {}}
          size={320}
        />
      </div>

      {/* Status info */}
      <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>{activeOptions.length} active slice{activeOptions.length === 1 ? '' : 's'}</span>
        <span className="text-purple-300 font-medium">Click center or slice to test</span>
      </div>
    </div>
  );
};

