import type { Metadata } from "next";
import Image from "next/image";
import { Chapter } from "@/components/chapters/Chapter";
import { ChapterRail } from "@/components/chapters/ChapterRail";
import { HistoryChapter } from "@/components/chapters/quem-somos/HistoryChapter";
import { PartnersChapter } from "@/components/chapters/quem-somos/PartnersChapter";
import { TeamChapter } from "@/components/chapters/quem-somos/TeamChapter";
import { ClipImage } from "@/components/motion/ClipImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { getParceiros, getPessoas, getSite, getTimeline } from "@/lib/cms/queries";
import mistica from "../../../../public/fotos/mistica.webp";

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "Desde 1983, o Centro Vianei de Educação Popular trabalha com educação popular, agroecologia e restauração florestal no Planalto Catarinense.",
};

// "Durante os 40 anos de existência, o Centro Vianei ocupou-se em:" (vianei.org.br/quem-somos)
const atuacao = [
  "Criar e assessorar cooperativas de crédito com interação solidária",
  "Assessorar o associativismo e o cooperativismo de iniciativas agroecológicas",
  "Formar jovens pela pedagogia da alternância nas Casas Familiares Rurais",
  "Capacitar lideranças, técnica e politicamente, nos Cursos de Educação Popular (CEPs) e outros cursos",
  "Assessorar a produção agroecológica de alimentos",
  "Assessorar a comercialização direta da produção",
  "Assessorar a agroindustrialização artesanal",
  "Assessorar a certificação de produtos agroecológicos",
  "Promover a incidência política em soberania e segurança alimentar e nutricional",
  "Assessorar grupos de consumo consciente, aproximando o campo e a cidade",
  "Capacitar professores e gestores da educação do campo",
  "Implementar projetos socioambientais de produção, processamento e comercialização de alimentos agroecológicos da agricultura familiar",
  "Implementar projetos de restauração florestal que conservam as espécies por meio do seu uso sustentável",
  "Promover o extrativismo sustentável da biodiversidade e a bioeconomia, principalmente com sistemas agroflorestais",
  "Reconhecer e valorizar o Sistema Agrícola Tradicional (SAT) do pinhão da Serra Catarinense",
];

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
        <div className="bg-neblina px-[var(--gutter)] pb-[clamp(4rem,12vh,8rem)]">
          <ClipImage className="aspect-[16/9] max-h-[80svh] w-full">
            <Image
              src={mistica}
              alt="Mística de bênção das sementes em roda, durante um encontro de agroecologia"
              sizes="calc(100vw - 2 * var(--gutter))"
              placeholder="blur"
            />
          </ClipImage>
          <p className="mt-3 text-sm text-tinta/70">
            Mística de bênção das sementes.{" "}
            <span className="tracking-[0.12em] uppercase">Renato Kovalski Ribeiro / AS-PTA</span>
          </p>
        </div>
      </Chapter>

      <Chapter {...historia}>
        <HistoryChapter marcos={timeline.marcos ?? []} />
      </Chapter>

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
            {atuacao.map((item, i) => (
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
