"use client";

import { useRef, type ReactNode } from "react";
import { FINE_POINTER } from "@/lib/motion";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
};

/** Pulls its child toward the pointer (buttons, CTAs). Mouse/trackpad only. */
export function Magnetic({ children, strength = 0.3, className = "" }: Props) {
  const el = useRef<HTMLSpanElement>(null);

  useMotion(({ gsap }) => {
    const node = el.current!;
    const mm = gsap.matchMedia();

    mm.add(FINE_POINTER, () => {
      const x = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        gsap.to(node, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
      };
      node.addEventListener("pointermove", move);
      node.addEventListener("pointerleave", leave);
      return () => {
        node.removeEventListener("pointermove", move);
        node.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, el);

  return (
    <span ref={el} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
