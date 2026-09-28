import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/marca/centro-vianei-cabecalho.webp";
import { site } from "@/config/site";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <HeaderShell>
      <div className="flex items-center justify-between px-[var(--gutter)] py-4 md:py-5">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-80"
          aria-label={`${site.name}, página inicial`}
        >
          <Image
            src={logo}
            // 288 px file made for this spot (2x): no resizing round trip on every page.
            unoptimized
            alt=""
            className="h-10 w-auto md:h-12"
          />
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
