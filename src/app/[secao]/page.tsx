import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/config/site";

// Temporary placeholder for sections that ship in later phases. Each real
// route (e.g. app/noticias) takes precedence over this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams() {
  return site.nav.map((item) => ({ secao: item.href.slice(1) }));
}

function findSection(slug: string) {
  return site.nav.find((item) => item.href === `/${slug}`);
}

export async function generateMetadata({ params }: PageProps<"/[secao]">): Promise<Metadata> {
  const { secao } = await params;
  return { title: findSection(secao)?.label, robots: { index: false } };
}

export default async function SectionPlaceholder({ params }: PageProps<"/[secao]">) {
  const { secao } = await params;
  const section = findSection(secao);
  if (!section) notFound();

  return (
    <section className="flex min-h-svh flex-col justify-end bg-neblina px-[var(--gutter)] pt-32 pb-24">
      <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Em breve</p>
      <HeroTitle
        className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
        text={section.label}
      />
    </section>
  );
}
