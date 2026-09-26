import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/cms/ContentPage";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import { getNoticia, getNoticiaSlugs } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

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

export default async function NoticiaPage({ params }: PageProps<"/noticias/[slug]">) {
  const { slug } = await params;
  const noticia = await getNoticia(slug);
  if (!noticia) notFound();

  return (
    <ContentPage
      back={{ href: "/noticias", label: "Notícias" }}
      eyebrow={<time dateTime={noticia.publicadoEm}>{formatDate(noticia.publicadoEm)}</time>}
      title={noticia.titulo}
      lead={noticia.resumo}
      cover={asMidia(noticia.capa)}
      body={noticia.conteudo}
      path={`/noticias/${noticia.slug}`}
    />
  );
}
