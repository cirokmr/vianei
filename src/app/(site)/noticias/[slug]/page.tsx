import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/cms/ContentPage";
import { NoticiaLista } from "@/components/noticias/NoticiaLista";
import { JsonLd } from "@/components/ui/JsonLd";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getNoticia, getNoticiaSlugs, getNoticiasRelacionadas } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";
import { absolute, breadcrumb, organization } from "@/lib/seo";
import type { Categoria, Projeto } from "@/payload-types";

export async function generateStaticParams() {
  return (await getNoticiaSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticia(slug);
  if (!noticia) return {};

  const imagem = asMidia(noticia.seo?.imagem) ?? asMidia(noticia.capa);
  const og = imagem ? mediaSrc(imagem, "og") : null;

  return {
    title: noticia.seo?.titulo || noticia.titulo,
    description: noticia.seo?.descricao || noticia.resumo || undefined,
    alternates: { canonical: `/noticias/${noticia.slug}` },
    openGraph: {
      type: "article",
      publishedTime: noticia.publicadoEm,
      images: og ? [{ url: og.url, width: og.width, height: og.height, alt: imagem?.alt }] : undefined,
    },
  };
}

const populated = <T extends { id: number }>(list: (number | T)[] | null | undefined) =>
  (list ?? []).filter((item): item is T => typeof item === "object");

export default async function NoticiaPage({ params }: PageProps<"/noticias/[slug]">) {
  const { slug } = await params;
  const noticia = await getNoticia(slug);
  if (!noticia) notFound();

  const categorias = populated<Categoria>(noticia.categorias);
  const projetos = populated<Projeto>(noticia.projetos);
  const relacionadas = await getNoticiasRelacionadas(noticia);
  const path = `/noticias/${noticia.slug}`;
  const capa = asMidia(noticia.capa);
  const og = capa ? mediaSrc(capa, "og") : null;

  return (
    <ContentPage
      back={{ href: "/noticias", label: "Notícias" }}
      eyebrow={<time dateTime={noticia.publicadoEm}>{formatDate(noticia.publicadoEm)}</time>}
      title={noticia.titulo}
      lead={noticia.resumo}
      cover={capa}
      body={noticia.conteudo}
      path={path}
    >
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: noticia.titulo,
            description: noticia.resumo ?? undefined,
            datePublished: noticia.publicadoEm,
            dateModified: noticia.updatedAt,
            image: og ? [absolute(og.url)] : undefined,
            mainEntityOfPage: absolute(path),
            author: organization,
            publisher: organization,
          },
          breadcrumb([
            { name: "Início", path: "/" },
            { name: "Notícias", path: "/noticias" },
            { name: noticia.titulo, path },
          ]),
        ]}
      />

      {categorias.length || projetos.length ? (
        <aside
          aria-label="Sobre esta notícia"
          className="mt-16 grid gap-8 border-t border-tinta/15 pt-8 sm:grid-cols-2"
        >
          {categorias.length ? (
            <div>
              <h2 className="mb-3 text-eyebrow tracking-[0.18em] text-musgo uppercase">Temas</h2>
              <ul className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/noticias/categoria/${c.slug}`}
                      className="inline-block rounded-full border border-tinta/25 px-4 py-2 text-sm hover:border-pinhao hover:text-pinhao"
                    >
                      {c.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {projetos.length ? (
            <div>
              <h2 className="mb-3 text-eyebrow tracking-[0.18em] text-musgo uppercase">Projeto</h2>
              <ul className="space-y-2">
                {projetos.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projetos/${p.slug}`} className="text-pinhao underline-offset-4 hover:underline">
                      {p.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      ) : null}

      {relacionadas.length ? (
        <section aria-labelledby="leia-tambem" className="mt-20">
          <h2
            id="leia-tambem"
            className="mb-6 font-display text-[clamp(1.8rem,1.3rem+1.8vw,3rem)] leading-none tracking-[-0.02em] text-mata"
          >
            Leia também
          </h2>
          <NoticiaLista noticias={relacionadas} headingLevel="h3" />
        </section>
      ) : null}
    </ContentPage>
  );
}
