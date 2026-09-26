import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/cms/ContentPage";
import { asMidia } from "@/lib/cms/media";
import { getPaginaCaminhos, getProjeto, getProjetoSlugs } from "@/lib/cms/queries";

export async function generateStaticParams() {
  return (await getProjetoSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projeto = await getProjeto(slug);
  if (!projeto) return {};
  return {
    title: projeto.seo?.titulo || projeto.titulo,
    description: projeto.seo?.descricao || projeto.resumo || undefined,
    alternates: { canonical: `/projetos/${projeto.slug}` },
  };
}

// Layout refined in phase 6.
export default async function ProjetoPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const projeto = await getProjeto(slug);
  if (!projeto) notFound();
  const subpaginas = await getPaginaCaminhos(`projetos/${slug}/`);

  return (
    <ContentPage
      back={{ href: "/projetos", label: "Projetos" }}
      // Project status stays internal for now (see DECISIONS.md).
      eyebrow="Projeto"
      title={projeto.titulo}
      lead={projeto.resumo}
      cover={asMidia(projeto.capa)}
      body={projeto.conteudo}
      path={`/projetos/${projeto.slug}`}
    >
      {subpaginas.length ? (
        <nav aria-label={`Mais sobre ${projeto.titulo}`} className="mt-16 border-t border-tinta/15 pt-8">
          <h2 className="mb-4 text-eyebrow tracking-[0.18em] text-musgo uppercase">Mais sobre o projeto</h2>
          <ul className="space-y-2 text-lead">
            {subpaginas.map((caminho) => (
              <li key={caminho}>
                <Link href={`/${caminho}`} className="underline-offset-4 hover:text-pinhao hover:underline">
                  {caminho.split("/").pop()?.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </ContentPage>
  );
}
