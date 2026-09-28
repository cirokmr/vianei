"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Item = { id: string; label: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Chapter progress ("03 / 07") and jump links for long hijacked pages.
 * Reads the [data-chapter] wrappers rendered by <Chapter>, measuring live
 * rects once per frame (pins and spacers make precomputed offsets stale).
 * Jumps go through Lenis and then move focus into the chapter, so keyboard
 * users land where they are looking. Labels show on hover/focus only, so the
 * rail never covers content. Desktop only; phones scroll natively.
 */
export function ChapterRail({ items }: { items: Item[] }) {
  const nav = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [onDark, setOnDark] = useState(false);
  // Hidden over the opening screen, which should hold nothing but the title.
  const [opening, setOpening] = useState(true);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const els = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-header="dark"]'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let index = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) index = i;
      });
      setCurrent(index);
      setOpening(window.scrollY < window.innerHeight * 0.5);
      const probe = nav.current?.getBoundingClientRect();
      const y = probe ? probe.top + probe.height / 2 : line;
      setOnDark(
        dark.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= y && r.bottom > y;
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    scrollTo(el, { duration: 1.4 });
    el.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      ref={nav}
      aria-label="Capítulos desta página"
      className={`fixed top-1/2 right-[calc(var(--gutter)/2)] z-40 hidden -translate-y-1/2 transition-[color,opacity] duration-500 lg:block ${
        onDark ? "text-papel" : "text-tinta"
      } ${opening ? "opacity-0 focus-within:opacity-100" : "opacity-100"}`}
    >
      <p aria-hidden="true" className="mb-4 text-right font-display text-sm tabular-nums">
        {pad(current + 1)} <span className="opacity-60">/ {pad(items.length)}</span>
      </p>
      <ol className="flex flex-col items-end gap-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => jump(event, item.id)}
              aria-current={i === current ? "step" : undefined}
              className="group flex flex-row-reverse items-center gap-3 py-1 text-xs tracking-[0.12em] uppercase"
            >
              <span
                aria-hidden="true"
                className={`block h-px bg-current transition-[width,opacity] duration-500 ${
                  i === current ? "w-8 opacity-100" : "w-4 opacity-50 group-hover:w-6 group-hover:opacity-100"
                }`}
              />
              <span
                className={`rounded-sm px-2 py-1 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                  onDark ? "bg-mata" : "bg-papel"
                }`}
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
