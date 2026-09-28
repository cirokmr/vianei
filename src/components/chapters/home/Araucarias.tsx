"use client";

import { useEffect, useRef } from "react";

const SRC = "/ilustracoes/araucarias.svg";

/**
 * Opening illustration: real araucárias traced from our own photo
 * (scripts/ilustracoes). The drawing is a static SVG file (~23 KB gzip,
 * cached), fetched after the page loads and inlined so each tree can rise
 * from the ground (CSS in globals.css, off with reduced motion). Inline SVG
 * is never an LCP candidate and adds nothing to the JS bundle; the space is
 * reserved by the parent, so there is no layout shift.
 */
export function Araucarias({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetch(SRC, { signal: controller.signal })
        .then((res) => (res.ok ? res.text() : ""))
        .then((svg) => {
          if (svg && box.current) box.current.innerHTML = svg;
        })
        .catch(() => {});
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });
    return () => {
      controller.abort();
      window.removeEventListener("load", load);
    };
  }, []);

  return <div ref={box} aria-hidden="true" className={`araucarias ${className}`} />;
}
