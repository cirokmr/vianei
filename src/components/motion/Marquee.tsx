"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
  /** Seconds for one full loop at rest. */
  duration?: number;
};

/**
 * Infinite ribbon (partners' names/logos) that speeds up with scroll
 * velocity. Content is rendered twice for a seamless loop; the copy is
 * hidden from assistive tech. Hover/focus pauses it; reduced motion shows a
 * static, wrapping list.
 */
export function Marquee({ children, label, className = "", duration = 40 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useMotion(({ gsap, ScrollTrigger }) => {
    const el = root.current!;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      el.classList.add("is-running");
      const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration, repeat: -1 });
      const boost = gsap.quickTo(loop, "timeScale", { duration: 0.6, ease: "power3.out" });
      // One reusable timer eases the speed back after scrolling stops.
      const settle = gsap.delayedCall(0.2, () => boost(1)).pause();

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          boost(1 + Math.min(Math.abs(self.getVelocity()) / 600, 4));
          settle.restart(true);
        },
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });

      const pause = () => loop.pause();
      const play = () => loop.play();
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", play);
      el.addEventListener("focusin", pause);
      el.addEventListener("focusout", play);

      return () => {
        st.kill();
        settle.kill();
        el.classList.remove("is-running");
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", play);
        el.removeEventListener("focusin", pause);
        el.removeEventListener("focusout", play);
      };
    });

    return () => mm.revert();
  }, root);

  return (
    <div ref={root} role="region" aria-label={label} className={`marquee overflow-hidden ${className}`}>
      <div ref={track} className="marquee-track flex w-max">
        <div className="marquee-group flex shrink-0 items-center">{children}</div>
        <div className="marquee-group marquee-copy flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
