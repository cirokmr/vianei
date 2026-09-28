import type { Metadata } from "next";
import { Filtros } from "@/components/noticias/Filtros";
import { NoticiaLista } from "@/components/noticias/NoticiaLista";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategorias, searchNoticias } from "@/lib/cms/queries";

export const metadata: Metadata = { title: "Buscar notícias", robots: { index: false, follow: true } };

export default async function BuscaPage({ searchParams }: PageProps<"/noticias/busca">) {
  const q = (await searchParams).q;
  const termo = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const [categorias, resultados] = await Promise.all([getCategorias(), searchNoticias(termo)]);

  return (
    <>
      <PageHeader eyebrow="Notícias" title="Buscar" />
      <section aria-label="Resultados da busca" className="px-[var(--gutter)] py-12">
        <Filtros categorias={categorias} busca={termo} />
        <p role="status" className="mt-12 text-lead text-tinta/80">
          {termo.length < 2
            ? "Digite ao menos duas letras."
            : resultados.length
              ? `${resultados.length} ${resultados.length === 1 ? "notícia encontrada" : "notícias encontradas"} para “${termo}”.`
              : `Nenhuma notícia encontrada para “${termo}”.`}
        </p>
        {resultados.length ? (
          <div className="mt-8">
            <NoticiaLista noticias={resultados} />
          </div>
        ) : null}
      </section>
    </>
  );
}
