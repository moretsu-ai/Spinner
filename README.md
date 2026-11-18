# SpinIt 🎯 – Modern Random Decision Spinner

SpinIt is a modern, responsive, high-performance random decision-making web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **HTML5 Canvas**.

## ✨ Features

### 1. Dashboard (Management Page)
- **Multi-Spinner Management**: Create, switch, duplicate, and delete multiple custom spinners.
- **Categorization**: Classify spinners into *Subjects*, *Units*, *Chapters*, *Topics*, *Objects*, *Activities*, or *Custom*.
- **Option Ingestion**:
  - Add individual options with immediate keyboard Enter support.
  - **Bulk Add**: Paste comma-separated or multi-line text (e.g. paste a list of chapters or subjects).
- **Organization & Customization**:
  - Reorder items up and down with instant visual updates.
  - Inline edit option names and choose custom segment colors from a neon/vibrant palette.
  - Exclude/include options without deleting them.
  - Clear all options with confirmation.
- **Live Mini Preview**: High-DPI canvas preview that updates simultaneously as you type or change options.
- **Sample Presets**: Pre-loaded with *Subject Selector*, *Physics Units Practice*, *Dinner Decider*, *Algorithms & Data Structures*, and *Weekend Activities*.

### 2. Spinner Page (Main Experience)
- **Dedicated Immersive Experience**: Large circular wheel centered on the screen with dynamic responsive scaling.
- **High-DPI Canvas Rendering**: Crisp graphics on Retina displays with glowing neon bezel, perimeter studs, 3D radial depth gradient, and metallic center hub.
- **Exact Mathematical Alignment**: The pointer at 12 o'clock (top) is mathematically guaranteed to land cleanly within the winning slice every time.
- **Realistic Audio Synthesizer (Web Audio API)**:
  - Realistic mechanical ticking sounds that naturally slow down in frequency as the wheel decelerates.
  - Celebratory victory arpeggio on win.
  - Zero external MP3 asset dependencies; works 100% offline.
  - Mute/unmute toggle persisted in localStorage.
- **Physics Easing**: 5-second Quintic Ease-Out curve for explosive spins and suspenseful gradual deceleration.
- **Celebratory Win Modal**:
  - Multi-stage confetti fireworks cannon burst using `canvas-confetti`.
  - Displays winner text with matching glowing border and trophy badge.
  - Quick action buttons: **Spin Again** or **Remove & Spin Again**.
- **Quick Options Tray**: Toggle items active/inactive right from the main spinner screen without leaving.
- **Keyboard Shortcut**: Press `SPACEBAR` to spin.

### 3. Spin History
- Slide-out drawer tracking every spin with timestamp, spinner name, and winner badge.
- Filter by current spinner or view global history.
- Clear history action.

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```
The optimized bundle is generated in `dist/`.

