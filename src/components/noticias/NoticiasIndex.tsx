import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategorias, getNoticias } from "@/lib/cms/queries";
import { Filtros } from "./Filtros";
import { NoticiaLista } from "./NoticiaLista";
import { Paginacao } from "./Paginacao";

type Props = { pagina: number; categoria?: string };

/** /noticias, /noticias/pagina/N and /noticias/categoria/X[/pagina/N]. */
export async function NoticiasIndex({ pagina, categoria }: Props) {
  const categorias = await getCategorias();
  const ativa = categoria ? categorias.find((c) => c.slug === categoria) : undefined;
  if (categoria && !ativa) notFound();

  const { docs, totalPages } = await getNoticias({ page: pagina, categoria: ativa?.id });
  if (pagina > 1 && !docs.length) notFound();

  const base = ativa ? `/noticias/categoria/${ativa.slug}` : "/noticias";
  const href = (n: number) => (n === 1 ? base : `${base}/pagina/${n}`);

  return (
    <>
      <PageHeader
        eyebrow={ativa ? `Notícias · ${ativa.titulo}` : "Agora no território"}
        title={ativa ? ativa.titulo : "Notícias"}
        lead={
          ativa
            ? undefined
            : "Oficinas, encontros e projetos do Centro Vianei com agricultoras, agricultores e extrativistas do Planalto Catarinense."
        }
      />
      <section aria-label="Lista de notícias" className="px-[var(--gutter)] py-12">
        <Filtros categorias={categorias} ativa={ativa?.slug} />
        <div className="mt-12">
          {docs.length ? (
            <NoticiaLista noticias={docs} destaque={pagina === 1 && !ativa} />
          ) : (
            <p className="text-lead text-tinta/75">Nenhuma notícia publicada ainda.</p>
          )}
        </div>
        <Paginacao pagina={pagina} total={totalPages} href={href} />
      </section>
    </>
  );
}

export const paginaParam = (value: string) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 2 ? n : null;
};
