import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ClipImage } from "@/components/motion/ClipImage";
import { Counter } from "@/components/motion/Counter";
import { CursorPreview } from "@/components/motion/CursorPreview";
import { DrawTree } from "@/components/motion/DrawTree";
import { Fog } from "@/components/motion/Fog";
import { HorizontalGallery } from "@/components/motion/HorizontalGallery";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { PinnedChapter } from "@/components/motion/PinnedChapter";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { StackCards } from "@/components/motion/StackCards";
import { HeroTitle } from "@/components/ui/HeroTitle";

import araucaria from "../../../../public/fotos/araucaria-catador.webp";
import caminhada from "../../../../public/fotos/caminhada.webp";
import campo from "../../../../public/fotos/restauracao-serra.webp";
import catador from "../../../../public/fotos/catador-tronco.webp";
import mistica from "../../../../public/fotos/mistica.webp";
import mudas from "../../../../public/fotos/mudas.webp";
import travessia from "../../../../public/fotos/mata.webp";

export const metadata: Metadata = { title: "Laboratório de movimento", robots: { index: false, follow: false } };

// Internal showcase of the motion primitives. Available in development and
// when ENABLE_LAB=1 (CI, preview deploys); a plain 404 in production.
const enabled = process.env.NODE_ENV !== "production" || process.env.ENABLE_LAB === "1";

function Section({
  name,
  children,
  className = "",
  dark = false,
}: {
  name: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      data-header={dark ? "dark" : undefined}
      className={`px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)] ${className}`}
    >
      <p className={`mb-8 font-mono text-xs tracking-wide ${dark ? "text-limao" : "text-musgo"}`}>&lt;{name} /&gt;</p>
      {children}
    </section>
  );
}

const areas = [
  { title: "Educação popular", text: "Aprender junto, a partir da vida de quem trabalha a terra.", img: mistica },
  {
    title: "Agroecologia",
    text: "Produção que respeita o ciclo da natureza e fortalece a agricultura familiar.",
    img: campo,
  },
  { title: "Restauração florestal", text: "Mudas nativas da Mata Atlântica voltando às reservas legais.", img: mudas },
  {
    title: "Cultura e SAT Pinhão",
    text: "O pinhão como alimento, renda e patrimônio da Serra Catarinense.",
    img: catador,
  },
];

const marcos = [
  { ano: "1983", texto: "Nasce o Projeto Vianei, ligado à Diocese de Lages." },
  { ano: "1988", texto: "Formalização como AVICITECS." },
  { ano: "2000", texto: "Pixurum, o jornal do Vianei, completa sua coleção." },
  { ano: "2026", texto: "Restauração, pinhão e agroecologia no Planalto." },
];

const parceiros = [
  "MISEREOR",
  "IBAMA",
  "WWF-Brasil",
  "CEPAGRO",
  "CETAP",
  "AS-PTA",
  "UFSC",
  "UDESC",
  "IFSC",
  "Ecoserra",
];

