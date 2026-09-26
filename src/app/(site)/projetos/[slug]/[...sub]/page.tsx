import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/cms/ContentPage";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPagina, getPaginaCaminhos, getPaginas, getProjeto } from "@/lib/cms/queries";
import { breadcrumb } from "@/lib/seo";
import { topLevel } from "@/lib/cms/paginas";

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

  const [projeto, abaixo] = await Promise.all([getProjeto(slug), getPaginas(`${caminho}/`)]);
  const filhas = topLevel(abaixo, caminho);
  const nomeProjeto = projeto?.titulo ?? "Projeto";

  return (
    <ContentPage
      back={{ href: `/projetos/${slug}`, label: nomeProjeto }}
      eyebrow="Projeto"
      title={pagina.titulo}
      body={pagina.conteudo}
      path={`/${caminho}`}
    >
      <JsonLd
        data={breadcrumb([
          { name: "Início", path: "/" },
          { name: "Projetos", path: "/projetos" },
          { name: nomeProjeto, path: `/projetos/${slug}` },
          { name: pagina.titulo, path: `/${caminho}` },
        ])}
      />
      {filhas.length ? (
        <nav aria-label={`Páginas em ${pagina.titulo}`} className="mt-16 border-t border-tinta/15 pt-8">
          <ul className="divide-y divide-tinta/15 border-b border-tinta/15">
            {filhas.map((p) => (
              <li key={p.caminho}>
                <Link
                  href={`/${p.caminho}`}
                  className="flex items-center justify-between gap-4 py-4 font-display text-2xl text-mata hover:text-pinhao"
                >
                  {p.titulo} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </ContentPage>
  );
}
