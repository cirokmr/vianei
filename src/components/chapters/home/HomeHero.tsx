import Image from "next/image";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/config/site";
import logo from "../../../../public/marca/centro-vianei.webp";
import { Araucarias } from "./Araucarias";
import { Dawn } from "./Dawn";

const TITLE = "Educação popular e agroecologia.";

/**
 * Opening: the title alone on paper and, under it, the Planalto's araucárias
 * as an illustration traced from a photo (Araucarias). The headline is the LCP;
 * the drawing is a static SVG inlined after load, with an <img> copy for
 * no-JS. Phones crop the scene around the main tree.
 */
export function HomeHero() {
  return (
    <Dawn className="relative bg-papel pt-[clamp(7rem,18vh,11rem)]">
      <div className="flex items-end justify-between gap-8 px-[var(--gutter)]">
        <div>
          <p data-dawn-fade="" className="hero-fade mb-5 text-eyebrow tracking-[0.2em] text-musgo uppercase">
            Planalto Catarinense · desde {site.foundedYear}
          </p>
          <div data-dawn-title="" className="font-display">
            <HeroTitle
              className="max-w-[12ch] text-[clamp(2.75rem,1rem+6.5vw,9.5rem)] leading-[0.95] font-light tracking-[-0.03em] text-mata"
              text={TITLE}
            />
          </div>
        </div>
        <span
          data-dawn-fade=""
          aria-hidden="true"
          className="hero-fade hidden text-eyebrow tracking-[0.2em] whitespace-nowrap text-tinta/70 uppercase md:block"
        >
          Role ↓
        </span>
      </div>

      {/* Space reserved up front, so the client-only drawing causes no layout shift. */}
      <div
        data-dawn-scene=""
        className="relative mt-[clamp(1.5rem,5vh,3.5rem)] aspect-[5/4] w-full text-mata sm:aspect-[2/1] lg:aspect-[11/4]"
      >
        <Araucarias className="absolute inset-0 h-full w-full" />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ilustracoes/araucarias.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />
        </noscript>
      </div>

      <div className="grid gap-10 px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)] md:grid-cols-12 md:items-center">
        <div className="md:col-span-4">
          <Image
            src={logo}
            alt="Centro Vianei de Educação Popular: atuando em educação popular e agroecologia desde 1983"
            sizes="(min-width: 768px) 22rem, 11rem"
            // The title is split into word spans, each its own LCP candidate: on
            // phones the logo stays smaller than a word, and is preloaded anyway.
            priority
            className="h-auto w-full max-w-[11rem] md:max-w-[22rem]"
          />
        </div>
        <div className="md:col-span-8 lg:col-span-6">
          <p className="text-lead leading-snug text-tinta/85">
            Há mais de quatro décadas cultivando autonomia, justiça social e a floresta de araucárias junto a quem vive
            da terra.
          </p>
          <Link
            href="/quem-somos"
            className="mt-8 inline-block text-eyebrow tracking-[0.2em] text-mata uppercase underline decoration-musgo/40 underline-offset-8 hover:decoration-musgo"
          >
            Conheça o Vianei →
          </Link>
        </div>
      </div>
    </Dawn>
  );
}
