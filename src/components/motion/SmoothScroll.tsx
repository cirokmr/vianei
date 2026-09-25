"use client";

import type Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { loadMotionKit } from "@/lib/use-motion";
import { prefersReducedMotion } from "@/lib/motion";

type ScrollTarget = string | number | HTMLElement;
type ScrollApi = {
  /** Smooth-scrolls with Lenis when active, natively otherwise. */
  scrollTo: (target: ScrollTarget, options?: { offset?: number; duration?: number }) => void;
};

// One smooth-scroll instance per document, owned by <SmoothScroll>.
let activeLenis: Lenis | null = null;

function nativeScrollTo(target: ScrollTarget, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  const top = typeof el === "number" ? el : el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top: top + offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

const api: ScrollApi = {
  scrollTo: (target, options) => {
    if (activeLenis) activeLenis.scrollTo(target, options);
    else nativeScrollTo(target, options?.offset);
  },
};

export function useSmoothScroll(): ScrollApi {
  return api;
}

/**
 * Smooth scroll driven by GSAP's ticker so Lenis and ScrollTrigger share one
 * frame loop. Both load lazily after hydration; disabled entirely for
 * prefers-reduced-motion users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    Promise.all([import("lenis"), loadMotionKit()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;

      const lenis = new LenisCtor({ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false });
      const raf = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      activeLenis = lenis;

      // Layout shifts once web fonts swap in; re-measure every trigger.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      teardown = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        activeLenis = null;
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return children;
}
