import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoticiaLista } from "@/components/noticias/NoticiaLista";
import { ClipImage } from "@/components/motion/ClipImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { JsonLd } from "@/components/ui/JsonLd";
import { areaHref, areas, findArea, frentes } from "@/config/areas";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getCategorias, getNoticias, getProjetos } from "@/lib/cms/queries";
import { breadcrumb } from "@/lib/seo";

// No `dynamicParams = false`: in Next 16 a tag revalidation makes such pages
// fail with NoFallbackError (404). Unknown areas still 404 via notFound().
export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/atuacao/[area]">): Promise<Metadata> {
  const area = findArea((await params).area);
  if (!area) return {};
  return { title: area.titulo, description: area.texto, alternates: { canonical: areaHref(area) } };
}

const label = "mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase";

export default async function AreaPage({ params }: PageProps<"/atuacao/[area]">) {
  const area = findArea((await params).area);
  if (!area) notFound();

  const [projetos, categorias] = await Promise.all([getProjetos(), getCategorias()]);
  const categoria = categorias.find((c) => c.slug === area.categoria);
  const noticias = categoria ? (await getNoticias({ limit: 4, categoria: categoria.id })).docs : [];
  const daArea = projetos.filter((p) => p.areas?.includes(area.area));
  const itens = frentes.filter((f) => f.area === area.slug);
  const outras = areas.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Atuação", path: "/atuacao" },
          { name: area.titulo, path: areaHref(area) },
        ])}
      />
      <header className="grid gap-10 bg-neblina px-[var(--gutter)] pt-40 pb-[clamp(3rem,8vh,5rem)] md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <p className={label}>
            <Link href="/atuacao" className="hover:text-pinhao">
              ← Atuação
            </Link>
          </p>
          <HeroTitle
            className="font-display text-[clamp(3rem,1.4rem+6vw,8.5rem)] leading-[0.92] font-light tracking-[-0.035em] text-mata"
            text={area.titulo}
          />
          <p className="hero-fade mt-8 max-w-xl text-lead leading-snug text-tinta/85">{area.texto}</p>
        </div>
        <ClipImage className="aspect-[4/5] max-h-[70svh]">
          <Image src={area.foto} alt={area.alt} sizes="(min-width: 768px) 45vw, 100vw" priority />
        </ClipImage>
      </header>

      {itens.length ? (
        <section aria-labelledby="frentes" className="px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)]">
          <h2 id="frentes" className={label}>
            O que fazemos
          </h2>
          <ol className="max-w-5xl border-t border-tinta/15">
            {itens.map((item, i) => (
              <li key={item.texto} className="flex gap-6 border-b border-tinta/15 py-6">
                <span aria-hidden="true" className="w-8 shrink-0 pt-1 font-display text-sm text-musgo tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(1.3rem,1.1rem+0.8vw,2rem)] leading-snug text-mata">
                  {item.texto}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {daArea.length ? (
        <section
          aria-labelledby="projetos-area"
          data-header="dark"
          className="bg-mata px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)] text-papel"
        >
          <h2 id="projetos-area" className="mb-6 text-eyebrow tracking-[0.18em] text-limao uppercase">
            Projetos
          </h2>
          <SplitReveal as="p" onScroll className="mb-12 max-w-4xl font-display text-h2 leading-[1] tracking-[-0.02em]">
            {daArea.length === 1 ? "Um projeto nesta frente." : `${daArea.length} projetos nesta frente.`}
          </SplitReveal>
          <ul className="grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {daArea.map((p) => {
              const capa = asMidia(p.capa);
              const img = capa ? mediaSrc(capa, "cartao") : null;
              return (
                <li key={p.id}>
                  <article className="group relative">
                    {img && capa ? (
                      <Image
                        src={img.url}
                        width={img.width}
                        height={img.height}
                        alt=""
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div aria-hidden="true" className="aspect-[4/3] w-full bg-papel/10" />
                    )}
                    <h3 className="mt-4 font-display text-2xl leading-tight">
                      <Link
                        href={`/projetos/${p.slug}`}
                        className="group-hover:text-limao after:absolute after:inset-0"
                      >
                        {p.titulo}
                      </Link>
                    </h3>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {noticias.length && categoria ? (
        <section aria-labelledby="noticias-area" className="px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 id="noticias-area" className="font-display text-h2 leading-none tracking-[-0.02em] text-mata">
              Notícias
            </h2>
            <Link
              href={`/noticias/categoria/${categoria.slug}`}
              className="text-eyebrow tracking-[0.16em] text-pinhao uppercase underline-offset-4 hover:underline"
            >
              Todas sobre {area.titulo.toLowerCase()} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <NoticiaLista noticias={noticias} headingLevel="h3" />
        </section>
      ) : null}

      <nav aria-label="Outras áreas" className="border-t border-tinta/15 bg-papel px-[var(--gutter)] py-12">
        <p className={label}>Outras áreas</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-4">
          {outras.map((a) => (
            <li key={a.slug}>
              <Link href={areaHref(a)} className="font-display text-2xl text-mata hover:text-pinhao">
                {a.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
