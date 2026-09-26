import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoticiasIndex, paginaParam } from "@/components/noticias/NoticiasIndex";
import { getNoticias } from "@/lib/cms/queries";

export async function generateStaticParams() {
  const { totalPages } = await getNoticias();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ pagina: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/noticias/pagina/[pagina]">): Promise<Metadata> {
  const { pagina } = await params;
  return { title: `Notícias · página ${pagina}`, alternates: { canonical: `/noticias/pagina/${pagina}` } };
}

export default async function NoticiasPaginaPage({ params }: PageProps<"/noticias/pagina/[pagina]">) {
  const pagina = paginaParam((await params).pagina);
  if (!pagina) notFound();
  return <NoticiasIndex pagina={pagina} />;
}
