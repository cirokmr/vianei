import Image from "next/image";
import Link from "next/link";
import { HorizontalGallery } from "@/components/motion/HorizontalGallery";
import { asMidia, mediaSrc } from "@/lib/cms/media";
import type { Projeto, Timeline } from "@/payload-types";
import hoje from "../../../../public/fotos/restauracao-serra.webp";

type Props = {
  marcos: NonNullable<Timeline["marcos"]>;
  projetos: Pick<Projeto, "id" | "titulo" | "slug">[];
};

const panel = "flex w-[82vw] shrink-0 snap-start flex-col md:w-[46vw] lg:w-[38vw]";

/**
 * "Desde 1983": the milestones from the `timeline` global, in giant outlined
 * years, ending on today's projects. Pinned horizontal travel on desktop, a
 * native swipe row on phones.
 */
export function SinceChapter({ marcos, projetos }: Props) {
  return (
    <div className="bg-papel pt-[clamp(5rem,14vh,9rem)] md:pt-0">
      <HorizontalGallery
        label="Marcos da história do Centro Vianei"
        className="pb-[clamp(4rem,12vh,8rem)] md:pt-16 md:pb-10"
      >
        <article className={`${panel} justify-center md:w-[44vw]`}>
          <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Linha do tempo</p>
          <h2 className="font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata">
            Desde 1983, no mesmo território.
          </h2>
          <p className="mt-8 max-w-md text-lead leading-snug text-tinta/85">
            Tudo começou como “Projeto Vianei”, ligado ao Instituto São João Batista Vianei, da Diocese de Lages: uma
            proposta de formação para jovens filhos de agricultores.
          </p>
        </article>

        {marcos.map((marco) => {
          const img = asMidia(marco.imagem);
          const src = img ? mediaSrc(img, "cartao") : null;
          return (
            <article key={marco.id ?? marco.ano} className={panel}>
              <p
                aria-hidden="true"
                className="font-display text-[clamp(5rem,13vw,13rem)] leading-[0.8] font-light tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-musgo)]"
              >
                {marco.ano}
              </p>
              <h3 className="mt-8 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] leading-[1.05] tracking-[-0.02em] text-mata">
                <span className="sr-only">{marco.ano}: </span>
                {marco.titulo}
              </h3>
              {marco.texto ? <p className="mt-4 max-w-md text-tinta/80">{marco.texto}</p> : null}
              {src && img ? (
                <Image
                  src={src.url}
                  width={src.width}
                  height={src.height}
                  alt={img.alt}
                  sizes="(min-width: 1024px) 38vw, (min-width: 768px) 46vw, 82vw"
                  className="mt-8 aspect-[4/3] w-full object-cover"
                />
              ) : null}
            </article>
          );
        })}

        <article className="grid w-[82vw] shrink-0 snap-start gap-8 md:w-[72vw] md:grid-cols-[1fr_1.1fr] md:items-end lg:w-[62vw]">
          <div>
            <p
              aria-hidden="true"
              className="font-display text-[clamp(5rem,13vw,13rem)] leading-[0.8] font-light tracking-[-0.05em] text-musgo"
            >
              Hoje
            </p>
            {projetos.length ? (
              <>
                <h3 className="mt-8 font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight text-mata">
                  <span className="sr-only">Hoje: </span>nossos projetos
                </h3>
                <ul className="mt-3 divide-y divide-tinta/15 border-y border-tinta/15">
                  {projetos.map((projeto) => (
                    <li key={projeto.id}>
                      <Link href={`/projetos/${projeto.slug}`} className="block py-2.5 hover:text-pinhao">
                        {projeto.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <Image
            src={hoje}
            alt="Equipe e agricultores em área de restauração da Mata Atlântica, com a serra ao fundo"
            sizes="(min-width: 1024px) 32vw, (min-width: 768px) 38vw, 82vw"

            className="order-first aspect-[4/3] w-full object-cover md:order-none md:max-h-[62svh]"
          />
        </article>
      </HorizontalGallery>
    </div>
  );
}
