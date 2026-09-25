"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { MOTION_QUERIES } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Reveal when scrolled into view instead of on mount. */
  onScroll?: boolean;
};

/**
 * Masked line-by-line text reveal. The text is server-rendered; SplitText
 * only wraps it on the client, re-splitting on resize and font load.
 */
export function SplitReveal({ as: Tag = "div", children, className, delay = 0, onScroll = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(({ gsap, SplitText }) => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES.reduced, () => {
      gsap.set(el, { autoAlpha: 1 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        // Line splits keep words intact, so screen readers read the original
        // text; "auto" would put aria-label on non-landmark tags.
        aria: "none",
        onSplit: (self) => {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(self.lines, {
            yPercent: 110,
            rotate: 2,
            duration: 1.4,
            ease: "vianei",
            stagger: 0.09,
            delay,
            scrollTrigger: onScroll ? { trigger: el, start: "top 85%", once: true } : undefined,
          });
        },
      });
      return () => split.revert();
    });

    return () => mm.revert();
  }, ref);

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
