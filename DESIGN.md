# SriVoraTech — Official DESIGN.md System Guide

> **Design Language Specification for SriVoraTech Web & Mobile Ecosystem**  
> Formatted according to the `VoltAgent/awesome-design-md` standard for AI coding agents and frontend engineers.

---

## 🌐 1. Brand Vision & Visual Identity

* **Brand Name:** SriVoraTech
* **Tagline:** Enabling Businesses with Tech, AI & Full-Stack Engineering
* **Design Philosophy:** Premium, Modern Glassmorphic, Sapphire-Powered, Hardware-Accelerated 60fps Aesthetics.
* **Target Audience:** B2B Clients, Founders, Enterprises, Technical Leaders, and Software Engineers.
* **Core Personality:** Innovative, High-Performance, Transparent, Enterprise-Grade.

---

## 🎨 2. Color Palette & Token System

### Core Palette
```css
:root {
  /* Brand Accents */
  --color-accent: #0067F4;               /* Sapphire Primary Blue */
  --color-accent-hover: #0047A8;         /* Deep Azure Hover */
  --color-accent-glow: rgba(0, 103, 244, 0.18);

  /* Backgrounds */
  --color-bg: #fafafa;                   /* Off-white canvas */
  --color-white: #ffffff;                /* Pure white card face */
  --color-dark: #090d16;                 /* Cyber Charcoal dark mode */
  --color-dark-hover: #131b2e;

  /* Typography Scale */
  --color-text-heading: #0f172a;        /* Deep Slate 900 */
  --color-text-primary: #1e293b;        /* Slate 800 */
  --color-text-secondary: #475569;      /* Slate 600 */
  --color-text-muted: #94a3b8;          /* Slate 400 */

  /* Neutral Slate Palette */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;

  /* Functional Status Colors */
  --color-success: #10b981;              /* Emerald Green */
  --color-warning: #f59e0b;              /* Amber Gold */
  --color-danger: #ef4444;               /* Coral Red */
  --color-info: #06b6d4;                 /* Cyan Blue */
  --color-purple: #8b5cf6;               /* Electric Violet */
  --color-pink: #ec4899;                 /* Cyber Magenta */
}
```

---

## 🔤 3. Typography & Hierarchy

* **Heading Font:** `'Satoshi'`, system-ui, -apple-system, sans-serif
* **Body Font:** `'Inter'`, system-ui, -apple-system, sans-serif

```css
/* Typography Scale Rules */
.hero-title        { font-size: clamp(40px, 5vw, 64px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.1; }
.section-title     { font-size: clamp(32px, 4vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.2; }
.card-title        { font-size: 20px; font-weight: 800; color: var(--color-gray-900); }
.section-subtitle  { font-size: 16px; font-weight: 500; color: var(--color-text-secondary); line-height: 1.6; }
.micro-caption     { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
```

---

## 📐 4. Geometry, Borders & Elevation Shadows

### Border Radius System
* `--radius-xs`: `8px`
* `--radius-sm`: `12px`
* `--radius-md`: `18px`
* `--radius-lg`: `24px`
* `--radius-xl`: `32px`
* `--radius-full`: `9999px`

### Shadows & Depth Elevation
```css
/* Depth Tokens */
--shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
--shadow-md: 0 12px 32px -4px rgba(15, 23, 42, 0.06);
--shadow-lg: 0 24px 48px -8px rgba(15, 23, 42, 0.09);
--shadow-hover: 0 30px 60px -12px rgba(0, 103, 244, 0.16), 0 16px 32px -6px rgba(15, 23, 42, 0.05);
--shadow-glow: 0 0 60px rgba(0, 103, 244, 0.2);
```

---

## 🧩 5. Component Design Standards

### A. Floating Glass Navigation Header (`Navbar`)
* **Behavior:** Fixed top pill floating header with 24px backdrop blur filter (`backdrop-filter: blur(24px)`).
* **Live Status Indicator:** Animated pulsing green dot (`●`) showing live availability.
* **Scroll Spy:** Active section link auto-highlights with bottom indicator dot on scroll.

### B. Leadership Profiles (`Leadership`)
* **Layout:** Left-to-right horizontal carousel track (`scroll-snap-type: x mandatory`).
* **Profile Photo:** 100% Circular shape avatar (`border-radius: 50%`) with pulsing gradient aura ring.
* **Card Structure:** 
  - **Left Side:** Circular profile photo, verified badge, executive name, title, and social action buttons.
  - **Right Side:** Executive bio description text box and core expertise skills chips grid.
  - **Interactive Drawer:** Click/hover drawer reveals full bio with smooth slide-up animation.

### C. 3D Interactive Flip Cards (`Challenges`)
* **Front:** Problem icon, red problem badge, challenge description, and flip hint.
* **Back:** Solution pill with green check, 3-week MVP sprint details, and high-impact stat chip.
* **Progress Bar:** Real-time indicator bar tracking how many solution cards have been flipped.

### D. Website Rating System (`WebsiteRating`)
* **View Modes:**
  - **Carousel Stream:** Horizontal sliding review cards track.
  - **Show All (Grid View):** 3-column responsive grid displaying all ratings simultaneously.
* **Filters & Sorting:** Full 5★ down to 1★ star pills with count badges, keyword search box, and sort dropdown (Newest First, Highest Rating, Most Helpful).
* **Multi-User Sync:** Instant 0ms local master load with continuous background sync across MongoDB Atlas and Google Sheets centralized database.

### E. Interactive Project Estimator (`ProjectEstimator`)
* **Features:** 60-second budget calculator, currency toggle (INR / USD), step-by-step feature pills, and proposal PDF generator.

### F. Cutting-Edge Tech Ecosystem (`TechStack`)
* **Visual Structure:** Glassmorphic tech cards (`.glass-card`) featuring interactive category filter pills (Frontend, Backend, Cloud, AI & Data, Databases) and live keyword search.
* **Skill Progress Meter:** Each technology card features an animated color-coded mastery progress bar (`.skill-meter-fill`) matching its tech accent color (`--tech-accent`).
* **Icon Dynamics:** On card hover, technology icons scale (`transform: rotate(6deg) scale(1.12)`) inside a color-tinted spotlight halo wrapper.

---

## ⚡ 6. Animation & Interaction Rules

1. **Easing Curve:** Use `cubic-bezier(0.16, 1, 0.3, 1)` for smooth hardware-accelerated transitions.
2. **Hover Elevation:** Hovered cards transform `translateY(-8px)` with glowing accent border.
3. **No Empty States:** Always load stored master data or pre-rendered skeletons in 0ms to eliminate layout shifting.
4. **Mobile Responsiveness:** All multi-column cards collapse gracefully into single-column layouts on screens `<= 768px`.

---

*Created for SriVoraTech codebase repository.*
