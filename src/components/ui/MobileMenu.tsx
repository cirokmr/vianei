"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

type Item = { href: string; label: string };

/**
 * Full-screen mobile navigation built on a native modal <dialog>: focus is
 * trapped, Esc closes it and the page behind becomes inert for free.
 * Entry animation is CSS (@starting-style), so it costs no JS.
 */
export function MobileMenu({ items, email }: { items: readonly Item[]; email: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const scroll = useSmoothScroll();

  const show = () => {
    dialog.current?.showModal();
    scroll.lock();
    setOpen(true);
  };
  const close = () => dialog.current?.close();

  // Navigating closes the menu.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="-mr-2 p-2 text-eyebrow tracking-[0.18em] uppercase md:hidden"
      >
        Menu
      </button>

      <dialog
        ref={dialog}
        id="menu-mobile"
        aria-label="Menu"
        onClose={() => {
          scroll.unlock();
          setOpen(false);
        }}
        className="mobile-menu m-0 h-svh max-h-none w-screen max-w-none bg-mata p-0 text-papel backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col px-[var(--gutter)] pt-5 pb-10">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-tight">
              Vianei<span aria-hidden="true">.</span>
            </span>
            <button
              type="button"
              onClick={close}
              className="-mr-2 p-2 text-eyebrow tracking-[0.18em] uppercase"
              autoFocus
            >
              Fechar
            </button>
          </div>

          <nav aria-label="Principal" className="mt-auto">
            <ul className="space-y-1">
              {[{ href: "/", label: "Início" }, ...items].map((item, i) => (
                <li key={item.href} className="mobile-menu-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-1 font-display text-[clamp(2.2rem,9vw,3.5rem)] leading-tight font-light aria-[current=page]:text-limao"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a href={`mailto:${email}`} className="mt-10 text-sm text-papel/75 underline-offset-4 hover:underline">
            {email}
          </a>
        </div>
      </dialog>
    </>
  );
}
