"use client";

import { ARAUCARIAS as A } from "./araucarias-data";

/**
 * Opening illustration: three real araucárias traced from our own photo
 * (scripts/ilustracoes), on the Planalto's ridge line. Client-only (see
 * lazy.tsx): no weight in the HTML, and inline SVG never competes with the
 * headline for LCP. On mount the ridge draws and the trees rise from the
 * ground one after another (CSS only; skipped with reduced motion).
 */
export function Araucarias({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${A.width} ${A.height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={`araucarias ${className}`}
    >
      <path
        className="araucarias-line"
        d={A.hill}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
        pathLength={1}
      />
      <g className="araucarias-tree" style={{ animationDelay: "0.35s" }} fill="var(--color-musgo)" opacity="0.55">
        <path fillRule="evenodd" d={A.far.crown} />
        <path d={A.far.trunk} />
      </g>
      <g className="araucarias-tree" style={{ animationDelay: "0.75s" }} fill="currentColor" opacity="0.85">
        <path fillRule="evenodd" d={A.pair.crown} />
        <path d={A.pair.trunk} />
      </g>
      <g className="araucarias-tree" style={{ animationDelay: "0.55s" }} fill="currentColor">
        <path fillRule="evenodd" d={A.main.crown} />
        <path d={A.main.trunk} />
      </g>
      <path className="araucarias-line" d={A.ground} stroke="currentColor" strokeWidth="1.4" pathLength={1} />
    </svg>
  );
}
