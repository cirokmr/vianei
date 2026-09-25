import type { Midia } from "@/payload-types";

type SizeName = keyof NonNullable<Midia["sizes"]>;

/** Narrows a Payload upload relation (id or populated doc) to the doc. */
export function asMidia(value: number | Midia | null | undefined): Midia | null {
  return value && typeof value === "object" ? value : null;
}

/** Best URL for a media doc: the requested size when generated, else the original. */
export function mediaSrc(media: Midia, size?: SizeName): { url: string; width: number; height: number } | null {
  const variant = size ? media.sizes?.[size] : undefined;
  const url = variant?.url ?? media.url;
  const width = variant?.width ?? media.width;
  const height = variant?.height ?? media.height;
  if (!url || !width || !height) return null;
  return { url, width, height };
}
