import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spinner, SpinnerCategory, SpinnerOption, SpinResult, PageView } from '../types';
import { DEFAULT_SPINNERS, getColorForIndex } from '../data/defaultSpinners';
import { soundFX } from '../utils/audio';

interface SpinnerContextType {
  spinners: Spinner[];
  activeSpinnerId: string;
  activeSpinner: Spinner;
  history: SpinResult[];
  currentPage: PageView;
  isMuted: boolean;
  setCurrentPage: (page: PageView) => void;
  setActiveSpinnerId: (id: string) => void;
  createSpinner: (name: string, category: SpinnerCategory, initialOptions?: string[]) => string;
  updateSpinner: (spinner: Spinner) => void;
  deleteSpinner: (id: string) => void;
  duplicateSpinner: (id: string) => void;
  addOptions: (spinnerId: string, rawText: string) => void;
  editOption: (spinnerId: string, optionId: string, newText: string, color?: string) => void;
  deleteOption: (spinnerId: string, optionId: string) => void;
  toggleOption: (spinnerId: string, optionId: string) => void;
  reorderOptions: (spinnerId: string, fromIndex: number, toIndex: number) => void;
  clearOptions: (spinnerId: string) => void;
  recordSpin: (winner: { optionId: string; text: string; color: string }) => void;
  removeWinningOption: (spinnerId: string, optionId: string) => void;
  clearHistory: () => void;
  toggleSound: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  SPINNERS: 'spinit_spinners_v1',
  ACTIVE_ID: 'spinit_active_id_v1',
  HISTORY: 'spinit_history_v1',
};

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spinners, setSpinners] = useState<Spinner[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SPINNERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse spinners from storage:', e);
    }
    return DEFAULT_SPINNERS;
  });

  const [activeSpinnerId, setActiveSpinnerIdState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return spinners[0]?.id || DEFAULT_SPINNERS[0].id;
  });

  const [history, setHistory] = useState<SpinResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [currentPage, setCurrentPage] = useState<PageView>('spinner');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFX.isMuted());

  // Save spinners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPINNERS, JSON.stringify(spinners));
    } catch (e) {
      console.error('Error saving spinners:', e);
    }
  }, [spinners]);

  // Save active id
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeSpinnerId);
    } catch (e) {
      console.error('Error saving active id:', e);
    }
  }, [activeSpinnerId]);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }, [history]);

  // Current active spinner instance
  const activeSpinner =
    spinners.find((s) => s.id === activeSpinnerId) || spinners[0] || DEFAULT_SPINNERS[0];

  const setActiveSpinnerId = (id: string) => {
    setActiveSpinnerIdState(id);
  };

  const createSpinner = (
    name: string,
    category: SpinnerCategory,
    initialOptions?: string[]
  ): string => {
    const newId = `spinner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const parsedOptions: SpinnerOption[] = (initialOptions || []).map((text, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      text: text.trim(),
      color: getColorForIndex(idx),
      enabled: true,
    })).filter(opt => opt.text.length > 0);

    const newSpinner: Spinner = {
      id: newId,
      name: name.trim() || 'New Spinner',
      category: category || 'Custom',
      description: `Created on ${new Date().toLocaleDateString()}`,
      options: parsedOptions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      removeOnWin: false,
    };

    setSpinners((prev) => [newSpinner, ...prev]);
    setActiveSpinnerIdState(newId);
    return newId;
  };

  const updateSpinner = (updated: Spinner) => {
    setSpinners((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...updated, updatedAt: Date.now() } : s))
    );
  };

  const deleteSpinner = (id: string) => {
    setSpinners((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        return DEFAULT_SPINNERS;
      }
      return filtered;
    });

    if (activeSpinnerId === id) {
      const remaining = spinners.filter((s) => s.id !== id);
      setActiveSpinnerIdState(remaining[0]?.id || DEFAULT_SPINNERS[0].id);
    }
  };

  const duplicateSpinner = (id: string) => {
    const target = spinners.find((s) => s.id === id);
    if (!target) return;

    const copyId = `spinner-${Date.now()}`;
    const copy: Spinner = {
      ...target,
      id: copyId,
      name: `${target.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      options: target.options.map((opt, i) => ({
        ...opt,
        id: `opt-${Date.now()}-${i}`,
      })),
    };

    setSpinners((prev) => [copy, ...prev]);
    setActiveSpinnerIdState(copyId);
  };

  const addOptions = (spinnerId: string, rawText: string) => {
    if (!rawText.trim()) return;

    // Split on newlines OR commas, handle quotes or trim
    const items = rawText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (items.length === 0) return;

    setSpinners((prev) =>
      prev.map((s) => {
        if (s.id !== spinnerId) return s;
        const currentCount = s.options.length;
        const newOptions: SpinnerOption[] = items.map((text, i) => ({
          id: `opt-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
          text,
          color: getColorForIndex(currentCount + i),
          enabled: true,
        }));
        return {
          ...s,
          updatedAt: Date.now(),
          options: [...s.options, ...newOptions],
        };
      })
    );
  };

  const editOption = (spinnerId: string, optionId: string, newText: string, color?: string) => {
    setSpinners((prev) =>
      prev.map((s) => {
        if (s.id !== spinnerId) return s;
        return {
          ...s,
          updatedAt: Date.now(),
          options: s.options.map((opt) =>
            opt.id === optionId
              ? { ...opt, text: newText.trim() || opt.text, color: color || opt.color }
              : opt
          ),
        };
      })
    );
  };

  const deleteOption = (spinnerId: string, optionId: string) => {
    setSpinners((prev) =>
      prev.map((s) => {
        if (s.id !== spinnerId) return s;
        const newOpts = s.options.filter((opt) => opt.id !== optionId);
        // Refresh colors smoothly
        return {
          ...s,
          updatedAt: Date.now(),
          options: newOpts.map((opt, idx) => ({
            ...opt,
            color: opt.color || getColorForIndex(idx),
          })),
        };
      })
    );
  };

  const toggleOption = (spinnerId: string, optionId: string) => {
    setSpinners((prev) =>
      prev.map((s) => {
        if (s.id !== spinnerId) return s;
        return {
          ...s,
          updatedAt: Date.now(),
          options: s.options.map((opt) =>
            opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
          ),
        };
      })
    );
  };

  const reorderOptions = (spinnerId: string, fromIndex: number, toIndex: number) => {
    setSpinners((prev) =>
      prev.map((s) => {
        if (s.id !== spinnerId) return s;
        const opts = [...s.options];
        if (fromIndex < 0 || fromIndex >= opts.length || toIndex < 0 || toIndex >= opts.length) {
          return s;
        }
        const [moved] = opts.splice(fromIndex, 1);
        opts.splice(toIndex, 0, moved);
        return {
          ...s,
          updatedAt: Date.now(),
          options: opts,
        };
      })
    );
  };

  const clearOptions = (spinnerId: string) => {
    setSpinners((prev) =>
      prev.map((s) => (s.id === spinnerId ? { ...s, options: [], updatedAt: Date.now() } : s))
    );
  };

  const recordSpin = (winner: { optionId: string; text: string; color: string }) => {
    const result: SpinResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      spinnerId: activeSpinner.id,
      spinnerName: activeSpinner.name,
      winnerOptionId: winner.optionId,
      winnerText: winner.text,
      winnerColor: winner.color,
      timestamp: Date.now(),
    };

    setHistory((prev) => [result, ...prev].slice(0, 100)); // Keep last 100
  };

  const removeWinningOption = (spinnerId: string, optionId: string) => {
    deleteOption(spinnerId, optionId);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleSound = () => {
    const newState = soundFX.toggleMute();
    setIsMuted(newState);
  };

  const resetToDefaults = () => {
    setSpinners(DEFAULT_SPINNERS);
    setActiveSpinnerIdState(DEFAULT_SPINNERS[0].id);
    setHistory([]);
  };

  return (
    <SpinnerContext.Provider
      value={{
        spinners,
        activeSpinnerId,
        activeSpinner,
        history,
        currentPage,
        isMuted,
        setCurrentPage,
        setActiveSpinnerId,
        createSpinner,
        updateSpinner,
        deleteSpinner,
        duplicateSpinner,
        addOptions,
        editOption,
        deleteOption,
        toggleOption,
        reorderOptions,
        clearOptions,
        recordSpin,
        removeWinningOption,
        clearHistory,
        toggleSound,
        resetToDefaults,
      }}
    >
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinners = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinners must be used within a SpinnerProvider');
  }
  return context;
};
