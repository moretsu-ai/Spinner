import React from 'react';
import {
  Compass,
  LayoutDashboard,
  Volume2,
  VolumeX,
  History,
  Maximize2,
  Minimize2,
  ChevronDown,
} from 'lucide-react';
import { useSpinners } from '../../context/SpinnerContext';

interface NavbarProps {
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory }) => {
  const {
    currentPage,
    setCurrentPage,
    spinners,
    activeSpinnerId,
    setActiveSpinnerId,
    isMuted,
    toggleSound,
    history,
  } = useSpinners();

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090a0f]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentPage('spinner')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Compass size={20} className="group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                SpinIt
              </span>
              <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider -mt-1 hidden sm:inline">
                Decision Spinner
              </span>
            </div>
          </button>

          {/* Quick Spinner Switcher */}
          <div className="relative hidden md:block">
            <select
              value={activeSpinnerId}
              onChange={(e) => setActiveSpinnerId(e.target.value)}
              className="appearance-none bg-slate-900/80 border border-white/10 text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl cursor-pointer hover:border-purple-500/40 focus:outline-none focus:border-purple-500 transition-colors"
            >
              {spinners.map((sp) => (
                <option key={sp.id} value={sp.id} className="bg-slate-900 text-slate-200">
                  {sp.name} ({sp.options.filter((o) => o.enabled).length}/{sp.options.length})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Center: Main Nav Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setCurrentPage('spinner')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'spinner'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Compass size={15} />
            <span>Spin Wheel</span>
          </button>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Right: Quick Tools (Sound, History, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={isMuted ? 'Sound muted (click to unmute)' : 'Sound enabled (click to mute)'}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
              isMuted
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-purple-600/15 border-purple-500/30 text-purple-300 hover:bg-purple-600/25'
            }`}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            title="Spin History"
            className="relative p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/30 transition-colors"
          >
            <History size={17} />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm">
                {history.length > 99 ? '99+' : history.length}
              </span>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/30 transition-colors hidden sm:inline-flex"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};

