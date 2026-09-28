import Image, { type StaticImageData } from "next/image";
import { ClipImage } from "@/components/motion/ClipImage";

type Props = {
  src: StaticImageData;
  alt: string;
  /** Short caption over the bottom of the photo. */
  legenda?: string;
  credito?: string;
  /** Focal point for object-position (e.g. "50% 30%"). */
  foco?: string;
};

/**
 * A full-screen photograph between chapters: revealed with a wipe and a slow
 * parallax (ClipImage). Only for high-resolution photos (≥ 1500 px wide).
 */
export function FullBleedPhoto({ src, alt, legenda, credito, foco = "50% 50%" }: Props) {
  return (
    <figure data-header="dark" className="relative h-svh min-h-[26rem] w-full bg-mata">
      <ClipImage className="absolute inset-0" from="bottom">
        <Image src={src} alt={alt} sizes="100vw" quality={75} style={{ objectPosition: foco }} />
      </ClipImage>
      {legenda || credito ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-mata/70 to-transparent px-[var(--gutter)] pt-24 pb-[clamp(1.5rem,4vh,2.5rem)] text-sm text-papel/90">
          {legenda}
          {credito ? <span className="ml-2 tracking-[0.12em] text-papel/70 uppercase">{credito}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
