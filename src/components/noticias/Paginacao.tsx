import Link from "next/link";

type Props = { pagina: number; total: number; href: (pagina: number) => string };

/** Numbered pagination with previous/next, as plain links (crawlable, no JS). */
export function Paginacao({ pagina, total, href }: Props) {
  if (total <= 1) return null;
  const paginas = Array.from({ length: total }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === total || Math.abs(n - pagina) <= 1,
  );

  const item = "grid size-11 place-items-center rounded-full text-sm tabular-nums";
  return (
    <nav aria-label="Paginação" className="mt-14 flex flex-wrap items-center gap-2">
      {pagina > 1 ? (
        <Link
          href={href(pagina - 1)}
          rel="prev"
          className="mr-4 text-eyebrow tracking-[0.14em] uppercase hover:text-pinhao"
        >
          ← Anteriores
        </Link>
      ) : null}
      {paginas.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && n - paginas[i - 1] > 1 ? <span aria-hidden="true">…</span> : null}
          {n === pagina ? (
            <span aria-current="page" className={`${item} bg-mata text-papel`}>
              {n}
            </span>
          ) : (
            <Link href={href(n)} className={`${item} hover:bg-neblina`} aria-label={`Página ${n}`}>
              {n}
            </Link>
          )}
        </span>
      ))}
      {pagina < total ? (
        <Link
          href={href(pagina + 1)}
          rel="next"
          className="ml-4 text-eyebrow tracking-[0.14em] uppercase hover:text-pinhao"
        >
          Mais antigas →
        </Link>
      ) : null}
    </nav>
  );
}
