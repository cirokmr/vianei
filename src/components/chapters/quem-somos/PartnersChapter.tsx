import Image from "next/image";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import type { Parceiro } from "@/payload-types";

const label = "mb-6 text-eyebrow tracking-[0.18em] text-limao uppercase";

function Lista({ titulo, parceiros, nivel }: { titulo: string; parceiros: Parceiro[]; nivel: "h2" | "h3" }) {
  if (!parceiros.length) return null;
  const Heading = nivel;
  return (
    <section aria-label={titulo} className="mt-14">
      <Heading className={label}>{titulo}</Heading>
      <ul className="grid border-t border-papel/15 sm:grid-cols-2 lg:grid-cols-3">
        {parceiros.map((p) => {
          const logo = asMidia(p.logo);
          const src = logo ? mediaSrc(logo, "miniatura") : null;
          const nome = (
            <>
              {src && logo ? (
                <Image
                  src={src.url}
                  width={src.width}
                  height={src.height}
                  alt=""
                  className="mb-4 h-10 w-auto object-contain"
                />
              ) : null}
              <span className="block font-display text-2xl leading-tight">{p.nome}</span>
              {p.descricao ? <span className="mt-1 block text-sm text-papel/70">{p.descricao}</span> : null}
            </>
          );
          return (
            <li key={p.id} className="border-b border-papel/15 py-6 sm:pr-8">
              {p.site ? (
                <a href={p.site} target="_blank" rel="noopener noreferrer" className="block hover:text-limao">
                  {nome}
                </a>
              ) : (
                nome
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Supporters (funders) and partners, from the `parceiros` collection. */
export function PartnersChapter({ parceiros, semTitulo = false }: { parceiros: Parceiro[]; semTitulo?: boolean }) {
  return (
    <div
      data-header="dark"
      className={`bg-mata px-[var(--gutter)] text-papel ${semTitulo ? "pb-[clamp(5rem,14vh,9rem)]" : "py-[clamp(5rem,14vh,9rem)]"}`}
    >
      {semTitulo ? null : (
        <>
          <p className={label}>Apoiadores e parceiros</p>
          <h2 className="max-w-4xl font-display text-h2 leading-[0.98] tracking-[-0.025em]">
            Cooperação internacional, organismos públicos e privados, gente do lugar.
          </h2>
        </>
      )}
      <Lista
        titulo="Apoiadores"
        nivel={semTitulo ? "h2" : "h3"}
        parceiros={parceiros.filter((p) => p.tipo === "apoiador")}
      />
      <Lista
        titulo="Parceiros"
        nivel={semTitulo ? "h2" : "h3"}
        parceiros={parceiros.filter((p) => p.tipo === "parceiro")}
      />
    </div>
  );
}
