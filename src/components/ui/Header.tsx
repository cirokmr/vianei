import Link from "next/link";
import { site } from "@/config/site";
import { HeaderTone } from "./HeaderTone";

export function Header() {
  return (
    <header
      data-site-header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 text-tinta transition-colors duration-500 data-[on-dark]:text-papel"
    >
      <HeaderTone />
      <div className="flex items-center justify-between px-[var(--gutter)] py-5">
        <Link
          href="/"
          className="pointer-events-auto font-display text-xl tracking-tight"
          aria-label={`${site.shortName}, página inicial`}
        >
          Vianei<span aria-hidden="true">.</span>
        </Link>
        <nav aria-label="Principal" className="pointer-events-auto hidden md:block">
          <ul className="flex gap-7 text-eyebrow tracking-[0.14em] uppercase">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-opacity hover:opacity-60">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
