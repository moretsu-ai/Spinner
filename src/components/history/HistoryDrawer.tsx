import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, X, Clock, Award, Filter } from 'lucide-react';
import { useSpinners } from '../../context/SpinnerContext';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const { history, clearHistory, activeSpinner } = useSpinners();
  const [filterCurrentOnly, setFilterCurrentOnly] = useState(false);

  const displayedHistory = filterCurrentOnly
    ? history.filter((h) => h.spinnerId === activeSpinner.id)
    : history;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-screen max-w-md bg-[#11131c] border-l border-white/10 p-6 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <History size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">Spin History</h2>
                    <p className="text-xs text-slate-400">
                      {displayedHistory.length} recorded {displayedHistory.length === 1 ? 'spin' : 'spins'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter controls */}
              <div className="flex items-center justify-between py-3">
                <button
                  onClick={() => setFilterCurrentOnly(!filterCurrentOnly)}
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all ${
                    filterCurrentOnly
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Filter size={13} />
                  {filterCurrentOnly ? 'Showing: Current Spinner' : 'Showing: All Spinners'}
                </button>

                {history.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all spin history?')) {
                        clearHistory();
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-1.5 px-2.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                    Clear History
                  </button>
                )}
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-2">
                {displayedHistory.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Clock size={36} className="mb-2 stroke-1 text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">No spins recorded yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Give the wheel a spin to see your decision trail here!
                    </p>
                  </div>
                ) : (
                  displayedHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white shadow-sm"
                          style={{
                            backgroundColor: item.winnerColor || '#8B5CF6',
                          }}
                        >
                          <Award size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
                            {item.winnerText}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {item.spinnerName}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
