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
      <header className="bg-neblina px-[var(--gutter)] pt-[clamp(8rem,20vh,11rem)] pb-14">
        <p className="mb-6 flex flex-wrap gap-x-4 text-eyebrow tracking-[0.18em] text-musgo uppercase">
          {back ? (
            <Link href={back.href} className="hover:text-pinhao">
              ← {back.label}
            </Link>
          ) : null}
          {eyebrow}
        </p>
        <HeroTitle
          className="max-w-5xl font-display text-[clamp(2.1rem,1.2rem+3vw,4.5rem)] leading-[1.02] font-light tracking-[-0.025em] text-mata"
          text={title}
        />
        {lead ? <p className="hero-fade mt-6 max-w-2xl text-lead leading-snug text-tinta/80">{lead}</p> : null}
      </header>

      {img && cover ? (
        // Whole image, never cropped: covers are often event posters with dates and
        // places on them. It sits on the header band's edge.
        <figure className="bg-linear-to-b from-neblina from-50% to-transparent to-50% px-[var(--gutter)]">
          <Image
            src={img.url}
            width={img.width}
            height={img.height}
            alt={cover.alt}
            priority
            sizes="(min-width: 1200px) 1100px, calc(100vw - 2 * var(--gutter))"
            className="mx-auto h-auto max-h-[78svh] w-auto max-w-full"
          />
          {cover.legenda || cover.credito ? (
            <figcaption className="mx-auto mt-3 max-w-[66ch] text-sm text-tinta/70">
              {cover.legenda}
              {cover.credito ? <span className="ml-2 tracking-[0.12em] uppercase">{cover.credito}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="px-[var(--gutter)] py-[clamp(3rem,8vh,5rem)]">
        <RichText data={body} className="mx-auto" />
      </div>
      {children ? <div className="px-[var(--gutter)] pb-[clamp(4rem,10vh,7rem)]">{children}</div> : null}

      <DraftBar path={path} />
    </article>
  );
}
