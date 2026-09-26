import { getImageProps } from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/config/site";
import horizontal from "../../../../public/fotos/araucaria-catador.webp";
import vertical from "../../../../public/fotos/araucaria-vertical.webp";
import { Dawn } from "./Dawn";

const alt = "Extrativista no alto de uma araucária, entre os galhos, colhendo pinhas na Serra Catarinense";

// Art direction: a wide crown for desktop, a tall trunk for phones. The
// framed photo is the largest thing on the first screen (the LCP element),
// so it is requested up front with high priority and paints without a fade.
function HeroPhoto() {
  const common = { alt, sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const { props: wide } = getImageProps({ ...common, src: horizontal, quality: 55 });
  const { props: tall } = getImageProps({ ...common, src: vertical, quality: 40 });
  // Preload the variant this screen will use, so it starts with the HTML.
  preload(tall.src, {
    as: "image",
    imageSrcSet: tall.srcSet,
    imageSizes: "100vw",
    media: "(max-width: 767px)",
    fetchPriority: "high",
  });
  preload(wide.src, {
    as: "image",
    imageSrcSet: wide.srcSet,
    imageSizes: "100vw",
    media: "(min-width: 768px)",
    fetchPriority: "high",
  });

  return (
    <div data-dawn-photo="" className="absolute inset-0">
      <picture>
        <source media="(min-width: 768px)" srcSet={wide.srcSet} sizes="100vw" />
        <img {...tall} alt={alt} className="h-full w-full object-cover object-[50%_20%]" />
      </picture>
    </div>
  );
}

const TITLE = "Educação popular e agroecologia.";

/**
 * Opening: the title alone on paper, the photo waiting below in a frame that
 * opens to the full width as it scrolls up (Dawn).
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
          className="hero-fade hidden text-eyebrow tracking-[0.2em] text-tinta/70 uppercase md:block"
        >
          Role ↓
        </span>
      </div>

      {/* Framed by the gutters until it scrolls up (clip-path, so no layout shift). */}
      <div
        data-dawn-frame=""
        className="relative mt-[clamp(2.5rem,7vh,5rem)] h-svh min-h-[28rem] overflow-hidden bg-neblina [clip-path:inset(0_var(--gutter))]"
      >
        <HeroPhoto />
      </div>

      <div className="grid gap-6 px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)] md:grid-cols-12">
        <p className="text-eyebrow tracking-[0.2em] text-musgo uppercase md:col-span-4">Centro Vianei</p>
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
