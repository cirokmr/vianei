import type { Metadata } from "next";
import { NoticiasIndex } from "@/components/noticias/NoticiasIndex";
import { getCategorias } from "@/lib/cms/queries";

export async function generateStaticParams() {
  return (await getCategorias()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/noticias/categoria/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const c = (await getCategorias()).find((item) => item.slug === categoria);
  return {
    title: c ? `${c.titulo} · Notícias` : "Notícias",
    alternates: { canonical: `/noticias/categoria/${categoria}` },
  };
}

export default async function NoticiasCategoriaPage({ params }: PageProps<"/noticias/categoria/[categoria]">) {
  const { categoria } = await params;
  return <NoticiasIndex pagina={1} categoria={categoria} />;
}
