import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipImage } from "@/components/motion/ClipImage";
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
                  <ClipImage className="aspect-[16/10]" from={i % 2 ? "right" : "left"}>
                    <Image
                      src={img.url}
                      width={img.width}
                      height={img.height}
                      alt=""
                      sizes="(min-width: 768px) 48vw, 100vw"
                      priority={i === 0}
                    />
                  </ClipImage>
                ) : (
                  <div
                    aria-hidden="true"
                    className="grid aspect-[16/10] place-items-center bg-neblina font-display text-[clamp(4rem,10vw,9rem)] font-light text-musgo"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
                <div>
                  {temas.length ? (
                    <p className="text-eyebrow tracking-[0.14em] text-musgo uppercase">{temas.join(" · ")}</p>
                  ) : null}
                  <h2 className="mt-4 font-display text-[clamp(2rem,1.3rem+2.6vw,3.8rem)] leading-[1] tracking-[-0.02em] text-mata">
                    <Link
                      href={`/projetos/${projeto.slug}`}
                      data-cursor="Ver"
                      className="group-hover:text-pinhao after:absolute after:inset-0"
                    >
                      {projeto.titulo}
                    </Link>
                  </h2>
                  {projeto.resumo ? (
                    <p className="mt-5 max-w-xl text-lead leading-snug text-tinta/80">{projeto.resumo}</p>
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
