import type { ReactNode } from "react";
import { HeroTitle } from "./HeroTitle";

type Props = { eyebrow: ReactNode; title: string; lead?: ReactNode; children?: ReactNode; dark?: boolean };

/** Opening block shared by the content indexes (news, projects, library…). */
export function PageHeader({ eyebrow, title, lead, children, dark = false }: Props) {
  return (
    <header
      data-header={dark ? "dark" : undefined}
      className={`px-[var(--gutter)] pt-40 pb-14 ${dark ? "bg-mata text-papel" : "bg-neblina"}`}
    >
      <p className={`mb-6 text-eyebrow tracking-[0.18em] uppercase ${dark ? "text-limao" : "text-musgo"}`}>{eyebrow}</p>
      <HeroTitle
        className={`font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] ${dark ? "" : "text-mata"}`}
        text={title}
      />
      {lead ? (
        <p className={`hero-fade mt-8 max-w-2xl text-lead leading-snug ${dark ? "text-papel/85" : "text-tinta/80"}`}>
          {lead}
        </p>
      ) : null}
      {children}
    </header>
  );
}
