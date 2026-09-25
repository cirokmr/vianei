"use client";

import { usePathname } from "next/navigation";
import { useMotion } from "@/lib/use-motion";

/**
 * Flips the fixed header to light text while a `[data-header="dark"]`
 * section sits under it. Explicit colors (instead of mix-blend-difference)
 * keep contrast measurable and predictable.
 */
export function HeaderTone() {
  const pathname = usePathname();

  useMotion(
    ({ ScrollTrigger }) => {
      const header = document.querySelector<HTMLElement>("[data-site-header]");
      if (!header) return;

      // Sections are re-queried per route, since the header outlives pages.
      document.querySelectorAll<HTMLElement>('[data-header="dark"]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => header.toggleAttribute("data-on-dark", self.isActive),
        });
      });
      return () => header.removeAttribute("data-on-dark");
    },
    undefined,
    [pathname],
  );

  return null;
}
