"use client";

import { useRef } from "react";
import { FINE_POINTER } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

/**
 * A small label that trails the pointer over elements marked
 * `data-cursor="Ler"` (or "Ver", "Arrastar"…). The native cursor stays
 * visible; this only adds context. Mouse/trackpad and motion-OK only.
 */
export function ContextCursor() {
  const bubble = useRef<HTMLDivElement>(null);

  useMotion(({ gsap }) => {
    const el = bubble.current!;
    const mm = gsap.matchMedia();

    mm.add(FINE_POINTER, () => {
      const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
      let label = "";

      const move = (e: PointerEvent) => {
        x(e.clientX + 18);
        y(e.clientY + 18);
        const next = (e.target as Element).closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
        if (next === label) return;
        label = next;
        if (next) {
          el.textContent = next;
          gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "soft" });
        } else {
          gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
        }
      };

      gsap.set(el, { autoAlpha: 0, scale: 0.6 });
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    });

    return () => mm.revert();
  });

  return (
    <div
      ref={bubble}
      aria-hidden="true"
      style={{ visibility: "hidden" }}
      className="pointer-events-none fixed top-0 left-0 z-[65] rounded-full bg-pinhao px-3 py-1.5 text-eyebrow tracking-[0.14em] text-papel uppercase"
    />
  );
}
