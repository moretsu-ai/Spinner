import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ListPlus,
  RotateCcw,
} from 'lucide-react';
import { useSpinners } from '../context/SpinnerContext';
import { SpinnerCategory, SpinnerOption } from '../types';
import { PALETTES } from '../data/defaultSpinners';
import { MiniSpinnerPreview } from '../components/dashboard/MiniSpinnerPreview';

const CATEGORIES: SpinnerCategory[] = [
  'Subjects',
  'Units',
  'Chapters',
  'Topics',
  'Objects',
  'Activities',
  'Custom',
];

export const DashboardPage: React.FC = () => {
  const {
    spinners,
    activeSpinner,
    activeSpinnerId,
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
    setCurrentPage,
    resetToDefaults,
  } = useSpinners();

  // Create Spinner Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpinnerName, setNewSpinnerName] = useState('');
  const [newSpinnerCat, setNewSpinnerCat] = useState<SpinnerCategory>('Subjects');
  const [newSpinnerInitialOptions, setNewSpinnerInitialOptions] = useState('');

  // Add Option Input
  const [singleOptionInput, setSingleOptionInput] = useState('');
  const [batchOptionsInput, setBatchOptionsInput] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Editing individual option
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [showColorPickerForId, setShowColorPickerForId] = useState<string | null>(null);

  // Spinner Name inline editing
  const [isEditingSpinnerName, setIsEditingSpinnerName] = useState(false);
  const [tempSpinnerName, setTempSpinnerName] = useState(activeSpinner.name);

  const activeCount = activeSpinner.options.filter((o) => o.enabled).length;
  const totalCount = activeSpinner.options.length;

  const handleCreateSpinner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpinnerName.trim()) return;

    const initialOpts = newSpinnerInitialOptions
      ? newSpinnerInitialOptions.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : undefined;

    createSpinner(newSpinnerName, newSpinnerCat, initialOpts);
    setNewSpinnerName('');
    setNewSpinnerInitialOptions('');
    setShowCreateModal(false);
  };

  const handleAddSingleOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleOptionInput.trim()) return;
    addOptions(activeSpinner.id, singleOptionInput.trim());
    setSingleOptionInput('');
  };

  const handleAddBatchOptions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchOptionsInput.trim()) return;
    addOptions(activeSpinner.id, batchOptionsInput);
    setBatchOptionsInput('');
    setShowBatchModal(false);
  };

  const handleSaveSpinnerName = () => {
    if (tempSpinnerName.trim()) {
      updateSpinner({
        ...activeSpinner,
        name: tempSpinnerName.trim(),
      });
    }
    setIsEditingSpinnerName(false);
  };

  const startEditOption = (opt: SpinnerOption) => {
    setEditingOptionId(opt.id);
    setEditingText(opt.text);
    setEditingColor(opt.color || '#8B5CF6');
  };

  const saveEditOption = (optId: string) => {
    if (editingText.trim()) {
      editOption(activeSpinner.id, optId, editingText.trim(), editingColor);
    }
    setEditingOptionId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spinner Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {spinners.length} Saved
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Create, configure, and customize wheels. Changes reflect live on the wheel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <FolderPlus size={16} />
            <span>Create New Spinner</span>
          </button>

          <button
            onClick={() => setCurrentPage('spinner')}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all hover:border-purple-500/40"
          >
            <span>Launch Spinner</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebars & Main Content & Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Saved Spinners List (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Your Spinners
              </span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1 rounded-lg hover:bg-white/10 text-purple-400 transition-colors"
                title="Create Spinner"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {spinners.map((sp) => {
                const isActive = sp.id === activeSpinnerId;
                const actCount = sp.options.filter((o) => o.enabled).length;

                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      setActiveSpinnerId(sp.id);
                      setTempSpinnerName(sp.name);
                    }}
                    className={`p-3 rounded-xl cursor-pointer border transition-all text-left flex items-center justify-between gap-2 group ${
                      isActive
                        ? 'bg-purple-600/15 border-purple-500/50 text-white shadow-sm'
                        : 'bg-slate-900/60 border-transparent hover:border-white/10 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate group-hover:text-purple-300 transition-colors">
                        {sp.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {sp.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {actCount} options
                        </span>
                      </div>
                    </div>

                    {/* Quick duplicate / delete buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSpinner(sp.id);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      {spinners.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete spinner "${sp.name}"?`)) {
                              deleteSpinner(sp.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset to Sample Presets Button */}
            <div className="pt-4 mt-3 border-t border-white/10">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Reset all spinners to the default sample presets? (Your custom spinners will be replaced)'
                    )
                  ) {
                    resetToDefaults();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors border border-dashed border-white/10"
              >
                <RotateCcw size={13} />
                <span>Restore Sample Spinners</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Active Spinner Editor (6 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Spinner Meta Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            {/* Header: Name and Category */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                {isEditingSpinnerName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={tempSpinnerName}
                      onChange={(e) => setTempSpinnerName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveSpinnerName()}
                      autoFocus
                      className="flex-1 bg-slate-900 border border-purple-500 rounded-xl px-3 py-1.5 text-base font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSaveSpinnerName}
                      className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setIsEditingSpinnerName(false)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <h2 className="text-xl font-extrabold text-white truncate">
                      {activeSpinner.name}
                    </h2>
                    <button
                      onClick={() => {
                        setTempSpinnerName(activeSpinner.name);
                        setIsEditingSpinnerName(true);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Edit Name"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {activeCount} / {totalCount} Active
                  </span>
                </div>
              </div>

              {/* Category Picker & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Category:</span>
                  <select
                    value={activeSpinner.category}
                    onChange={(e) =>
                      updateSpinner({
                        ...activeSpinner,
                        category: e.target.value as SpinnerCategory,
                      })
                    }
                    className="bg-slate-900/90 border border-white/10 text-slate-200 text-xs font-bold py-1 px-2.5 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {/* Duplicate */}
                  <button
                    onClick={() => duplicateSpinner(activeSpinner.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
                    title="Duplicate Spinner"
                  >
                    <Copy size={13} />
                    <span>Duplicate</span>
                  </button>

                  {/* Clear All Options */}
                  {activeSpinner.options.length > 0 && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to clear all ${activeSpinner.options.length} options from "${activeSpinner.name}"?`
                          )
                        ) {
                          clearOptions(activeSpinner.id);
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 py-1 px-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Clear All Options"
                    >
                      <Trash2 size={13} />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add Option Inputs */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Add Options
            </span>

            {/* Single input with Add button */}
            <form onSubmit={handleAddSingleOption} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter option (e.g. Mathematics, Chapter 3, Task A)..."
                value={singleOptionInput}
                onChange={(e) => setSingleOptionInput(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-white/10 focus:border-purple-500 text-sm rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!singleOptionInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-all shadow-md shadow-purple-600/20"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </form>

            {/* Quick Bulk Import Button */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-500">
                Tip: Add comma-separated or multi-line options at once
              </p>
              <button
                type="button"
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold py-1 px-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
              >
                <ListPlus size={13} />
                <span>Bulk Add Options</span>
              </button>
            </div>
          </div>

          {/* Options Management List */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Options List
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {totalCount} total
                </span>
              </div>

              {totalCount > 1 && (
                <span className="text-[11px] text-slate-500">
                  Use arrows to reorder
                </span>
              )}
            </div>

            {totalCount === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
                <Layers size={36} className="mb-2 stroke-1 text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">No options yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Add items using the input above or use Bulk Add to paste multiple items.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {activeSpinner.options.map((opt, index) => {
                  const isEditing = editingOptionId === opt.id;
                  const isColorPickerOpen = showColorPickerForId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        opt.enabled
                          ? 'bg-slate-900/70 border-white/5 hover:border-white/15'
                          : 'bg-slate-950/50 border-slate-900 opacity-60'
                      }`}
                    >
                      {/* Left: Reorder arrows & color dot & option text */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Reorder controls */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={index === 0}
                            onClick={() => reorderOptions(activeSpinner.id, index, index - 1)}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            disabled={index === totalCount - 1}
                            onClick={() => reorderOptions(activeSpinner.id, index, index + 1)}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>

                        {/* Color Swatch / Picker Trigger */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowColorPickerForId(isColorPickerOpen ? null : opt.id)
                            }
                            className="w-5 h-5 rounded-full border border-white/20 shadow-sm flex-shrink-0 transition-transform hover:scale-110"
                            style={{ backgroundColor: opt.color || '#8B5CF6' }}
                            title="Click to change color"
                          />

                          {/* Quick Color Picker Popup */}
                          {isColorPickerOpen && (
                            <div className="absolute left-0 top-7 z-30 p-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl grid grid-cols-4 gap-1.5 w-36">
                              {PALETTES.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => {
                                    editOption(activeSpinner.id, opt.id, opt.text, color);
                                    setShowColorPickerForId(null);
                                  }}
                                  className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Option Text or Input Field */}
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditOption(opt.id)}
                              autoFocus
                              className="flex-1 bg-slate-800 border border-purple-500 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                            />
                            <button
                              onClick={() => saveEditOption(opt.id)}
                              className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingOptionId(null)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => startEditOption(opt)}
                            className={`font-semibold text-xs sm:text-sm truncate cursor-pointer hover:text-purple-300 transition-colors ${
                              opt.enabled ? 'text-slate-200' : 'text-slate-500 line-through'
                            }`}
                            title="Click to edit text"
                          >
                            {opt.text}
                          </span>
                        )}
                      </div>

                      {/* Right: Toggle enable & Edit & Delete */}
                      <div className="flex items-center gap-1">
                        {/* Toggle active / excluded */}
                        <button
                          onClick={() => toggleOption(activeSpinner.id, opt.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            opt.enabled
                              ? 'text-slate-400 hover:text-white hover:bg-white/10'
                              : 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                          }`}
                          title={opt.enabled ? 'Exclude from spinner' : 'Include in spinner'}
                        >
                          {opt.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>

                        {/* Edit text */}
                        {!isEditing && (
                          <button
                            onClick={() => startEditOption(opt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => deleteOption(activeSpinner.id, opt.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete option"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Wheel Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <MiniSpinnerPreview
            options={activeSpinner.options}
            spinnerName={activeSpinner.name}
            onLaunchFullSpinner={() => setCurrentPage('spinner')}
          />

          {/* Quick Presets / Suggestion Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Quick Suggestions
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Click to instantly append popular option packs into this spinner:
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  addOptions(
                    activeSpinner.id,
                    'Mathematics, Physics, Chemistry, Computer Science, English, History'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 transition-all text-xs font-medium text-slate-300 hover:text-white"
              >
                + High School / College Core Subjects
              </button>

              <button
                onClick={() =>
                  addOptions(
                    activeSpinner.id,
                    'Chapter 1: Intro, Chapter 2: Theory, Chapter 3: Practice, Chapter 4: Case Studies, Chapter 5: Review'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 transition-all text-xs font-medium text-slate-300 hover:text-white"
              >
                + Chapters 1 through 5
              </button>

              <button
                onClick={() =>
                  addOptions(
                    activeSpinner.id,
                    'Pizza, Burgers, Sushi, Tacos, Salad, Thai Curry, Pasta, Ramen'
                  )
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 transition-all text-xs font-medium text-slate-300 hover:text-white"
              >
                + Dinner Food Options
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Spinner */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-md bg-[#11131c] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="font-extrabold text-lg text-white">Create New Spinner</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSpinner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Spinner Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Picker, Subject Selector, Daily Routine..."
                  value={newSpinnerName}
                  onChange={(e) => setNewSpinnerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={newSpinnerCat}
                  onChange={(e) => setNewSpinnerCat(e.target.value as SpinnerCategory)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Initial Options (Optional, comma or newline separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="Option 1, Option 2, Option 3..."
                  value={newSpinnerInitialOptions}
                  onChange={(e) => setNewSpinnerInitialOptions(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all"
                >
                  Create Spinner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Add Options */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBatchModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#11131c] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white">Bulk Add Options</h3>
                <p className="text-xs text-slate-400">
                  Adding to &ldquo;{activeSpinner.name}&rdquo;
                </p>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBatchOptions} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Enter options separated by lines or commas:
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder={`Mathematics\nPhysics\nChemistry\nComputer Science\nEnglish\nBiology`}
                  value={batchOptionsInput}
                  onChange={(e) => setBatchOptionsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-purple-500 rounded-xl p-3.5 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  {
                    batchOptionsInput
                      .split(/[\n,]+/)
                      .map((s) => s.trim())
                      .filter(Boolean).length
                  }{' '}
                  item(s) detected
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
                  >
                    Append to Wheel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
