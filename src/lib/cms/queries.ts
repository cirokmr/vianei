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

const resumoSelect = { titulo: true, slug: true, resumo: true, publicadoEm: true, capa: true } as const;
const publicada = { _status: { equals: "published" } } as const;

export const NOTICIAS_POR_PAGINA = 12;

export async function getNoticias({
  page = 1,
  limit = NOTICIAS_POR_PAGINA,
  categoria,
}: { page?: number; limit?: number; categoria?: number } = {}) {
  return unstable_cache(
    async () => {
      const result = await (
        await payload()
      ).find({
        collection: "noticias",
        where: categoria ? { and: [publicada, { categorias: { in: [categoria] } }] } : publicada,
        sort: "-publicadoEm",
        page,
        limit,
        depth: 1,
        select: resumoSelect,
      });
      return { ...result, docs: result.docs as NoticiaResumo[] };
    },
    ["noticias:list", String(page), String(limit), String(categoria ?? "")],
    { tags: [cacheTags.collection("noticias")] },
  )();
}

/** Title/summary search. Uncached: every query is different and the page is dynamic. */
export async function searchNoticias(q: string, limit = 30) {
  const termo = q.trim().slice(0, 80);
  if (termo.length < 2) return [];
  const result = await (
    await payload()
  ).find({
    collection: "noticias",
    where: { and: [publicada, { or: [{ titulo: { like: termo } }, { resumo: { like: termo } }] }] },
    sort: "-publicadoEm",
    limit,
    depth: 1,
    select: resumoSelect,
  });
  return result.docs as NoticiaResumo[];
}

/** Latest news sharing a category (or a project) with `noticia`, excluding it. */
export async function getNoticiasRelacionadas(noticia: Noticia, limit = 3) {
  const ids = (list: Noticia["categorias"] | Noticia["projetos"]) =>
    (list ?? []).map((item) => (typeof item === "object" ? item.id : item));
  const categorias = ids(noticia.categorias);
  const projetos = ids(noticia.projetos);
  if (!categorias.length && !projetos.length) return [];

  return unstable_cache(
    async () => {
      const result = await (
        await payload()
      ).find({
        collection: "noticias",
        where: {
          and: [
            publicada,
            { id: { not_equals: noticia.id } },
            {
              or: [
                ...(projetos.length ? [{ projetos: { in: projetos } }] : []),
                ...(categorias.length ? [{ categorias: { in: categorias } }] : []),
              ],
            },
          ],
        },
        sort: "-publicadoEm",
        limit,
        depth: 1,
        select: resumoSelect,
      });
      return result.docs as NoticiaResumo[];
    },
    ["noticias:relacionadas", String(noticia.id), categorias.join(","), projetos.join(",")],
    { tags: [cacheTags.collection("noticias")] },
  )();
}

/** News linked to a project (project page). */
export async function getNoticiasDoProjeto(projetoId: number, limit = 6) {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "noticias",
          where: { and: [publicada, { projetos: { in: [projetoId] } }] },
          sort: "-publicadoEm",
          limit,
          depth: 1,
          select: resumoSelect,
        })
      ).docs as NoticiaResumo[],
    ["noticias:projeto", String(projetoId), String(limit)],
    { tags: [cacheTags.collection("noticias")] },
  )();
}

export async function getCategorias() {
  return unstable_cache(
    async () =>
      (await (await payload()).find({ collection: "categorias", sort: "titulo", pagination: false, depth: 0 })).docs,
    ["categorias:list"],
    { tags: [cacheTags.collection("categorias")] },
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
          select: { titulo: true, slug: true, resumo: true, capa: true, areas: true, inicio: true },
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

/** Published pages under a path prefix, with titles (e.g. a project's subpages). */
export async function getPaginas(prefix: string) {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "paginas",
          where: { and: [{ _status: { equals: "published" } }, { caminho: { like: `${prefix}%` } }] },
          sort: "caminho",
          pagination: false,
          select: { caminho: true, titulo: true },
        })
      ).docs.map((d) => ({ caminho: d.caminho, titulo: d.titulo })),
    ["paginas:prefix", prefix],
    { tags: [cacheTags.collection("paginas")] },
  )();
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

// Library and videos ----------------------------------------------------------

export async function getPublicacoes() {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "publicacoes",
          where: { _status: { equals: "published" } },
          sort: ["-ano", "titulo"],
          pagination: false,
          depth: 1,
        })
      ).docs,
    ["publicacoes:list"],
    { tags: [cacheTags.collection("publicacoes")] },
  )();
}

export async function getVideos() {
  return unstable_cache(
    async () =>
      (
        await (
          await payload()
        ).find({
          collection: "videos",
          sort: ["-destaque", "-publicadoEm"],
          pagination: false,
          depth: 0,
        })
      ).docs,
    ["videos:list"],
    { tags: [cacheTags.collection("videos")] },
  )();
}
