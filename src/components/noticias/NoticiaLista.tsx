import Image from "next/image";
import Link from "next/link";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import type { NoticiaResumo } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

type Props = {
  noticias: NoticiaResumo[];
  destaque?: boolean;
  headingLevel?: "h2" | "h3";
  /** Columns on large screens (default 3). */
  colunas?: 2 | 3;
};

function Capa({
  noticia,
  size,
  sizes,
  priority = false,
}: {
  noticia: NoticiaResumo;
  size: "cartao" | "destaque";
  sizes: string;
  priority?: boolean;
}) {
  const capa = asMidia(noticia.capa);
  const img = capa ? mediaSrc(capa, size) : null;
  return (
    <div className="relative aspect-[3/2] overflow-hidden bg-neblina">
      {img && capa ? (
        <Image
          src={img.url}
          fill
          alt={capa.alt}
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      ) : (
        // No cover: the Planalto's araucárias, faint.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/ilustracoes/araucarias.svg"
          alt=""
          loading="lazy"
          className="absolute inset-x-0 bottom-0 h-[70%] w-full object-cover object-bottom opacity-25"
        />
      )}
    </div>
  );
}

function Destaque({ noticia, Heading }: { noticia: NoticiaResumo; Heading: "h2" | "h3" }) {
  return (
    <article className="group relative grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
      <div className="md:col-span-7">
        <Capa noticia={noticia} size="destaque" sizes="(min-width: 768px) 58vw, 100vw" priority />
      </div>
      <div className="md:col-span-5 md:pb-2">
        <time dateTime={noticia.publicadoEm} className="text-eyebrow tracking-[0.14em] text-musgo uppercase">
          {formatDate(noticia.publicadoEm)}
        </time>
        <Heading className="mt-3 font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.9rem)] leading-[1.05] tracking-[-0.02em] text-mata">
          <Link
            href={`/noticias/${noticia.slug}`}
            data-cursor="Ler"
            className="transition-colors group-hover:text-pinhao after:absolute after:inset-0"
          >
            {noticia.titulo}
          </Link>
        </Heading>
        {noticia.resumo ? (
          <p className="mt-4 line-clamp-4 max-w-lg leading-relaxed text-tinta/75">{noticia.resumo}</p>
        ) : null}
      </div>
    </article>
  );
}

/**
 * News index: optionally a large lead story, then a grid of cards where the
 * photo leads and the text stays compact (design review: covers used to be
 * thumbnails next to oversized headlines).
 */
export function NoticiaLista({ noticias, destaque = false, headingLevel = "h2", colunas = 3 }: Props) {
  const [primeira, ...resto] = noticias;
  const cards = destaque ? resto : noticias;
  const Heading = headingLevel;

  return (
    <div className="space-y-[clamp(3rem,8vh,5rem)]">
      {destaque && primeira ? <Destaque noticia={primeira} Heading={headingLevel} /> : null}
      {cards.length ? (
        <ul
          className={`grid gap-x-[clamp(1.25rem,2.5vw,2.5rem)] gap-y-12 sm:grid-cols-2 ${colunas === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {cards.map((noticia) => (
            <li key={noticia.id}>
              <article className="group relative">
                <Capa
                  noticia={noticia}
                  size="cartao"
                  sizes={`(min-width: 1024px) ${colunas === 3 ? "30vw" : "45vw"}, (min-width: 640px) 45vw, 100vw`}
                />
                <time
                  dateTime={noticia.publicadoEm}
                  className="mt-5 block text-eyebrow tracking-[0.14em] text-musgo uppercase"
                >
                  {formatDate(noticia.publicadoEm)}
                </time>
                <Heading className="mt-2 font-display text-[clamp(1.2rem,1.05rem+0.5vw,1.5rem)] leading-snug text-mata">
                  <Link
                    href={`/noticias/${noticia.slug}`}
                    data-cursor="Ler"
                    className="transition-colors group-hover:text-pinhao after:absolute after:inset-0"
                  >
                    {noticia.titulo}
                  </Link>
                </Heading>
                {noticia.resumo ? (
                  <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-tinta/70">{noticia.resumo}</p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
