import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoticiasIndex, paginaParam } from "@/components/noticias/NoticiasIndex";

// Rendered on demand, then cached like the rest (categories rarely pass 2 pages).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/noticias/categoria/[categoria]/pagina/[pagina]">): Promise<Metadata> {
  const { categoria, pagina } = await params;
  return { alternates: { canonical: `/noticias/categoria/${categoria}/pagina/${pagina}` } };
}

export default async function NoticiasCategoriaPaginaPage({
  params,
}: PageProps<"/noticias/categoria/[categoria]/pagina/[pagina]">) {
  const { categoria, pagina } = await params;
  const n = paginaParam(pagina);
  if (!n) notFound();
  return <NoticiasIndex pagina={n} categoria={categoria} />;
}
