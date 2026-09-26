import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/cms/ContentPage";
import { getPagina, getPaginaCaminhos } from "@/lib/cms/queries";

export async function generateStaticParams() {
  return (await getPaginaCaminhos("projetos/"))
    .map((caminho) => caminho.split("/"))
    .filter((parts) => parts.length > 2)
    .map(([, slug, ...sub]) => ({ slug, sub }));
}

async function load(params: PageProps<"/projetos/[slug]/[...sub]">["params"]) {
  const { slug, sub } = await params;
  const caminho = ["projetos", slug, ...sub].join("/");
  return { slug, caminho, pagina: await getPagina(caminho) };
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]/[...sub]">): Promise<Metadata> {
  const { caminho, pagina } = await load(params);
  if (!pagina) return {};
  return {
    title: pagina.seo?.titulo || pagina.titulo,
    description: pagina.seo?.descricao || undefined,
    alternates: { canonical: `/${caminho}` },
  };
}

export default async function SubpaginaProjeto({ params }: PageProps<"/projetos/[slug]/[...sub]">) {
  const { slug, caminho, pagina } = await load(params);
  if (!pagina) notFound();

  return (
    <ContentPage
      back={{ href: `/projetos/${slug}`, label: "Projeto" }}
      eyebrow="Projeto"
      title={pagina.titulo}
      body={pagina.conteudo}
      path={`/${caminho}`}
    />
  );
}
