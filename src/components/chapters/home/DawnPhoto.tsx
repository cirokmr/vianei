"use client";

import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}
const loaded = () => document.readyState === "complete";
const notYet = () => false;

/**
 * The hero photo arrives after the page has loaded, fading in as the mist
 * lifts. The headline is the LCP; keeping ~40–60 KB of photo out of the
 * first round of requests lets the display font and the page's own JS win
 * the bandwidth on slow connections. Without JS, the <noscript> copy shows.
 */
export function DawnPhoto({ children }: { children: ReactNode }) {
  return useSyncExternalStore(subscribe, loaded, notYet) ? children : null;
}
