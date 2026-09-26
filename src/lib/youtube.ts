import { unstable_cache } from "next/cache";

export type Video = { id: string; titulo: string; publicadoEm?: string | null; descricao?: string | null };

const ID = /^[A-Za-z0-9_-]{11}$/;

/** Extracts the video id from youtube.com/watch?v=, youtu.be/, /embed/ or /shorts/ URLs (or a bare id). */
export function youtubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (ID.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return ID.test(url.pathname.slice(1)) ? url.pathname.slice(1) : null;
    if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;
    const v = url.searchParams.get("v");
    if (v && ID.test(v)) return v;
    const [, kind, id] = url.pathname.split("/");
    return (kind === "embed" || kind === "shorts" || kind === "live") && ID.test(id ?? "") ? id : null;
  } catch {
    return null;
  }
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/**
 * Latest uploads of a channel from its public RSS feed: no API key, no quota.
 * Cached for 6 h; a network failure yields [] so the page still renders with
 * the videos curated in the panel.
 */
export function getChannelVideos(channelId: string | null | undefined): Promise<Video[]> {
  if (!channelId) return Promise.resolve([]);
  return unstable_cache(
    async () => {
      try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]): Video[] => {
          const id = entry.match(/<yt:videoId>([^<]+)</)?.[1];
          const titulo = entry.match(/<title>([^<]+)</)?.[1];
          if (!id || !titulo) return [];
          return [
            {
              id,
              titulo: decode(titulo),
              publicadoEm: entry.match(/<published>([^<]+)</)?.[1] ?? null,
              descricao:
                decode(entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? "").trim() || null,
            },
          ];
        });
      } catch {
        return [];
      }
    },
    ["youtube:channel", channelId],
    { revalidate: 60 * 60 * 6, tags: ["youtube"] },
  )();
}

/** Public title of a video (oEmbed, no key). Cached for a week; null when unreachable. */
export async function youtubeTitle(id: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`, {
      next: { revalidate: 60 * 60 * 24 * 7, tags: ["youtube"] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title ?? null;
  } catch {
    return null;
  }
}
