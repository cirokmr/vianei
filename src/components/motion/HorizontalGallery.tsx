"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
};

/**
 * Desktop: pins the section and converts vertical scroll into horizontal
 * travel through the track. Phones and reduced motion: a native swipeable
 * row with scroll-snap (children should be `snap-start` items).
 */
export function HorizontalGallery({ children, label, className = "" }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useMotion(({ gsap }) => {
    const el = section.current!;
    const row = track.current!;
    const mm = gsap.matchMedia();

    mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
      el.classList.add("is-pinned");
      const distance = () => Math.max(0, row.scrollWidth - el.clientWidth);

      gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });

      return () => el.classList.remove("is-pinned");
    });

    return () => mm.revert();
  }, section);

  return (
    <section ref={section} aria-label={label} className={`hgallery relative overflow-hidden ${className}`}>
      {/* Focusable so keyboard users can scroll the row when it is a native swipe strip. */}
      <div
        ref={track}
        tabIndex={0}
        role="group"
        aria-label={`${label}: use as setas para percorrer`}
        className="hgallery-track flex snap-x snap-mandatory [scrollbar-width:none] gap-[var(--gutter)] overflow-x-auto px-[var(--gutter)]"
      >
        {children}
      </div>
      <div aria-hidden="true" className="hgallery-progress mx-[var(--gutter)] mt-8 h-px bg-current/15">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-current" />
      </div>
    </section>
  );
}
