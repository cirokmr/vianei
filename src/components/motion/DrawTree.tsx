"use client";

import { useRef } from "react";
import { MOTION_OK } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  className?: string;
  /** What drives the drawing: the whole page scroll, or the element's own passage through the viewport. */
  follow?: "page" | "self";
};

/**
 * Line-art araucária drawn with DrawSVG as the reader scrolls: the site's
 * visual thread ("O Tempo da Araucária"). Decorative; fully drawn when
 * motion is reduced or JS is off.
 */
export function DrawTree({ className = "", follow = "self" }: Props) {
  const svg = useRef<SVGSVGElement>(null);

  useMotion(({ gsap }) => {
    const paths = gsap.utils.toArray<SVGPathElement>("path", svg.current);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap
        .timeline({
          scrollTrigger:
            follow === "page"
              ? { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.6 }
              : { trigger: svg.current, start: "top 85%", end: "bottom 35%", scrub: 0.6 },
        })
        .from(paths[0], { drawSVG: "0%", ease: "none", duration: 1 })
        .from(paths.slice(1), { drawSVG: "0%", ease: "none", duration: 0.6, stagger: 0.08 }, 0.55);
    });

    return () => mm.revert();
  }, svg);

  return (
    <svg
      ref={svg}
      viewBox="0 0 240 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* trunk */}
      <path d="M120 416 C121 350 118 290 120 230 C121 190 119 150 120 104" />
      {/* candelabra crown: arms rising from the top of the trunk, tufts at the tips */}
      <path d="M120 150 C98 146 72 138 52 112 C46 104 42 96 40 86" />
      <path d="M120 150 C142 146 168 138 188 112 C194 104 198 96 200 86" />
      <path d="M120 132 C102 126 84 116 70 96 C64 88 62 80 61 72" />
      <path d="M120 132 C138 126 156 116 170 96 C176 88 178 80 179 72" />
      <path d="M120 116 C108 110 96 102 88 88 C84 80 83 72 83 64" />
      <path d="M120 116 C132 110 144 102 152 88 C156 80 157 72 157 64" />
      <path d="M120 104 C118 90 118 76 120 60" />
      <path d="M28 88 C34 80 46 78 54 84 M186 84 C194 78 206 80 212 88" />
      <path d="M50 74 C56 66 66 66 72 72 M168 72 C174 66 184 66 190 74" />
      <path d="M74 62 C80 55 88 55 93 61 M147 61 C152 55 160 55 166 62" />
      <path d="M108 56 C114 50 126 50 132 56" />
    </svg>
  );
}
