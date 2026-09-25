import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getNoticias } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Notícias",
  description: "O que está acontecendo no território: oficinas, projetos e encontros do Centro Vianei.",
};

// Listing layout is refined in phase 6; this version proves the CMS pipeline.
export default async function NoticiasPage() {
  const { docs } = await getNoticias({ limit: 12 });

  return (
    <>
      <section className="bg-neblina px-[var(--gutter)] pt-40 pb-16">
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Agora no território</p>
        <HeroTitle
          className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
          text="Notícias"
        />
      </section>

      <section className="px-[var(--gutter)] py-16">
        {docs.length === 0 ? (
          <p className="text-lead text-tinta/75">Nenhuma notícia publicada ainda.</p>
        ) : (
          <ul className="divide-y divide-tinta/15 border-y border-tinta/15">
            {docs.map((noticia) => {
              const capa = asMidia(noticia.capa);
              const img = capa ? mediaSrc(capa, "miniatura") : null;
              return (
                <li key={noticia.id}>
                  <Link
                    href={`/noticias/${noticia.slug}`}
                    className="group grid gap-4 py-8 md:grid-cols-[10rem_1fr_12rem] md:items-center md:gap-10"
                  >
                    <time
                      dateTime={noticia.publicadoEm}
                      className="text-eyebrow tracking-[0.14em] text-musgo uppercase"
                    >
                      {formatDate(noticia.publicadoEm)}
                    </time>
                    <span>
                      <span className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] leading-tight transition-colors group-hover:text-pinhao">
                        {noticia.titulo}
                      </span>
                      {noticia.resumo ? (
                        <span className="mt-2 block max-w-2xl text-tinta/75">{noticia.resumo}</span>
                      ) : null}
                    </span>
                    {img && capa ? (
                      <Image
                        src={img.url}
                        width={img.width}
                        height={img.height}
                        alt={capa.alt}
                        sizes="(min-width: 768px) 12rem, 100vw"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
