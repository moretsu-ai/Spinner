import React, { useState } from 'react';
import { SpinnerProvider, useSpinners } from './context/SpinnerContext';
import { Navbar } from './components/common/Navbar';
import { SpinnerPage } from './pages/SpinnerPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryDrawer } from './components/history/HistoryDrawer';

const AppContent: React.FC = () => {
  const { currentPage } = useSpinners();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* Main Page Area */}
      <main className="flex-1">
        {currentPage === 'spinner' ? (
          <SpinnerPage onOpenHistory={() => setIsHistoryOpen(true)} />
        ) : (
          <DashboardPage />
        )}
      </main>

      {/* History Slide-out Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-400">SpinIt</strong> – Unbiased Decision Spinner with Real-time Physics & Audio
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Instant Local Storage</span>
            <span>•</span>
            <span>Supports 2 to 50+ Options</span>
            <span>•</span>
            <span>Offline Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SpinnerProvider>
      <AppContent />
    </SpinnerProvider>
  );
};

export default App;

