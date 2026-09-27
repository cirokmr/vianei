import type { Metadata } from "next";
import Image from "next/image";
import { Chapter } from "@/components/chapters/Chapter";
import { LazyChapterRail as ChapterRail } from "@/components/chapters/lazy";
import { HistoryChapter } from "@/components/chapters/quem-somos/HistoryChapter";
import { PartnersChapter } from "@/components/chapters/quem-somos/PartnersChapter";
import { TeamChapter } from "@/components/chapters/quem-somos/TeamChapter";
import { ClipImage } from "@/components/motion/ClipImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { frentes } from "@/config/areas";
import { getParceiros, getPessoas, getSite, getTimeline } from "@/lib/cms/queries";
import { FullBleedPhoto } from "@/components/ui/FullBleedPhoto";
import painel from "../../../../public/fotos/araucaria-painel.webp";
import festa from "../../../../public/fotos/festa-da-colheita.webp";
import saida from "../../../../public/fotos/saida-de-campo.webp";
import sapecada from "../../../../public/fotos/sapecada-de-pinhao.webp";

const montagem = [
  {
    src: saida,
    legenda: "Saída de campo.",
    alt: "Grupo caminhando entre araucárias em uma saída de campo, sob céu azul",
  },
  {
    src: festa,
    legenda: "Festa da Colheita do Pinhão.",
    alt: "Pinhões e pinhas debulhadas sobre a grama durante a Festa da Colheita",
  },
  {
    src: sapecada,
    legenda: "Sapecada de pinhão.",
    alt: "Roda de pessoas observando a sapecada de pinhão sobre grimpas de araucária",
  },
];

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "Desde 1983, o Centro Vianei de Educação Popular trabalha com educação popular, agroecologia e restauração florestal no Planalto Catarinense.",
};

const chapters = [
  { id: "inicio", label: "Quem somos" },
  { id: "historia", label: "Nossa história" },
  { id: "proposito", label: "Propósito" },
  { id: "atuacao", label: "Atuação" },
  { id: "equipe", label: "Equipe" },
  { id: "parceiros", label: "Parceiros" },
];

const eyebrow = "mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase";

export default async function QuemSomos() {
  const [timeline, pessoas, parceiros, site] = await Promise.all([
    getTimeline(),
    getPessoas(),
    getParceiros(),
    getSite(),
  ]);
  const [inicio, historia, proposito, emAtuacao, equipe, emParceiros] = chapters;

  return (
    <>
      <ChapterRail items={chapters} />

      <Chapter {...inicio}>
        <header className="bg-neblina px-[var(--gutter)] pt-40 pb-[clamp(3rem,8vh,5rem)]">
          <p className={eyebrow}>Centro Vianei de Educação Popular · AVICITECS</p>
          <HeroTitle
            className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
            text="Quem somos"
          />
          <p className="hero-fade mt-10 max-w-2xl text-lead leading-snug text-tinta/85">
            Uma entidade sem fins lucrativos, de direito privado, que trabalha com educação popular, agroecologia,
            restauração florestal e outras temáticas. Existe desde 1983 e, em junho de 1988, foi formalizada como
            AVICITECS – Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde.
          </p>
        </header>
        {/* Three field photos (800 px originals): a modest, staggered montage
            rather than one large image, so they stay sharp. */}
        <div className="bg-neblina px-[var(--gutter)] pb-[clamp(4rem,12vh,8rem)]">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-[clamp(0.75rem,2vw,1.75rem)] md:grid-cols-3 md:items-start">
            {montagem.map((foto, i) => (
              <li
                key={foto.legenda}
                className={i === 0 ? "col-span-2 md:col-span-1 md:mt-16" : i === 2 ? "md:mt-28" : ""}
              >
                <figure>
                  <ClipImage className="aspect-[3/2]" from={i === 1 ? "top" : "bottom"} parallax={false}>
                    <Image src={foto.src} alt={foto.alt} sizes="(min-width: 768px) 24rem, 50vw" />
                  </ClipImage>
                  <figcaption className="mt-2 text-sm text-tinta/70">{foto.legenda}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>

      <Chapter {...historia}>
        <HistoryChapter marcos={timeline.marcos ?? []} />
      </Chapter>

      <FullBleedPhoto
        src={painel}
        alt="Araucária adulta de copa larga em Painel, na Serra Catarinense"
        legenda="Araucária em Painel, Serra Catarinense."
        foco="50% 35%"
      />

      <Chapter {...proposito}>
        <section aria-label="Propósito" className="bg-papel px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
          <p className={eyebrow}>Propósito</p>
          <SplitReveal
            as="h2"
            onScroll
            className="max-w-5xl font-display text-h2 leading-[1] tracking-[-0.025em] text-mata"
          >
            Por meio do aprendizado coletivo, promover o desenvolvimento sustentável e a justiça social.
          </SplitReveal>
          <div className="mt-[clamp(3rem,8vh,5rem)] grid max-w-5xl gap-10 text-lead leading-snug text-tinta/85 md:grid-cols-2">
            <p>
              Com alternativas técnicas e a organização socioeconômica da classe popular, o Centro Vianei promove a
              autonomia coletiva e a afirmação cultural, social e econômica de cada pessoa envolvida nos processos que
              provoca.
            </p>
            <p>
              Atua principalmente no Planalto Catarinense, com extrativistas, agricultoras e agricultores familiares e
              assentados e consumidores de produtos agroecológicos, preferencialmente jovens e mulheres.
            </p>
          </div>
        </section>
      </Chapter>

      <Chapter {...emAtuacao}>
        <section aria-labelledby="atuacao-titulo" className="bg-neblina px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
          <p className={eyebrow}>Áreas de atuação</p>
          <h2
            id="atuacao-titulo"
            className="max-w-4xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata"
          >
            Mais de quatro décadas de trabalho de base.
          </h2>
          <ol className="mt-[clamp(3rem,8vh,5rem)] grid gap-x-12 border-t border-tinta/15 md:grid-cols-2 xl:grid-cols-3">
            {frentes.map(({ texto: item }, i) => (
              <li key={item} className="flex gap-5 border-b border-tinta/15 py-5">
                <span aria-hidden="true" className="w-6 shrink-0 pt-1 font-display text-sm text-musgo tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-tinta/85">{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </Chapter>

      <Chapter {...equipe}>
        <TeamChapter pessoas={pessoas} site={site} />
      </Chapter>

      <Chapter {...emParceiros}>
        <PartnersChapter parceiros={parceiros} />
      </Chapter>
    </>
  );
}
