import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftBar } from "@/components/cms/DraftBar";
import { RichText } from "@/components/cms/RichText";
import { HorizontalGallery } from "@/components/motion/HorizontalGallery";
import { NoticiaLista } from "@/components/noticias/NoticiaLista";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { JsonLd } from "@/components/ui/JsonLd";
import { areaHref, areas } from "@/config/areas";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getNoticiasDoProjeto, getPaginas, getProjeto, getProjetoSlugs } from "@/lib/cms/queries";
import { topLevel } from "@/lib/cms/paginas";
import { breadcrumb } from "@/lib/seo";
import type { Parceiro } from "@/payload-types";

export async function generateStaticParams() {
  return (await getProjetoSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projeto = await getProjeto(slug);
  if (!projeto) return {};
  const imagem = asMidia(projeto.seo?.imagem) ?? asMidia(projeto.capa);
  const og = imagem ? mediaSrc(imagem, "og") : null;
  return {
    title: projeto.seo?.titulo || projeto.titulo,
    description: projeto.seo?.descricao || projeto.resumo || undefined,
    alternates: { canonical: `/projetos/${projeto.slug}` },
    openGraph: og ? { images: [{ url: og.url, width: og.width, height: og.height, alt: imagem?.alt }] } : undefined,
  };
}

const label = "mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase";

export default async function ProjetoPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const projeto = await getProjeto(slug);
  if (!projeto) notFound();

  const [subpaginas, noticias] = await Promise.all([
    getPaginas(`projetos/${slug}/`),
    getNoticiasDoProjeto(projeto.id, 4),
  ]);
  const path = `/projetos/${projeto.slug}`;
  const capa = asMidia(projeto.capa);
  const img = capa ? mediaSrc(capa, "destaque") : null;
  const temas = areas.filter((a) => projeto.areas?.includes(a.area));
  const financiadores = (projeto.financiadores ?? []).filter((p): p is Parceiro => typeof p === "object");
  const galeria = (projeto.galeria ?? []).map((g) => asMidia(g.imagem)).filter((m) => m !== null);
  const filhas = topLevel(subpaginas, `projetos/${slug}`);

  const titulo = (
    <>
      <p className="mb-6 text-eyebrow tracking-[0.18em] uppercase">
        <Link href="/projetos" className="hover:underline">
          ← Projetos
        </Link>
      </p>
      <HeroTitle
        className="max-w-6xl font-display text-[clamp(2.6rem,1.2rem+5vw,7rem)] leading-[0.95] font-light tracking-[-0.03em]"
        text={projeto.titulo}
      />
      {projeto.resumo ? (
        <p className="hero-fade mt-8 max-w-2xl text-lead leading-snug opacity-90">{projeto.resumo}</p>
      ) : null}
    </>
  );

  return (
    <article>
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Projetos", path: "/projetos" },
          { name: projeto.titulo, path },
        ])}
      />

      {img && capa ? (
        // Pinned cover: the photo holds still (CSS sticky) while the title rises over it.
        <header data-header="dark" className="relative h-[165svh] bg-mata text-papel">
          <div className="sticky top-0 h-svh overflow-hidden">
            <Image src={img.url} alt={capa.alt} fill priority sizes="100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-mata via-mata/55 to-mata/10" />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-[clamp(3rem,10vh,6rem)]">{titulo}</div>
        </header>
      ) : (
        <header className="bg-neblina px-[var(--gutter)] pt-40 pb-14 text-mata">{titulo}</header>
      )}

      <div className="grid gap-16 px-[var(--gutter)] py-16 lg:grid-cols-[minmax(0,68ch)_1fr] lg:gap-[calc(var(--gutter)*2)]">
        <RichText data={projeto.conteudo} />
        <aside aria-label="Sobre o projeto" className="space-y-12 lg:sticky lg:top-28 lg:self-start">
          {temas.length ? (
            <div>
              <h2 className={label}>Áreas</h2>
              <ul className="flex flex-wrap gap-2">
                {temas.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={areaHref(a)}
                      className="inline-block rounded-full border border-tinta/25 px-4 py-2 text-sm hover:border-pinhao hover:text-pinhao"
                    >
                      {a.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {financiadores.length ? (
            <div>
              <h2 className={label}>Apoio</h2>
              <ul className="space-y-1 font-display text-xl text-mata">
                {financiadores.map((f) => (
                  <li key={f.id}>{f.nome}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {filhas.length ? (
            <nav aria-label={`Mais sobre ${projeto.titulo}`}>
              <h2 className={label}>Mais sobre o projeto</h2>
              <ul className="divide-y divide-tinta/15 border-y border-tinta/15">
                {filhas.map((p) => (
                  <li key={p.caminho}>
                    <Link
                      href={`/${p.caminho}`}
                      className="flex items-center justify-between gap-4 py-3 hover:text-pinhao"
                    >
                      {p.titulo} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>

      {galeria.length > 1 ? (
        <HorizontalGallery label={`Fotos do ${projeto.titulo}`} className="py-16">
          {galeria.map((foto) => {
            const src = mediaSrc(foto, "cartao");
            return src ? (
              <figure key={foto.id} className="w-[78vw] shrink-0 snap-start md:w-[40vw]">
                <Image
                  src={src.url}
                  width={src.width}
                  height={src.height}
                  alt={foto.alt}
                  sizes="(min-width: 768px) 40vw, 78vw"
                  className="aspect-[4/3] w-full object-cover"
                />
                {foto.legenda ? <figcaption className="mt-3 text-sm text-tinta/70">{foto.legenda}</figcaption> : null}
              </figure>
            ) : null;
          })}
        </HorizontalGallery>
      ) : null}

      {noticias.length ? (
        <section
          aria-labelledby="noticias-projeto"
          className="border-t border-tinta/15 px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)]"
        >
          <h2 id="noticias-projeto" className="mb-10 font-display text-h2 leading-none tracking-[-0.02em] text-mata">
            Notícias do projeto
          </h2>
          <NoticiaLista noticias={noticias} headingLevel="h3" />
        </section>
      ) : null}

      <DraftBar path={path} />
    </article>
  );
}
