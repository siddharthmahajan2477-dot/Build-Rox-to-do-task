# RoxTasks

> **"Your Tasks. Your Rules. Your Style."**  
> *Crafted by Build Rox*

RoxTasks is an ultra-premium, local-first to-do list and productivity dashboard built with React, Next.js, TypeScript, Tailwind CSS, and Lucide React icons.

---

## ⚡ Core Highlights

- **100% Local-First Architecture**: All tasks and preferences persist in browser `localStorage`.
- **IndexedDB Custom Wallpaper Engine**: Upload high-resolution wallpapers stored locally in `IndexedDB` with zero external image dependencies.
- **5 Handcrafted Themes**:
  1. *Royal Obsidian* (Default: black, graphite, silver, platinum)
  2. *Forest Green* (Deep emerald, rich pine, ivory)
  3. *Ocean Blue* (Abyssal navy, sapphire slate, cool white)
  4. *Peach Cream* (Warm espresso, velvet glow, soft peach, cream)
  5. *Classic Light* (Porcelain white, dove grey, sharp contrast)
- **6 Built-in CSS Wallpaper Presets**:
  - Dark Mountains
  - Midnight Gradient
  - Forest Mist
  - Ocean Depth
  - Peach Sunrise
  - Minimal Graphite
- **Wallpaper & Glass Controls**: Real-time blur slider (0–24px), dimming/darkness overlay slider (0–85%), and glassmorphic card opacity (40–100%).
- **Task Management (Full CRUD)**:
  - Add tasks with optional notes, priorities (Low / Medium / High), due dates, and categories/tags.
  - Quick inline input + expandable rich details.
  - Interactive smooth completion with synthetic Web Audio API chimes.
  - Task editor modal with full keyboard accessibility.
  - Filter by All, Active, Completed, Today, and Overdue.
  - Real-time search across title, notes, and tags.
  - Sorting by Newest, Oldest, Due Date, Priority, and A–Z.
- **Dashboard Progress & Statistics**:
  - Animated SVG circular progress ring showing exact completion percentage.
  - Total, Active, Completed, and Due/Overdue counters with tabular numerals.
  - Time-aware motivational greeting banner with editable username.
- **Full Data Portability**:
  - Export full JSON backup (`.json`) at any time.
  - Import JSON backup with schema validation and safe restore confirmation.
  - Appearance reset without touching your tasks.
- **Zero Cloud / Zero API Key Dependencies**: No Firebase, Supabase, backend servers, or external tracking.

---

## 🚀 Getting Started

### Prerequisites

Node.js (v18 or higher) and npm installed on your machine.

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open your browser at:

```
http://localhost:3000
```

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + N` / `Cmd + N`: Quickly focus the new task input bar.
- `Enter` (inside task input): Create task immediately.
- `Escape`: Close any open modal or settings drawer.
