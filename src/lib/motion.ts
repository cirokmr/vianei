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
