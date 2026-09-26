import Image from "next/image";
import Link from "next/link";
import { CursorPreview } from "@/components/motion/CursorPreview";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import type { NoticiaResumo } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

type Props = { noticias: NoticiaResumo[]; destaque?: boolean; headingLevel?: "h2" | "h3" };

function Destaque({ noticia, Heading }: { noticia: NoticiaResumo; Heading: "h2" | "h3" }) {
  const capa = asMidia(noticia.capa);
  const img = capa ? mediaSrc(capa, "destaque") : null;
  return (
    <article className="relative grid gap-8 border-b border-tinta/15 pb-12 md:grid-cols-[1.25fr_1fr] md:items-end">
      {img && capa ? (
        <Image
          src={img.url}
          width={img.width}
          height={img.height}
          alt={capa.alt}
          sizes="(min-width: 768px) 55vw, 100vw"
          priority
          className="aspect-[4/3] w-full object-cover"
        />
      ) : null}
      <div>
        <time dateTime={noticia.publicadoEm} className="text-eyebrow tracking-[0.14em] text-musgo uppercase">
          {formatDate(noticia.publicadoEm)}
        </time>
        <Heading className="mt-4 font-display text-[clamp(2rem,1.3rem+2.6vw,3.8rem)] leading-[1.02] tracking-[-0.02em] text-mata">
          <Link
            href={`/noticias/${noticia.slug}`}
            data-cursor="Ler"
            className="after:absolute after:inset-0 hover:text-pinhao"
          >
            {noticia.titulo}
          </Link>
        </Heading>
        {noticia.resumo ? <p className="mt-5 max-w-xl text-lead leading-snug text-tinta/80">{noticia.resumo}</p> : null}
      </div>
    </article>
  );
}

/**
 * News index: optionally a large lead story, then rows with a small cover
 * (and, on desktop, the cover following the cursor).
 */
export function NoticiaLista({ noticias, destaque = false, headingLevel = "h2" }: Props) {
  const [primeira, ...resto] = noticias;
  const linhas = destaque ? resto : noticias;

  return (
    <div>
      {destaque && primeira ? <Destaque noticia={primeira} Heading={headingLevel} /> : null}
      <CursorPreview>
        <ul className="divide-y divide-tinta/15 border-b border-tinta/15">
          {linhas.map((noticia) => {
            const capa = asMidia(noticia.capa);
            const img = capa ? mediaSrc(capa, "miniatura") : null;
            const preview = capa ? mediaSrc(capa, "cartao") : null;
            const Heading = headingLevel;
            return (
              <li key={noticia.id}>
                <article className="group relative grid grid-cols-[1fr_6rem] gap-x-5 gap-y-3 py-8 md:grid-cols-[10rem_1fr_10rem] md:items-center md:gap-10">
                  <time
                    dateTime={noticia.publicadoEm}
                    className="col-span-2 text-eyebrow tracking-[0.14em] text-musgo uppercase md:col-span-1"
                  >
                    {formatDate(noticia.publicadoEm)}
                  </time>
                  <div>
                    <Heading className="font-display text-[clamp(1.4rem,1.1rem+1.2vw,2.2rem)] leading-tight">
                      <Link
                        href={`/noticias/${noticia.slug}`}
                        data-preview={preview?.url}
                        data-cursor="Ler"
                        className="transition-colors group-hover:text-pinhao after:absolute after:inset-0"
                      >
                        {noticia.titulo}
                      </Link>
                    </Heading>
                    {noticia.resumo ? (
                      <p className="mt-2 line-clamp-3 max-w-2xl text-tinta/75">{noticia.resumo}</p>
                    ) : null}
                  </div>
                  {img && capa ? (
                    <Image
                      src={img.url}
                      width={img.width}
                      height={img.height}
                      alt=""
                      sizes="(min-width: 768px) 10rem, 6rem"
                      className="aspect-square w-full self-start object-cover md:aspect-[4/3] md:self-auto"
                    />
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </CursorPreview>
    </div>
  );
}
