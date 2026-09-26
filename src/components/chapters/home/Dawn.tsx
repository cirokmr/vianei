"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = { children: ReactNode; className?: string };

/**
 * Opening scene: as the page scrolls, the framed photo opens to the full
 * width and settles, while the title drifts up and its SOFT axis melts.
 * Targets are marked with data attributes by the server-rendered children,
 * so the headline paints (and counts as LCP) before any of this loads.
 * Nothing is pinned: the scene plays on the natural scroll.
 */
export function Dawn({ children, className = "" }: Props) {
  const section = useRef<HTMLElement>(null);

  useMotion(({ gsap }) => {
    const el = section.current!;
    const q = gsap.utils.selector(el);
    const [frame] = q("[data-dawn-frame]");
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // --gutter is a clamp(); read the resolved px from the title row's padding.
      const gutter = getComputedStyle(el.firstElementChild!).paddingLeft;
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: frame, start: "top bottom", end: "top top", scrub: 1 },
        })
        .fromTo(frame, { clipPath: `inset(0px ${gutter})` }, { clipPath: "inset(0px 0px)" }, 0)
        .fromTo(q("[data-dawn-photo]"), { scale: 1.12 }, { scale: 1 }, 0);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=60%", scrub: 1 },
        })
        .fromTo(q("[data-dawn-title]"), { "--soft": 0 }, { "--soft": 100, yPercent: -12 }, 0)
        // Explicit start values: the labels may still be in their CSS entrance
        // (opacity 0) when this is built, and .to() would record that as the start.
        .fromTo(q("[data-dawn-fade]"), { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: 0.5 }, 0);
    });

    return () => mm.revert();
  }, section);

  return (
    <section ref={section} aria-label="Abertura" className={`w-full ${className}`}>
      {children}
    </section>
  );
}
