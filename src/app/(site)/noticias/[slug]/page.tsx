import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftBar } from "@/components/cms/DraftBar";
import { RichText } from "@/components/cms/RichText";
import { HeroTitle } from "@/components/ui/HeroTitle";
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

  const capa = asMidia(noticia.capa);
  const img = capa ? mediaSrc(capa, "destaque") : null;

  return (
    <article>
      <header className="bg-neblina px-[var(--gutter)] pt-40 pb-14">
        <p className="mb-6 flex flex-wrap gap-x-4 text-eyebrow tracking-[0.18em] text-musgo uppercase">
          <Link href="/noticias" className="hover:text-pinhao">
            ← Notícias
          </Link>
          <time dateTime={noticia.publicadoEm}>{formatDate(noticia.publicadoEm)}</time>
        </p>
        <HeroTitle
          className="max-w-6xl font-display text-[clamp(2.4rem,1.2rem+4.6vw,6.5rem)] leading-[0.98] font-light tracking-[-0.03em] text-mata"
          text={noticia.titulo}
        />
        {noticia.resumo ? (
          <p className="hero-fade mt-8 max-w-2xl text-lead leading-snug text-tinta/80">{noticia.resumo}</p>
        ) : null}
      </header>

      {img && capa ? (
        <figure className="px-[var(--gutter)]">
          <Image
            src={img.url}
            width={img.width}
            height={img.height}
            alt={capa.alt}
            priority
            sizes="(min-width: 1600px) 1520px, calc(100vw - 2 * var(--gutter))"
            className="max-h-[80svh] w-full object-cover"
          />
          {capa.legenda || capa.credito ? (
            <figcaption className="mt-3 text-sm text-tinta/70">
              {capa.legenda}
              {capa.credito ? <span className="ml-2 tracking-[0.12em] uppercase">Foto: {capa.credito}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="px-[var(--gutter)] py-16 md:pl-[max(var(--gutter),calc((100vw-68ch)/2))]">
        <RichText data={noticia.conteudo} />
      </div>

      <DraftBar path={`/noticias/${noticia.slug}`} />
    </article>
  );
}
