"use client";

import { useRef } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const format = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

/**
 * Number that counts up when scrolled into view. The final value is
 * server-rendered (SEO, no-JS, screen readers get it once via sr-only text);
 * only the visual digits animate.
 */
export function Counter({ value, prefix = "", suffix = "", className = "" }: Props) {
  const digits = useRef<HTMLSpanElement>(null);

  useMotion(({ gsap }) => {
    const el = digits.current!;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const state = { n: 0 };
      el.textContent = format(0);
      gsap.to(state, {
        n: value,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = format(state.n);
        },
      });
      return () => {
        el.textContent = format(value);
      };
    });

    return () => mm.revert();
  }, digits);

  return (
    <span className={`tabular-nums ${className}`}>
      <span aria-hidden="true">
        {prefix}
        <span ref={digits}>{format(value)}</span>
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
    </span>
  );
}
