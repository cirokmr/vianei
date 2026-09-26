import Link from "next/link";
import { site } from "@/config/site";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <HeaderShell>
      <div className="flex items-center justify-between px-[var(--gutter)] py-4 md:py-5">
        <Link href="/" className="font-display text-xl tracking-tight" aria-label={`${site.shortName}, página inicial`}>
          Vianei<span aria-hidden="true">.</span>
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
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
        <MobileMenu items={site.nav} email={site.email} />
      </div>
    </HeaderShell>
  );
}
