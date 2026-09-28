import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { areas } from "@/config/areas";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getProjetos } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos do Centro Vianei em agroecologia, educação popular, restauração florestal e SAT Pinhão.",
  alternates: { canonical: "/projetos" },
};

const areaTitulo = (valor: string) => areas.find((a) => a.area === valor)?.titulo;

export default async function ProjetosPage() {
  const projetos = await getProjetos();

  return (
    <>
      <PageHeader
        eyebrow="O que fazemos"
        title="Projetos"
        lead="Iniciativas com agricultoras e agricultores familiares, assentados e extrativistas, em parceria com organizações do Brasil e de fora."
      />
      {projetos.length ? null : (
        <p className="px-[var(--gutter)] py-16 text-lead text-tinta/75">Nenhum projeto publicado ainda.</p>
      )}
      <ul className="px-[var(--gutter)] py-[clamp(3rem,8vh,5rem)] empty:hidden">
        {projetos.map((projeto, i) => {
          const capa = asMidia(projeto.capa);
          const img = capa ? mediaSrc(capa, "destaque") : null;
          const temas = (projeto.areas ?? []).map(areaTitulo).filter(Boolean);
          return (
            <li key={projeto.id} className="border-t border-tinta/15 py-12 last:border-b">
              <article
                className={`group relative grid gap-8 md:grid-cols-2 md:items-center md:gap-[var(--gutter)] ${
                  i % 2 ? "md:[&>*:first-child]:order-last" : ""
                }`}
              >
                {img && capa ? (
                  // Covers are the projects' logos: shown whole, on white, with room around them.
                  <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-white">
                    <Image
                      src={img.url}
                      width={img.width}
                      height={img.height}
                      alt=""
                      sizes="(min-width: 768px) 34vw, 70vw"
                      priority={i === 0}
                      className="max-h-[62%] w-auto max-w-[72%] object-contain transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  // No cover yet: the Planalto's araucárias, faint, instead of an empty box.
                  <div aria-hidden="true" className="relative aspect-[16/10] overflow-hidden bg-neblina">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/ilustracoes/araucarias.svg"
                      alt=""
                      loading="lazy"
                      className="absolute inset-x-0 bottom-0 h-[70%] w-full object-cover object-bottom opacity-25"
                    />
                  </div>
                )}
                <div>
                  {temas.length ? (
                    <p className="text-eyebrow tracking-[0.14em] text-musgo uppercase">{temas.join(" · ")}</p>
                  ) : null}
                  <h2 className="mt-3 font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.9rem)] leading-[1.05] tracking-[-0.02em] text-mata">
                    <Link
                      href={`/projetos/${projeto.slug}`}
                      data-cursor="Ver"
                      className="group-hover:text-pinhao after:absolute after:inset-0"
                    >
                      {projeto.titulo}
                    </Link>
                  </h2>
                  {projeto.resumo ? (
                    <p className="mt-4 line-clamp-4 max-w-xl leading-relaxed text-tinta/75">{projeto.resumo}</p>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
