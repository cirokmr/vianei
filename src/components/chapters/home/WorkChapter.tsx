import Image from "next/image";
import Link from "next/link";
import { ClipImage } from "@/components/motion/ClipImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { StackCards } from "@/components/motion/StackCards";
import { areas } from "@/config/areas";

/** "O que fazemos": the four lines of work as cards that stack while scrolling. */
export function WorkChapter() {
  return (
    <div className="bg-neblina px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
      <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">O que fazemos</p>
      <SplitReveal
        as="h2"
        onScroll
        className="mb-[clamp(3rem,10vh,6rem)] max-w-4xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata"
      >
        Quatro caminhos que se cruzam no campo.
      </SplitReveal>

      <StackCards>
        {areas.map((area, i) => (
          <article key={area.slug} className="grid min-h-[72svh] bg-papel md:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-between gap-10 p-[var(--gutter)]">
              <span className="font-display text-sm text-musgo tabular-nums">
                {String(i + 1).padStart(2, "0")}{" "}
                <span className="text-tinta/70">/ {String(areas.length).padStart(2, "0")}</span>
              </span>
              <div>
                <h3 className="font-display text-[clamp(2.2rem,1.4rem+3vw,4.6rem)] leading-[0.95] tracking-[-0.025em] text-mata">
                  {area.titulo}
                </h3>
                <p className="mt-5 max-w-md text-lead leading-snug text-tinta/80">{area.texto}</p>
                <Link
                  href={area.href}
                  data-cursor="Ver"
                  className="mt-8 inline-flex items-center gap-3 text-eyebrow tracking-[0.16em] text-pinhao uppercase underline-offset-4 hover:underline"
                >
                  {area.cta} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <ClipImage className="min-h-64 md:min-h-full" from={i % 2 ? "right" : "bottom"}>
              <Image src={area.foto} alt={area.alt} sizes="(min-width: 768px) 52vw, 100vw" placeholder="blur" />
            </ClipImage>
          </article>
        ))}
      </StackCards>
    </div>
  );
}
