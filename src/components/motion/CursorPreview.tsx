"use client";

import { useRef, type ReactNode } from "react";
import { FINE_POINTER } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Wrap a list whose items carry `data-preview="<image url>"`: hovering an
 * item shows that image floating next to the cursor. Mouse/trackpad only;
 * the preview is decorative (the items keep their own text and images).
 */
export function CursorPreview({ children, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useMotion(({ gsap }) => {
    const el = root.current!;
    const box = float.current!;
    const mm = gsap.matchMedia();

    mm.add(FINE_POINTER, () => {
      const x = gsap.quickTo(box, "x", { duration: 0.55, ease: "power3.out" });
      const y = gsap.quickTo(box, "y", { duration: 0.55, ease: "power3.out" });
      let current = "";

      const move = (e: PointerEvent) => {
        x(e.clientX + 24);
        y(e.clientY - box.offsetHeight / 2);
        const item = (e.target as Element).closest<HTMLElement>("[data-preview]");
        const src = item?.dataset.preview ?? "";
        if (src && src !== current) {
          current = src;
          img.current!.src = src;
          gsap.to(box, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.45, ease: "soft" });
        } else if (!src && current) {
          current = "";
          gsap.to(box, { autoAlpha: 0, scale: 0.85, rotate: -3, duration: 0.3, ease: "power2.in" });
        }
      };
      const leave = () => {
        current = "";
        gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.3 });
      };

      gsap.set(box, { autoAlpha: 0, scale: 0.85, rotate: -3 });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, root);

  return (
    <div ref={root} className={className}>
      {children}
      <div
        ref={float}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[min(22vw,320px)] overflow-hidden [@media(pointer:fine)]:block"
        style={{ visibility: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic, already-optimized thumbnails */}
        <img ref={img} alt="" className="aspect-[4/3] w-full object-cover" decoding="async" />
      </div>
    </div>
  );
}
