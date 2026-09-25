import localFont from "next/font/local";

// Both faces are instanced + subset from the Google Fonts variable files by
// scripts/build-fonts.py (pt-BR glyphs, only the axes ranges we use).

// Display: Fraunces, opsz pinned at 72, wght 300–500, SOFT axis kept for
// scroll animation. ~42 KB (vs 118 KB). It is the LCP font, so preloaded.
export const fraunces = localFont({
  src: "../fonts/fraunces-display.woff2",
  variable: "--font-fraunces",
  weight: "300 500",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

// Text/UI: Inter Tight, wght 400–600. ~18 KB (vs 44 KB). Not preloaded, so it
// never competes with the display face for bandwidth.
export const interTight = localFont({
  src: "../fonts/inter-tight.woff2",
  variable: "--font-inter-tight",
  weight: "400 600",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
