"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = { children: ReactNode; className?: string };

/**
 * Hero scene ("Amanhecer"): pinned while the fog lifts, the photo settles
 * and the title's SOFT axis melts. Targets are marked with data attributes
 * by the server-rendered children, so the hero paints (and counts as LCP)
 * before any of this loads.
 */
export function Dawn({ children, className = "" }: Props) {
  const section = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  useMotion(({ gsap }) => {
    const el = section.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: `(max-width: 767px) and ${MOTION_OK}`, isDesktop: `(min-width: 768px) and ${MOTION_OK}` },
      (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: isMobile ? "+=45%" : "+=90%",
              pin: true,
              // Our own server-rendered spacer: GSAP would otherwise wrap the
              // section in a new div, re-inserting the headline into the DOM,
              // which Chrome counts as a fresh paint and pushes LCP to the
              // moment motion boots.
              pinSpacer: spacer.current!,
              scrub: 1,
            },
          })
          .fromTo(q("[data-dawn-photo]"), { scale: 1.12 }, { scale: 1, yPercent: -4 }, 0)
          .to(q("[data-dawn-fog]"), { opacity: 0 }, 0)
          .fromTo(q("[data-dawn-title]"), { "--soft": 0 }, { "--soft": 100, yPercent: -8 }, 0)
          .to(q("[data-dawn-fade]"), { opacity: 0, y: -24, duration: 0.5 }, 0);
      },
    );

    return () => mm.revert();
  }, section);

  return (
    <div ref={spacer}>
      <section ref={section} aria-label="Amanhecer" className={`w-full ${className}`}>
        {children}
      </section>
    </div>
  );
}
