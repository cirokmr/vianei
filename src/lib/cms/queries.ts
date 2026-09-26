import "server-only";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import type { Noticia, Pagina, Projeto, Site } from "@/payload-types";
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

// Projects -------------------------------------------------------------------

export async function getProjetos() {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "projetos",
          where: { _status: { equals: "published" } },
          sort: "-inicio",
          limit: 100,
          depth: 1,
          select: { titulo: true, slug: true, resumo: true, capa: true },
        })
      ).docs,
    ["projetos:list"],
    { tags: [cacheTags.collection("projetos")] },
  )();
}

export async function getProjeto(slug: string): Promise<Projeto | null> {
  const { isEnabled: draft } = await draftMode();
  const query = async () =>
    (
      await (
        await payload()
      ).find({
        collection: "projetos",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
        draft,
        overrideAccess: draft,
      })
    ).docs[0] ?? null;
  if (draft) return query();
  return unstable_cache(query, ["projetos:doc", slug], {
    tags: [cacheTags.collection("projetos"), cacheTags.doc("projetos", slug)],
  })();
}

export async function getProjetoSlugs(): Promise<string[]> {
  const result = await (
    await payload()
  ).find({
    collection: "projetos",
    where: { _status: { equals: "published" } },
    pagination: false,
    select: { slug: true },
  });
  return result.docs.map((doc) => doc.slug).filter(Boolean);
}

// Free-form pages ------------------------------------------------------------

export async function getPagina(caminho: string): Promise<Pagina | null> {
  const { isEnabled: draft } = await draftMode();
  const query = async () =>
    (
      await (
        await payload()
      ).find({
        collection: "paginas",
        where: { caminho: { equals: caminho } },
        limit: 1,
        depth: 2,
        draft,
        overrideAccess: draft,
      })
    ).docs[0] ?? null;
  if (draft) return query();
  return unstable_cache(query, ["paginas:doc", caminho], {
    tags: [cacheTags.collection("paginas"), cacheTags.doc("paginas", caminho)],
  })();
}

export async function getPaginaCaminhos(prefix: string): Promise<string[]> {
  const result = await (
    await payload()
  ).find({
    collection: "paginas",
    where: { and: [{ _status: { equals: "published" } }, { caminho: { like: `${prefix}%` } }] },
    pagination: false,
    select: { caminho: true },
  });
  return result.docs.map((doc) => doc.caminho);
}

// Institutional (home, quem somos) ---------------------------------------------

function cachedGlobal<S extends "numeros" | "timeline">(slug: S) {
  return unstable_cache(async () => (await payload()).findGlobal({ slug, depth: 1 }), [`global:${slug}`], {
    tags: [cacheTags.global(slug)],
  })();
}

export const getNumeros = () => cachedGlobal("numeros");
export const getTimeline = () => cachedGlobal("timeline");

export async function getParceiros() {
  return unstable_cache(
    async () =>
      (await (await payload()).find({ collection: "parceiros", sort: ["ordem", "nome"], pagination: false, depth: 1 }))
        .docs,
    ["parceiros:list"],
    { tags: [cacheTags.collection("parceiros")] },
  )();
}

export async function getPessoas() {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "pessoas",
          sort: ["ordem", "nome"],
          pagination: false,
          depth: 1,
          // E-mails only leave the server when the team marked them public.
          select: { nome: true, grupo: true, cargo: true, formacao: true, foto: true, email: true, emailPublico: true },
        })
      ).docs.map(({ email, emailPublico, ...pessoa }) => ({ ...pessoa, email: (emailPublico && email) || null })),
    ["pessoas:list"],
    { tags: [cacheTags.collection("pessoas")] },
  )();
}
