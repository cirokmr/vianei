"use client";

import { useRef, useState, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  /** Accessible name of the chapter (region landmark). */
  label: string;
  className?: string;
  /**
   * "replace": one step on screen at a time (crossfade in place).
   * "accumulate": steps build up on top of each other.
   */
  mode?: "replace" | "accumulate";
  /** Scroll distance per step, in % of the viewport height (desktop). */
  stepLength?: number;
  /** Snap to the nearest step when scrolling stops. */
  snap?: boolean;
  /** Show the "02 / 05" progress indicator. */
  counter?: boolean;
  /** Dark background: flips the fixed header to light text while pinned. */
  dark?: boolean;
};

/**
 * The hijacking core: pins its section and turns scrolling into advancing
 * `[data-step]` children one by one, snapping to steps when scroll settles.
 * Without JS or with reduced motion the steps are simply read in order.
 * Phones get shorter pins (less scroll per step).
 */
export function PinnedChapter({
  children,
  label,
  className = "",
  mode = "replace",
  stepLength = 90,
  snap = true,
  counter = true,
  dark = false,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  useMotion(({ gsap }) => {
    const el = section.current!;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
    if (steps.length < 2) return;
    setTotal(steps.length);
    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: `(max-width: 767px) and ${MOTION_OK}`, isDesktop: `(min-width: 768px) and ${MOTION_OK}` },
      (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        const perStep = isMobile ? stepLength * 0.6 : stepLength;
        el.classList.add("is-pinned", `is-${mode}`);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${perStep * (steps.length - 1)}%`,
            pin: true,
            scrub: 0.8,
            snap: snap
              ? { snapTo: "labelsDirectional", duration: { min: 0.25, max: 0.7 }, ease: "power2.inOut", delay: 0.1 }
              : undefined,
            onUpdate: (self) => setIndex(Math.round(self.progress * (steps.length - 1))),
          },
        });

        steps.forEach((step, i) => {
          if (i === 0) {
            tl.addLabel("step-0");
            return;
          }
          gsap.set(step, { autoAlpha: 0, yPercent: 12 });
          const at = i - 1;
          if (mode === "replace") {
            tl.to(steps[i - 1], { autoAlpha: 0, yPercent: -12, duration: 0.45 }, at + 0.1);
          }
          tl.to(step, { autoAlpha: 1, yPercent: 0, duration: 0.55 }, at + 0.4).addLabel(`step-${i}`, i);
        });

        return () => el.classList.remove("is-pinned", `is-${mode}`);
      },
    );

    return () => mm.revert();
  }, section);

  return (
    <section
      ref={section}
      aria-label={label}
      data-header={dark ? "dark" : undefined}
      className={`chapter relative ${className}`}
    >
      <div className="chapter-steps">{children}</div>
      {counter && total > 1 ? (
        <p
          aria-hidden="true"
          className="chapter-counter absolute bottom-[var(--gutter)] left-[var(--gutter)] font-display text-sm tabular-nums"
        >
          {String(index + 1).padStart(2, "0")} <span className="opacity-50">/ {String(total).padStart(2, "0")}</span>
        </p>
      ) : null}
    </section>
  );
}
