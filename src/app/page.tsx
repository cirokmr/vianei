import { ScrubWords } from "@/components/motion/ScrubWords";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/config/site";

// Phase 1 home: validates tokens, type, smooth scroll, a masked reveal and a
// pinned scrub chapter. The full 7-chapter home lands in phase 5.
export default function Home() {
  return (
    <>
      <section className="relative flex min-h-svh flex-col justify-end bg-neblina px-[var(--gutter)] pt-32 pb-[clamp(2rem,6vh,5rem)]">
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">
          Lages · Planalto Catarinense · desde {site.foundedYear}
        </p>
        <HeroTitle
          className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
          text="Educação popular e agroecologia no Planalto Catarinense."
        />
        <div className="mt-10 flex items-end justify-between gap-8">
          <p className="hero-fade max-w-md text-lead leading-snug text-tinta/80">
            Mais de quatro décadas cultivando autonomia, justiça social e a floresta de araucárias junto a quem vive da
            terra.
          </p>
          <span aria-hidden="true" className="hidden text-eyebrow tracking-[0.18em] text-tinta/75 uppercase md:block">
            Role ↓
          </span>
        </div>
      </section>

      <ScrubWords
        className="flex min-h-svh items-center bg-mata px-[var(--gutter)] text-papel"
        text="“Ninguém nasce feito, é experimentando-nos no mundo que nós nos fazemos.” — Paulo Freire"
      />

      <section className="px-[var(--gutter)] py-[clamp(5rem,14vh,10rem)]">
        <SplitReveal as="h2" onScroll className="max-w-4xl font-display text-h2 leading-[1] tracking-[-0.025em]">
          Um novo site está sendo cultivado.
        </SplitReveal>
        <p className="mt-8 max-w-xl text-lead text-tinta/75">
          Enquanto isso, fale com a gente em{" "}
          <a href={`mailto:${site.email}`} className="text-pinhao underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
