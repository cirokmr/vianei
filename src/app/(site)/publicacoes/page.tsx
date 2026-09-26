import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { asMidia, mediaSrc, publicPath } from "@/lib/cms/media";
import { getPublicacoes } from "@/lib/cms/queries";
import type { Documento } from "@/payload-types";

export const metadata: Metadata = {
  title: "Publicações",
  description: "Cartilhas, livros, revistas e relatórios do Centro Vianei e de parceiros, para ler e baixar.",
  alternates: { canonical: "/publicacoes" },
};

const tamanho = (bytes?: number | null) =>
  bytes ? `${(bytes / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB` : null;

export default async function PublicacoesPage() {
  const publicacoes = await getPublicacoes();
  const anos = [...new Set(publicacoes.map((p) => p.ano ?? 0))];

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Publicações"
        lead="Cartilhas, livros e relatórios produzidos pelo Centro Vianei e por parceiros. Leitura livre."
      />
      <div className="px-[var(--gutter)] py-[clamp(3rem,8vh,5rem)]">
        {anos.length ? null : <p className="text-lead text-tinta/75">Nenhuma publicação disponível ainda.</p>}
        {anos.map((ano, secao) => (
          <section
            key={ano}
            aria-labelledby={`ano-${ano}`}
            className="grid gap-8 border-t border-tinta/15 py-12 lg:grid-cols-[10rem_1fr]"
          >
            <h2
              id={`ano-${ano}`}
              className="font-display text-[clamp(2.4rem,1.6rem+3vw,4.5rem)] leading-none font-light text-musgo"
            >
              {ano || "Sem data"}
            </h2>
            <ul className="grid gap-x-[var(--gutter)] gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {publicacoes
                .filter((p) => (p.ano ?? 0) === ano)
                .map((p, i) => {
                  const capa = asMidia(p.capa);
                  const img = capa ? mediaSrc(capa, "cartao") : null;
                  const arquivo = p.arquivo && typeof p.arquivo === "object" ? (p.arquivo as Documento) : null;
                  const href = arquivo?.url ? publicPath(arquivo.url) : p.linkExterno;
                  const externo = !arquivo?.url && Boolean(p.linkExterno);
                  return (
                    <li key={p.id}>
                      <article className="group relative flex h-full flex-col">
                        <div className="relative aspect-[3/4] w-full max-w-[18rem] overflow-hidden bg-neblina shadow-[0_18px_40px_-24px_rgb(28_38_22/0.55)] sm:max-w-none">
                          {img && capa ? (
                            <Image
                              src={img.url}
                              alt=""
                              fill
                              priority={secao === 0 && i === 0}
                              quality={60}
                              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 18rem"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                          ) : null}
                        </div>
                        <h3 className="mt-5 font-display text-2xl leading-tight text-mata">{p.titulo}</h3>
                        {p.autoria ? <p className="mt-2 text-sm text-tinta/70">{p.autoria}</p> : null}
                        {p.descricao ? <p className="mt-3 line-clamp-4 text-tinta/80">{p.descricao}</p> : null}
                        {href ? (
                          <a
                            href={href}
                            {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : { download: "" })}
                            className="mt-auto inline-flex items-center gap-2 pt-5 text-eyebrow tracking-[0.14em] text-pinhao uppercase after:absolute after:inset-0 hover:underline"
                          >
                            {externo ? "Ler online" : "Baixar PDF"}
                            <span className="sr-only">: {p.titulo}</span>
                            {!externo && tamanho(arquivo?.filesize) ? (
                              <span className="text-tinta/70 normal-case">({tamanho(arquivo?.filesize)})</span>
                            ) : null}
                            <span aria-hidden="true">{externo ? "↗" : "↓"}</span>
                          </a>
                        ) : null}
                      </article>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
