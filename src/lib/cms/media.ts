import type { Midia } from "@/payload-types";

type SizeName = keyof NonNullable<Midia["sizes"]>;

/** Narrows a Payload upload relation (id or populated doc) to the doc. */
export function asMidia(value: number | Midia | null | undefined): Midia | null {
  return value && typeof value === "object" ? value : null;
}

/**
 * Payload prefixes local file URLs with serverURL. next/image only optimizes
 * same-site paths (or whitelisted hosts), so same-site URLs become paths.
 * Vercel Blob URLs (production) stay absolute and match `remotePatterns`.
 */
export function publicPath(url: string): string {
  const server = process.env.NEXT_PUBLIC_SERVER_URL;
  if (server && url.startsWith(server)) return url.slice(server.length) || "/";
  return url;
}

/** Best URL for a media doc: the requested size when generated, else the original. */
export function mediaSrc(media: Midia, size?: SizeName): { url: string; width: number; height: number } | null {
  const variant = size ? media.sizes?.[size] : undefined;
  const url = variant?.url ?? media.url;
  const width = variant?.width ?? media.width;
  const height = variant?.height ?? media.height;
  if (!url || !width || !height) return null;
  return { url: publicPath(url), width, height };
}
