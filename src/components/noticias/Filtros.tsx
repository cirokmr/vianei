import Link from "next/link";
import type { Categoria } from "@/payload-types";

type Props = { categorias: Pick<Categoria, "id" | "titulo" | "slug">[]; ativa?: string | null; busca?: string };

/** Category chips and a GET search form (works without JS). */
export function Filtros({ categorias, ativa = null, busca = "" }: Props) {
  const chip = "inline-block rounded-full border px-4 py-2 text-sm transition-colors";
  const on = "border-mata bg-mata text-papel";
  const off = "border-tinta/25 hover:border-pinhao hover:text-pinhao";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <nav aria-label="Filtrar por tema">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/noticias"
              aria-current={!ativa && !busca ? "page" : undefined}
              className={`${chip} ${!ativa && !busca ? on : off}`}
            >
              Todas
            </Link>
          </li>
          {categorias.map((c) => (
            <li key={c.id}>
              <Link
                href={`/noticias/categoria/${c.slug}`}
                aria-current={ativa === c.slug ? "page" : undefined}
                className={`${chip} ${ativa === c.slug ? on : off}`}
              >
                {c.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <form
        action="/noticias/busca"
        role="search"
        className="flex w-full max-w-sm items-center gap-2 border-b border-tinta/30 focus-within:border-pinhao"
      >
        <label htmlFor="busca-noticias" className="sr-only">
          Buscar notícias
        </label>
        <input
          id="busca-noticias"
          name="q"
          type="search"
          defaultValue={busca}
          minLength={2}
          required
          placeholder="Buscar notícias"
          className="w-full bg-transparent py-3 outline-none placeholder:text-tinta/60"
        />
        <button type="submit" className="px-2 py-3 text-eyebrow tracking-[0.14em] uppercase hover:text-pinhao">
          Buscar
        </button>
      </form>
    </div>
  );
}
