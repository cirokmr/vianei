import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Midia } from "@/payload-types";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { mediaSrc } from "@/lib/cms/media";
import { DraftBar } from "./DraftBar";
import { RichText } from "./RichText";

type Props = {
  eyebrow: ReactNode;
  back?: { href: string; label: string };
  title: string;
  lead?: string | null;
  cover?: Midia | null;
  body: SerializedEditorState | null | undefined;
  path: string;
  children?: ReactNode;
};

/** Shared editorial layout for CMS-driven pages (news, projects, pages). */
export function ContentPage({ eyebrow, back, title, lead, cover, body, path, children }: Props) {
  const img = cover ? mediaSrc(cover, "destaque") : null;

  return (
    <article>
      <header className="bg-neblina px-[var(--gutter)] pt-40 pb-14">
        <p className="mb-6 flex flex-wrap gap-x-4 text-eyebrow tracking-[0.18em] text-musgo uppercase">
          {back ? (
            <Link href={back.href} className="hover:text-pinhao">
              ← {back.label}
            </Link>
          ) : null}
          {eyebrow}
        </p>
        <HeroTitle
          className="max-w-6xl font-display text-[clamp(2.4rem,1.2rem+4.6vw,6.5rem)] leading-[0.98] font-light tracking-[-0.03em] text-mata"
          text={title}
        />
        {lead ? <p className="hero-fade mt-8 max-w-2xl text-lead leading-snug text-tinta/80">{lead}</p> : null}
      </header>

      {img && cover ? (
        <figure className="px-[var(--gutter)]">
          <Image
            src={img.url}
            width={img.width}
            height={img.height}
            alt={cover.alt}
            priority
            sizes="(min-width: 1600px) 1520px, calc(100vw - 2 * var(--gutter))"
            className="max-h-[80svh] w-full object-cover"
          />
          {cover.legenda || cover.credito ? (
            <figcaption className="mt-3 text-sm text-tinta/70">
              {cover.legenda}
              {cover.credito ? <span className="ml-2 tracking-[0.12em] uppercase">{cover.credito}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="px-[var(--gutter)] py-16 md:pl-[max(var(--gutter),calc((100vw-68ch)/2))]">
        <RichText data={body} />
        {children}
      </div>

      <DraftBar path={path} />
    </article>
  );
}
