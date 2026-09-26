"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";

export type MotionKit = typeof import("./gsap");
type Setup = (kit: MotionKit) => void | (() => void);

let kitPromise: Promise<MotionKit> | null = null;

function afterLoad(): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  // Then wait for the first idle period: the hero (CSS-only) owns the first
  // second, and the motion bundle stays out of the LCP window.
  return loaded.then(
    () =>
      new Promise<void>((resolve) => {
        if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: 1200 });
        else setTimeout(resolve, 200);
      }),
  );
}

/**
 * Loads GSAP + plugins once, shared by every motion component. Waits for the
 * window load event and an idle period so the ~50 KB motion bundle never
 * competes with the LCP font and hydration for bandwidth on slow connections.
 */
export function loadMotionKit(): Promise<MotionKit> {
  kitPromise ??= afterLoad().then(() => import("./gsap"));
  return kitPromise;
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;

// Setups run one per task, yielding to the main thread in between: a page
// with a dozen chapters would otherwise build every timeline, pin and split
// in one long task right after load (Total Blocking Time).
let queue: Promise<void> = Promise.resolve();
const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (s?.yield) s.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

function enqueue(task: () => void) {
  queue = queue.then(yieldToMain).then(task);
}

/**
 * Pins add spacing that shifts every trigger below them. Components mount
 * (and lazily set up) in any order, so after each setup we schedule a single,
 * debounced ScrollTrigger.refresh() that recomputes all positions at once.
 */
function scheduleRefresh(kit: MotionKit) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => kit.ScrollTrigger.refresh(), 120);
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

    loadMotionKit().then((kit) =>
      enqueue(() => {
        if (cancelled) return;
        const ctx = kit.gsap.context(() => setupRef.current(kit), scope?.current ?? undefined);
        scheduleRefresh(kit);
        revert = () => {
          ctx.revert();
          scheduleRefresh(kit);
        };
      }),
    );

    return () => {
      cancelled = true;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are caller-provided
  }, [scope, ...deps]);
}
