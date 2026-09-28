import Link from "next/link";
import { NoticiaLista } from "@/components/noticias/NoticiaLista";
import type { NoticiaResumo } from "@/lib/cms/queries";

/** "Agora no território": the three latest news as photo-led cards. */
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

      <div className="mt-[clamp(2.5rem,7vh,4.5rem)]">
        <NoticiaLista noticias={noticias} headingLevel="h3" />
      </div>
    </div>
  );
}
