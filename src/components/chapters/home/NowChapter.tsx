import Link from "next/link";
import { CursorPreview } from "@/components/motion/CursorPreview";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import type { NoticiaResumo } from "@/lib/cms/queries";

const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

/** "Agora no território": the latest news, with an image that follows the cursor. */
export function NowChapter({ noticias }: { noticias: NoticiaResumo[] }) {
  return (
    <div className="bg-papel px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Agora no território</p>
          <h2 className="max-w-3xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata">
            O que está brotando.
          </h2>
        </div>
        <Link
          href="/noticias"
          className="text-eyebrow tracking-[0.16em] text-pinhao uppercase underline-offset-4 hover:underline"
        >
          Todas as notícias <span aria-hidden="true">→</span>
        </Link>
      </div>

      <CursorPreview className="mt-[clamp(2.5rem,8vh,5rem)]">
        <ul className="border-t border-tinta/15">
          {noticias.map((noticia) => {
            const capa = asMidia(noticia.capa);
            const thumb = capa ? mediaSrc(capa, "cartao") : null;
            return (
              <li key={noticia.id} className="border-b border-tinta/15">
                <Link
                  href={`/noticias/${noticia.slug}`}
                  data-preview={thumb?.url}
                  data-cursor="Ler"
                  className="group grid gap-3 py-8 md:grid-cols-[12rem_1fr] md:gap-10"
                >
                  {noticia.publicadoEm ? (
                    <time dateTime={noticia.publicadoEm} className="pt-2 text-sm text-tinta/70">
                      {date.format(new Date(noticia.publicadoEm))}
                    </time>
                  ) : (
                    <span />
                  )}
                  <span>
                    <span className="block font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.8rem)] leading-[1.05] tracking-[-0.02em] text-mata transition-colors group-hover:text-pinhao">
                      {noticia.titulo}
                    </span>
                    {noticia.resumo ? (
                      <span className="mt-3 block max-w-2xl text-tinta/75">{noticia.resumo}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CursorPreview>
    </div>
  );
}
