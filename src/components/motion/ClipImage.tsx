"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, REDUCED_MOTION } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Edge the reveal starts from. */
  from?: "bottom" | "top" | "left" | "right";
  /** Subtle vertical drift of the image inside its frame while scrolling. */
  parallax?: boolean;
};

const START: Record<NonNullable<Props["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Image frame revealed with a clip-path wipe when it enters the viewport,
 * the image settling from a slight zoom, plus optional inner parallax.
 * Pass a next/image as the child; the frame sizes itself from it.
 */
export function ClipImage({ children, className = "", from = "bottom", parallax = true }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useMotion(({ gsap }) => {
    const el = frame.current!;
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION, () => {
      gsap.set(el, { autoAlpha: 1 });
    });

    mm.add(MOTION_OK, () => {
      const trigger = { trigger: el, start: "top 88%", once: true };
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        el,
        { clipPath: START[from] },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "vianei", scrollTrigger: trigger },
      );
      gsap.fromTo(inner.current, { scale: 1.18 }, { scale: 1, duration: 1.9, ease: "soft", scrollTrigger: trigger });
      if (parallax) {
        gsap.fromTo(
          inner.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    });

    return () => mm.revert();
  }, frame);

  return (
    <div ref={frame} data-reveal="" className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        {children}
      </div>
    </div>
  );
}
