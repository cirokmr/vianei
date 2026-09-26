"use client";

import { Children, useRef, type ReactNode } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical offset between stacked cards. */
  offset?: string;
};

/**
 * Cards stick to the top and pile up; each one recedes (scales down and
 * dims) as the next slides over it. Sticky positioning is plain CSS, so the
 * stack still works (without the recede effect) under reduced motion.
 */
export function StackCards({ children, className = "", offset = "1.25rem" }: Props) {
  const list = useRef<HTMLOListElement>(null);
  const items = Children.toArray(children);

  useMotion(({ gsap }) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", list.current);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      cards.slice(0, -1).forEach((card, i) => {
        const next = cards[i + 1];
        const trigger = { trigger: next, start: "top bottom", end: "top top+=10%", scrub: true };
        gsap.to(card.firstElementChild, { scale: 0.92, ease: "none", scrollTrigger: trigger });
        gsap.to(card.querySelector("[data-stack-shade]"), { opacity: 0.45, ease: "none", scrollTrigger: trigger });
      });
    });

    return () => mm.revert();
  }, list);

  return (
    <ol ref={list} className={`relative ${className}`}>
      {items.map((child, i) => (
        <li
          key={i}
          data-stack-card=""
          className="sticky mb-[12vh] last:mb-0"
          style={{ top: `calc(var(--gutter) * 3 + ${i} * ${offset})` }}
        >
          <div className="relative origin-top overflow-hidden will-change-transform">
            {child}
            <div
              data-stack-shade=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-mata opacity-0"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
