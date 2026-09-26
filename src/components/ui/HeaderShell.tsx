"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** The header's reading line, in px from the top of the viewport. */
const PROBE = 40;

/**
 * Fixed header chrome, updated once per animation frame while scrolling:
 * - `data-scrolled` once the page leaves the top (solid, blurred bar);
 * - `data-on-dark` while a `[data-header="dark"]` section sits under it.
 * Measuring live rects (instead of precomputed ScrollTrigger positions) stays
 * correct whatever pins, spacers or lazy content shift the page. No GSAP.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-header="dark"]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      header.toggleAttribute("data-scrolled", window.scrollY > 24);
      header.toggleAttribute(
        "data-on-dark",
        dark.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= PROBE && r.bottom > PROBE;
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      ref={ref}
      data-site-header
      style={{ viewTransitionName: "site-header" }}
      className="group/header fixed inset-x-0 top-0 z-50 text-tinta transition-[color,background-color,box-shadow] duration-500 data-[on-dark]:text-papel data-[scrolled]:bg-papel/85 data-[scrolled]:shadow-[0_1px_0_rgb(34_34_30/0.08)] data-[scrolled]:backdrop-blur-md data-[scrolled]:data-[on-dark]:bg-mata/85 data-[scrolled]:data-[on-dark]:shadow-[0_1px_0_rgb(244_239_230/0.1)]"
    >
      {children}
    </header>
  );
}
