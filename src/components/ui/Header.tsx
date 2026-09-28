import { site } from "@/config/site";
import { HeaderShell } from "./HeaderShell";
import { LogoCabecalho } from "./LogoCabecalho";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <HeaderShell>
      <div className="flex items-center justify-between px-[var(--gutter)] py-4 md:py-5">
        <NavLink
          href="/"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label={`${site.name}, página inicial`}
        >
          <LogoCabecalho className="h-10 md:h-12" />
        </NavLink>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-7 text-eyebrow tracking-[0.14em] uppercase">
            {site.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="transition-opacity hover:opacity-60">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <MobileMenu items={site.nav} email={site.email} />
      </div>
    </HeaderShell>
  );
}
