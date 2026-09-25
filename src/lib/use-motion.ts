"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";

export type MotionKit = typeof import("./gsap");
type Setup = (kit: MotionKit) => void | (() => void);

let kitPromise: Promise<MotionKit> | null = null;

function afterLoad(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
}

/**
 * Loads GSAP + plugins once, shared by every motion component. Waits for the
 * window load event so the ~50 KB motion bundle never competes with the LCP
 * font and hydration for bandwidth on slow connections.
 */
export function loadMotionKit(): Promise<MotionKit> {
  kitPromise ??= afterLoad().then(() => import("./gsap"));
  return kitPromise;
}

/**
 * Runs GSAP setup code after GSAP is lazily loaded, scoped to `scope`.
 * Everything created inside (tweens, ScrollTriggers, SplitTexts registered
 * via the returned cleanup, matchMedia) is reverted on unmount, and set up
 * again whenever `deps` change.
 */
export function useMotion(setup: Setup, scope?: RefObject<Element | null>, deps: DependencyList = []) {
  const setupRef = useRef(setup);

  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    loadMotionKit().then((kit) => {
      if (cancelled) return;
      const ctx = kit.gsap.context(() => setupRef.current(kit), scope?.current ?? undefined);
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided
  }, [scope, ...deps]);
}
