import { getImageProps } from "next/image";
import { LazyFog as Fog } from "../lazy";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { site } from "@/config/site";
import horizontal from "../../../../public/fotos/araucaria-catador.webp";
import vertical from "../../../../public/fotos/araucaria-vertical.webp";
import { Dawn } from "./Dawn";
import { DawnPhoto } from "./DawnPhoto";

const alt = "Extrativista no alto de uma araucária, entre os galhos, colhendo pinhas na Serra Catarinense";

// Art direction: a wide crown for desktop, a tall trunk for phones. The
// headline is the LCP element; the photo is mounted right after `load`
// (DawnPhoto) and fades in from the mist, with a <noscript> copy for no-JS.
function HeroPicture() {
  const common = { alt, sizes: "100vw" } as const;
  const { props: wide } = getImageProps({ ...common, src: horizontal, quality: 55 });
  // Phones show only the canopy above the mist: a lighter encode is invisible.
  const { props: tall } = getImageProps({ ...common, src: vertical, quality: 40 });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={wide.srcSet} sizes="100vw" />
      <img {...tall} alt={alt} loading="eager" className="dawn-photo h-full w-full object-cover object-[50%_20%]" />
    </picture>
  );
}

function HeroPhoto() {
  return (
    <div data-dawn-photo="" className="absolute inset-0 origin-top">
      <DawnPhoto>
        <HeroPicture />
      </DawnPhoto>
      <noscript>
        <HeroPicture />
      </noscript>
    </div>
  );
}

export function HomeHero() {
  return (
    <Dawn className="relative flex h-svh min-h-[34rem] flex-col justify-end overflow-hidden bg-neblina">
      <HeroPhoto />
      <div data-dawn-fog="" className="absolute inset-0">
        <Fog />
      </div>
      {/* Mist at the top edge too, so the header reads over the canopy. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-neblina/90 via-neblina/55 to-transparent"
      />
      {/* Morning mist: keeps the headline on a solid, readable ground. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[78%] bg-linear-to-t from-neblina from-35% via-neblina/85 via-60% to-transparent"
      />

      <div className="relative px-[var(--gutter)] pb-[clamp(2rem,6vh,5rem)]">
        <p data-dawn-fade="" className="hero-fade mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">
          Lages · Planalto Catarinense · desde {site.foundedYear}
        </p>
        <div data-dawn-title="" className="font-display">
          <HeroTitle
            className="max-w-[16ch] text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
            text="Educação popular e agroecologia no Planalto Catarinense."
          />
        </div>
        <div data-dawn-fade="" className="mt-8 flex items-end justify-between gap-8">
          <p className="hero-fade max-w-md text-lead leading-snug text-tinta/85">
            Há mais de quatro décadas cultivando autonomia, justiça social e a floresta de araucárias junto a quem vive
            da terra.
          </p>
          <span aria-hidden="true" className="hidden text-eyebrow tracking-[0.18em] text-tinta/75 uppercase md:block">
            Role ↓
          </span>
        </div>
      </div>
    </Dawn>
  );
}
