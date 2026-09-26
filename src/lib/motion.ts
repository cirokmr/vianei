export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Breakpoints shared by gsap.matchMedia() conditions.
export const MOTION_QUERIES = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduced: REDUCED_MOTION,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Fine pointer (mouse/trackpad) + motion allowed: cursor-driven effects. */
export const FINE_POINTER = "(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)";