export default function LabPage() {
  if (!enabled) notFound();

  return (
    <>
      <section className="bg-neblina px-[var(--gutter)] pt-40 pb-16">
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Interno · fase 4</p>
        <HeroTitle
          className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
          text="Laboratório de movimento"
        />
        <p className="mt-8 max-w-xl text-lead text-tinta/80">
          Cada primitiva isolada, com conteúdo real. Teste com o sistema em “reduzir movimento” e no celular.{" "}
          <Link href="/noticias" className="text-pinhao underline underline-offset-4">
            Ver a transição de página
          </Link>
          .
        </p>
      </section>

      <Section name="SplitReveal">
        <SplitReveal
          as="h2"
          onScroll
          className="max-w-5xl font-display text-h2 leading-[1.02] tracking-[-0.02em] text-mata"
        >
          A araucária leva décadas para dar pinhão. O Vianei trabalha há mais de quarenta anos no mesmo território.
        </SplitReveal>
      </Section>

      <Section name="ClipImage">
        <div className="grid gap-[var(--gutter)] md:grid-cols-[1.4fr_1fr]">
          <ClipImage className="aspect-[4/3]">
            <Image src={araucaria} alt="Copa de araucária vista de baixo" sizes="(min-width: 768px) 58vw, 100vw" />
          </ClipImage>
          <ClipImage className="aspect-[3/4] md:mt-[20vh]" from="left">
            <Image src={catador} alt="Catador subindo uma araucária" sizes="(min-width: 768px) 40vw, 100vw" />
          </ClipImage>
        </div>
      </Section>

      <ScrubWords
        className="flex min-h-svh items-center bg-mata px-[var(--gutter)] text-papel"
        text="“Ninguém nasce feito, é experimentando-nos no mundo que nós nos fazemos.” — Paulo Freire"
      />

      <PinnedChapter label="Linha do tempo (exemplo)" className="bg-mata text-papel" dark>
        {marcos.map((m) => (
          <div key={m.ano} data-step="" className="px-[var(--gutter)] py-24">
            <p className="font-display text-[clamp(5rem,22vw,18rem)] leading-none font-light tracking-[-0.05em] text-salvia">
              {m.ano}
            </p>
            <p className="mt-6 max-w-xl text-lead text-papel/85">{m.texto}</p>
          </div>
        ))}
      </PinnedChapter>

      <div data-header="dark" className="bg-mata pt-[12vh] text-papel">
        <p className="px-[var(--gutter)] font-mono text-xs text-limao">&lt;HorizontalGallery /&gt;</p>
        <HorizontalGallery label="Galeria do território" className="pt-8 pb-[12vh]">
          {[campo, travessia, caminhada, mudas, mistica, araucaria].map((img, i) => (
            <figure key={i} className="w-[78vw] shrink-0 snap-start md:w-[42vw]">
              <Image
                src={img}
                alt=""
                sizes="(min-width: 768px) 42vw, 78vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="mt-3 text-sm text-papel/70">
                {String(i + 1).padStart(2, "0")} — Território
              </figcaption>
            </figure>
          ))}
        </HorizontalGallery>
      </div>

      <Section name="StackCards">
        <StackCards>
          {areas.map((a, i) => (
            <article key={a.title} className="grid min-h-[70svh] bg-papel md:grid-cols-2">
              <div className="flex flex-col justify-between bg-neblina p-[var(--gutter)]">
                <span className="font-display text-sm tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-h2 leading-none tracking-[-0.02em] text-mata">{a.title}</h3>
                  <p className="mt-4 max-w-md text-lead text-tinta/80">{a.text}</p>
                </div>
              </div>
              <Image
                src={a.img}
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-full min-h-60 w-full object-cover"
              />
            </article>
          ))}
        </StackCards>
      </Section>

      <Section name="Counter" className="bg-neblina">
        <p className="mb-10 text-sm text-tinta/70">
          Números de exemplo: os reais vêm do painel (global “Números da home”).
        </p>
        <dl className="grid gap-10 md:grid-cols-3">
          {[
            { v: 43, s: " anos", l: "de educação popular" },
            { v: 127, s: " ha", l: "em restauração (exemplo)" },
            { v: 20, p: "+", l: "parceiros e apoiadores" },
          ].map((n) => (
            <div key={n.l} className="flex flex-col-reverse border-t border-tinta/20 pt-6">
              <dt className="mt-2 text-tinta/75">{n.l}</dt>
              <dd className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none font-light text-mata">
                <Counter value={n.v} prefix={n.p} suffix={n.s} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section name="DrawTree">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <DrawTree className="mx-auto h-[70svh] w-auto text-musgo" />
          <p className="max-w-lg font-display text-h2 leading-[1.05] tracking-[-0.02em] text-mata">
            O fio condutor do site: uma araucária que cresce enquanto você lê.
          </p>
        </div>
      </Section>

      <Section name="Marquee" className="bg-mata text-papel" dark>
        <Marquee label="Parceiros e apoiadores" className="py-6">
          {parceiros.map((p) => (
            <span key={p} className="px-8 font-display text-[clamp(2rem,5vw,4.5rem)] font-light whitespace-nowrap">
              {p} <span className="text-salvia">·</span>
            </span>
          ))}
        </Marquee>
      </Section>

      <Section name="CursorPreview + ContextCursor">
        <CursorPreview>
          <ul className="divide-y divide-tinta/15 border-y border-tinta/15">
            {[
              { t: "Viveiro abastece o Projeto Restaurar", img: mudas },
              { t: "Travessia na reserva legal do PA 1º de Maio", img: travessia },
              { t: "Caminhada de reconhecimento do território", img: caminhada },
              { t: "Mística de abertura do encontro", img: mistica },
            ].map((n) => (
              <li key={n.t}>
                <a
                  href="#"
                  data-preview={n.img.src}
                  data-cursor="Ler"
                  className="block py-6 font-display text-[clamp(1.5rem,3vw,2.6rem)] leading-tight hover:text-pinhao"
                >
                  {n.t}
                </a>
              </li>
            ))}
          </ul>
        </CursorPreview>
      </Section>

      <Section name="Magnetic">
        <div className="flex flex-wrap gap-6">
          <Magnetic>
            <a
              href="#"
              data-cursor="Falar"
              className="inline-block rounded-full bg-pinhao px-8 py-4 text-eyebrow tracking-[0.16em] text-papel uppercase"
            >
              Fale com a gente
            </a>
          </Magnetic>
          <Magnetic strength={0.45}>
            <a
              href="#"
              className="inline-block rounded-full border border-tinta/30 px-8 py-4 text-eyebrow tracking-[0.16em] uppercase"
            >
              Ver projetos
            </a>
          </Magnetic>
        </div>
      </Section>

      <section className="relative flex min-h-svh items-end overflow-hidden">
        <Image src={araucaria} alt="" fill sizes="100vw" className="object-cover" />
        <Fog dissipateOnScroll />
        <div className="relative px-[var(--gutter)] pb-[var(--gutter)]">
          <p className="font-mono text-xs text-papel">&lt;Fog /&gt; · WebGL, só em telas grandes</p>
          <p className="mt-4 max-w-3xl font-display text-h2 leading-none text-papel drop-shadow">
            A neblina se dissipa conforme o dia avança.
          </p>
        </div>
      </section>
    </>
  );
}
