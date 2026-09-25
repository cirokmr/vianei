import "server-only";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import type { Noticia, Site } from "@/payload-types";
import { payload } from "./payload";
import { cacheTags } from "./tags";

// Published content is cached with tags and invalidated by Payload hooks
// (src/payload/hooks/revalidate.ts). Draft mode bypasses the cache and reads
// drafts, which is what powers preview and Live Preview in the admin.

export async function getSite(): Promise<Site> {
  return unstable_cache(async () => (await payload()).findGlobal({ slug: "site", depth: 1 }), ["global:site"], {
    tags: [cacheTags.global("site")],
  })();
}

export type NoticiaResumo = Pick<Noticia, "id" | "titulo" | "slug" | "resumo" | "publicadoEm" | "capa">;

export async function getNoticias({ page = 1, limit = 12 }: { page?: number; limit?: number } = {}) {
  return unstable_cache(
    async () => {
      const result = await (
        await payload()
      ).find({
        collection: "noticias",
        where: { _status: { equals: "published" } },
        sort: "-publicadoEm",
        page,
        limit,
        depth: 1,
        select: { titulo: true, slug: true, resumo: true, publicadoEm: true, capa: true },
      });
      return { ...result, docs: result.docs as NoticiaResumo[] };
    },
    ["noticias:list", String(page), String(limit)],
    { tags: [cacheTags.collection("noticias")] },
  )();
}

export async function getNoticia(slug: string): Promise<Noticia | null> {
  const { isEnabled: draft } = await draftMode();

  const query = async () => {
    const result = await (
      await payload()
    ).find({
      collection: "noticias",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      draft,
      overrideAccess: draft,
    });
    return result.docs[0] ?? null;
  };

  if (draft) return query();
  return unstable_cache(query, ["noticias:doc", slug], {
    tags: [cacheTags.collection("noticias"), cacheTags.doc("noticias", slug)],
  })();
}

export async function getNoticiaSlugs(): Promise<string[]> {
  const result = await (
    await payload()
  ).find({
    collection: "noticias",
    where: { _status: { equals: "published" } },
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });
  return result.docs.map((doc) => doc.slug).filter(Boolean);
}
