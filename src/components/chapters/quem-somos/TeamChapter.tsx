import type { Documento, Pessoa, Site } from "@/payload-types";
import { publicPath } from "@/lib/cms/media";

type PessoaPublica = Pick<Pessoa, "id" | "nome" | "grupo" | "cargo" | "formacao"> & { email: string | null };
type Props = { pessoas: PessoaPublica[]; site: Site };

const label = "mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase";

/** Board, fiscal council and technical team, from the `pessoas` collection. */
export function TeamChapter({ pessoas, site }: Props) {
  const grupo = (g: PessoaPublica["grupo"]) => pessoas.filter((p) => p.grupo === g);
  const diretoria = grupo("diretoria");
  const conselho = grupo("conselho-fiscal");
  const equipe = grupo("equipe-tecnica");
  const estatuto = site.estatuto && typeof site.estatuto === "object" ? (site.estatuto as Documento) : null;

  return (
    <div className="bg-papel px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
      <p className={label}>Quem faz</p>
      <h2 className="max-w-4xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata">
        Pessoas de diferentes áreas, um mesmo território.
      </h2>

      <div className="mt-[clamp(3rem,10vh,6rem)] grid gap-16 lg:grid-cols-[1fr_1.6fr]">
        <section aria-labelledby="diretoria">
          <h3 id="diretoria" className={label}>
            Diretoria
          </h3>
          <dl className="divide-y divide-tinta/15 border-y border-tinta/15">
            {diretoria.map((p) => (
              <div key={p.id} className="flex flex-col-reverse py-4">
                <dt className="text-sm text-tinta/70">{p.cargo}</dt>
                <dd className="font-display text-2xl text-mata">{p.nome}</dd>
              </div>
            ))}
          </dl>
          {conselho.length ? (
            <>
              <h3 className={`${label} mt-12`}>Conselho fiscal</h3>
              <ul className="font-display text-xl leading-relaxed text-mata">
                {conselho.map((p) => (
                  <li key={p.id}>{p.nome}</li>
                ))}
              </ul>
            </>
          ) : null}
          {site.mandatoDiretoria ? (
            <p className="mt-8 text-sm text-tinta/70">Mandato: {site.mandatoDiretoria}</p>
          ) : null}
          {estatuto?.url ? (
            <a
              href={publicPath(estatuto.url)}
              download
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-tinta/30 px-6 py-3 text-eyebrow tracking-[0.16em] uppercase hover:border-pinhao hover:text-pinhao"
            >
              Baixar o estatuto <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </section>

        <section aria-labelledby="equipe-tecnica">
          <h3 id="equipe-tecnica" className={label}>
            Equipe técnica
          </h3>
          <ul className="grid gap-x-10 border-t border-tinta/15 sm:grid-cols-2">
            {equipe.map((p) => (
              <li key={p.id} className="border-b border-tinta/15 py-6">
                <p className="font-display text-2xl leading-tight text-mata">{p.nome}</p>
                {p.cargo ? <p className="mt-2 text-tinta/85">{p.cargo}</p> : null}
                {p.formacao ? <p className="mt-1 text-sm text-tinta/70">{p.formacao}</p> : null}
                {p.email ? (
                  <a
                    href={`mailto:${p.email}`}
                    className="mt-2 inline-block text-sm text-pinhao underline-offset-4 hover:underline"
                  >
                    {p.email}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
