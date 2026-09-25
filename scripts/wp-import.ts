/**
 * Imports data/wp-export/snapshot.json into Payload.
 *
 *   npm run wp:import            # full import
 *   npm run wp:import -- --dry   # parse and report only, no writes
 *
 * Idempotent: documents are matched by `legado.wpId`, files by `origem`
 * (their original URL), so it can be re-run after fixing something.
 * Outputs:
 *   src/redirects.json                       301s from old URLs (read by next.config.ts)
 *   data/wp-export/migration-report.md       counts, bytes before/after, items to review
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { convertHTMLToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { JSDOM } from "jsdom";
import { getPayload, type CollectionSlug } from "payload";
import { slugify } from "../src/payload/fields/slug";
import { normalizeHeadings } from "./wp/clean";
import { get, mapLimit } from "./wp/http";
import type { WpEntry, WpImage, WpSnapshot } from "./wp/types";

const DRY = process.argv.includes("--dry");
const SNAPSHOT = path.resolve("data/wp-export/snapshot.json");
const REPORT = path.resolve("data/wp-export/migration-report.md");
const REDIRECTS = path.resolve("src/redirects.json");
// origem URL → original size in bytes, so re-runs can still report savings.
const SIZES = path.resolve("data/wp-export/media-sizes.json");
const ctx = { disableRevalidate: true };

const snapshot = JSON.parse(await readFile(SNAPSHOT, "utf8")) as WpSnapshot;
const payload = await getPayload({ config });
const editorConfig = await editorConfigFactory.default({ config: payload.config });
const source = new URL(snapshot.source);

// Report state ----------------------------------------------------------------
const stats = {
  imagesImported: 0,
  imagesReused: 0,
  imagesFailed: [] as string[],
  bytesBefore: 0,
  bytesAfter: 0,
  pdfs: 0,
  pdfsReused: 0,

  created: {} as Record<string, number>,
  updated: {} as Record<string, number>,
  warnings: [...snapshot.warnings],
};
const redirects = new Map<string, string>();
const originalSizes: Record<string, number> = await readFile(SIZES, "utf8")
  .then((text) => JSON.parse(text) as Record<string, number>)
  .catch(() => ({}));

// Text helpers ------------------------------------------------------------------
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu;

/** "🌲 Dia da Araucária! 🌲" → "Dia da Araucária!" */
export function cleanTitle(title: string): string {
  return title.replace(EMOJI, "").replace(/\s+/g, " ").trim();
}

function excerpt(html: string, max = 220): string {
  const { document } = new JSDOM(`<body>${html}</body>`).window;
  const first = Array.from(document.querySelectorAll("p"))
    .map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "")
    .find((text) => text.length > 40 && !text.startsWith("[["));
  if (!first) return "";
  if (first.length <= max) return first;
  return `${first.slice(0, first.lastIndexOf(" ", max)).replace(/[,;:.–-]+$/, "")}…`;
}

const bump = (map: Record<string, number>, key: string) => (map[key] = (map[key] ?? 0) + 1);

// Files ----------------------------------------------------------------------------

const MIME_OK = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

async function download(urls: string[]) {
  for (const url of urls) {
    try {
      const res = await get(url, 3);
      const data = Buffer.from(await res.arrayBuffer());
      const mimetype = (res.headers.get("content-type") ?? "").split(";")[0].trim();
      return { url, data, mimetype };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

/**
 * Payload returns file URLs prefixed with serverURL (http://localhost:3000 in
 * dev). Store same-site URLs as paths so content and redirects work in every
 * environment; Vercel Blob URLs (production) stay absolute.
 */
function publicUrl(url: string): string {
  const server = payload.config.serverURL;
  return server && url.startsWith(server) ? url.slice(server.length) : url;
}

function fileName(url: string) {
  return decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "arquivo");
}

async function findByOrigem(collection: "midia" | "documentos", origem: string) {
  const found = await payload.find({ collection, where: { origem: { equals: origem } }, limit: 1, depth: 0 });
  return found.docs[0] ?? null;
}

/** Imports an image once (matched by original URL). Returns the midia id. */
async function importImage(image: WpImage, fallbackAlt: string): Promise<number | null> {
  const existing = await findByOrigem("midia", image.url);
  if (existing) {
    stats.imagesReused++;
    stats.bytesBefore += originalSizes[image.url] ?? 0;
    stats.bytesAfter += originalSizes[image.url] ? ((existing.filesize as number) ?? 0) : 0;
    return existing.id as number;
  }
  if (DRY) return null;

  const file = await download([image.url, image.fallbackUrl].filter(Boolean) as string[]);
  if (!file || !MIME_OK.has(file.mimetype)) {
    stats.imagesFailed.push(`${image.url} (${file ? file.mimetype : "download falhou"})`);
    return null;
  }

  // Made-up alts stay readable ("Foto da notícia …") and are flagged for review.
  const alt = image.alt || image.caption || fallbackAlt;

  // Photos hotlinked from partner sites (republished articles) keep a source
  // credit, and the team confirms the right to use them.
  const host = new URL(image.url).hostname.replace(/^www\./, "");
  const external = host !== source.hostname.replace(/^www\./, "");

  const doc = await payload.create({
    collection: "midia",
    data: {
      alt,
      altProvisorio: !image.alt && !image.caption,
      legenda: image.caption || undefined,
      credito: external ? `Reprodução: ${host}` : undefined,
      origem: image.url,
    },
    file: { data: file.data, mimetype: file.mimetype, name: fileName(file.url), size: file.data.length },
    context: ctx,
  });
  stats.imagesImported++;
  originalSizes[image.url] = file.data.length;
  stats.bytesBefore += file.data.length;
  // What visitors actually get: the re-encoded original (the largest variant).
  stats.bytesAfter += doc.filesize ?? 0;
  return doc.id;
}

/** Imports a PDF once. Returns { id, url } of the documentos entry. */
async function importPdf(url: string, titulo: string) {
  const existing = await findByOrigem("documentos", url);
  if (existing) {
    stats.pdfsReused++;
    return { id: existing.id as number, url: publicUrl(existing.url as string) };
  }
  if (DRY) return null;

  const file = await download([url]);
  if (!file || file.mimetype !== "application/pdf") {
    stats.warnings.push(`PDF não baixado: ${url} (${file?.mimetype ?? "falhou"})`);
    return null;
  }
  const doc = await payload.create({
    collection: "documentos",
    data: { titulo, origem: url },
    file: { data: file.data, mimetype: file.mimetype, name: fileName(url), size: file.data.length },
    context: ctx,
  });
  stats.pdfs++;
  return { id: doc.id, url: publicUrl(doc.url as string) };
}

// URL mapping ----------------------------------------------------------------------
const newPathFor = new Map<string, string>(); // old pathname → new pathname

function oldPath(url: string) {
  return new URL(url).pathname.replace(/\/+$/, "") || "/";
}

function mapPagePath(wpPath: string) {
  return wpPath.replace(/^projetos1(\/|$)/, "projetos$1");
}

/** Rewrites links in body HTML: old internal pages → new paths, PDFs → migrated files. */
async function rewriteLinks(html: string, title: string) {
  const { document } = new JSDOM(`<body>${html}</body>`).window;
  for (const a of Array.from(document.querySelectorAll("a"))) {
    let url: URL;
    try {
      url = new URL(a.getAttribute("href") ?? "");
    } catch {
      continue;
    }
    if (url.hostname !== source.hostname && url.hostname !== `www.${source.hostname}`) continue;

    if (/\.pdf$/i.test(url.pathname)) {
      const pdf = await importPdf(url.href, a.textContent?.trim() || title);
      if (pdf) {
        a.setAttribute("href", pdf.url);
        redirects.set(url.pathname, pdf.url);
      }
      continue;
    }
    const mapped = newPathFor.get(url.pathname.replace(/\/+$/, "") || "/");
    a.setAttribute("href", mapped ?? url.pathname.replace(/\/+$/, "") ?? "/");
  }
  return document.body.innerHTML;
}

// Lexical ----------------------------------------------------------------------------
type LexNode = { type: string; children?: LexNode[]; text?: string; [key: string]: unknown };

function nodeText(node: LexNode): string {
  return node.text ?? (node.children ?? []).map(nodeText).join("");
}

/**
 * HTML → Lexical, replacing `[[image:N]]` paragraphs with upload nodes.
 * `skipUrl` drops an inline copy of the cover (WordPress posts often repeat it).
 */
async function toLexical(html: string, images: WpImage[], title: string, skipUrl?: string) {
  const rewritten = normalizeHeadings(await rewriteLinks(html, title));
  const state = convertHTMLToLexical({ editorConfig, html: rewritten, JSDOM });
  const root = state.root as unknown as LexNode;

  const children: LexNode[] = [];
  for (const node of root.children ?? []) {
    const marker =
      node.type === "paragraph"
        ? nodeText(node)
            .trim()
            .match(/^\[\[image:(\d+)\]\]$/)
        : null;
    if (!marker) {
      children.push(node);
      continue;
    }
    const image = images[Number(marker[1])];
    if (image && skipUrl && (image.url === skipUrl || image.fallbackUrl === skipUrl)) continue;
    const id = image ? await importImage(image, `Imagem da página “${title}”`) : null;
    if (id) {
      children.push({
        type: "upload",
        version: 3,
        format: "",
        fields: {},
        id: crypto.randomUUID().replace(/-/g, "").slice(0, 24),
        relationTo: "midia",
        value: id,
      });
    }
  }
  root.children = children;
  return state;
}

// Upsert ----------------------------------------------------------------------------
async function upsert(collection: CollectionSlug, wpId: number, data: Record<string, unknown>) {
  if (DRY) return null;
  const existing = await payload.find({
    collection,
    where: { "legado.wpId": { equals: wpId } },
    limit: 1,
    depth: 0,
    draft: true,
  });
  if (existing.docs[0]) {
    bump(stats.updated, collection);
    return payload.update({ collection, id: existing.docs[0].id, data, context: ctx, depth: 0, draft: false });
  }
  bump(stats.created, collection);
  return payload.create({ collection, data, context: ctx, depth: 0, draft: false } as Parameters<
    typeof payload.create
  >[0]);
}

// Importers ------------------------------------------------------------------------
const NAV_ONLY_PAGES = new Set([
  "projetos1",
  "projetos1/projeto-restaurar",
  "projetos1/projeto-restaurar/projetos-de-assentamento",
]);

function planPaths(entries: WpEntry[]) {
  for (const e of entries) {
    const from = oldPath(e.url);
    if (e.type === "noticias" || e.type === "projetos") {
      const slug = slugify(decodeURIComponent(e.slug));
      newPathFor.set(from, `/${e.type}/${slug}`);
    } else if (e.type === "publicacoes") {
      newPathFor.set(from, "/publicacoes"); // covered by the /publicacoes/:slug pattern below
    } else if (e.type === "paginas" && e.path) {
      newPathFor.set(from, NAV_ONLY_PAGES.has(e.path) ? navOnlyTarget(e.path) : `/${mapPagePath(e.path)}`);
    }
  }
}

function navOnlyTarget(wpPath: string) {
  return wpPath === "projetos1" ? "/projetos" : "/projetos/projeto-restaurar";
}

async function importNoticia(e: WpEntry) {
  const titulo = cleanTitle(e.title);
  const capa = e.featured ? await importImage(e.featured, `Foto da notícia “${titulo}”`) : null;
  const resumo = (e.subtitle || excerpt(e.bodyHtml)).slice(0, 280);
  await upsert("noticias", e.wpId, {
    titulo,
    resumo: resumo || undefined,
    capa: capa ?? undefined,
    conteudo: await toLexical(e.bodyHtml, e.inlineImages, titulo, e.featured?.url),
    slug: slugify(decodeURIComponent(e.slug)),
    publicadoEm: e.publishedAt,
    legado: { wpId: e.wpId, wpUrl: e.url },
    _status: "published",
  });
}

async function importProjeto(e: WpEntry) {
  const titulo = cleanTitle(e.title);
  const capa = e.featured ? await importImage(e.featured, `Foto do projeto “${titulo}”`) : null;
  const ativo = e.terms.some((t) => /executando|andamento/i.test(t));
  await upsert("projetos", e.wpId, {
    titulo,
    resumo: excerpt(e.bodyHtml, 300) || undefined,
    capa: capa ?? undefined,
    conteudo: await toLexical(e.bodyHtml, e.inlineImages, titulo, e.featured?.url),
    slug: slugify(decodeURIComponent(e.slug)),
    situacao: ativo ? "ativo" : "concluido",
    inicio: e.publishedAt,
    legado: { wpId: e.wpId, wpUrl: e.url },
    _status: "published",
  });
  if (!e.terms.length) stats.warnings.push(`projeto sem situação no WP (marcado como concluído): ${titulo}`);
}

async function importPublicacao(e: WpEntry) {
  // "Pinhão na Culinária – Embrapa" → título + autoria
  const [first, ...rest] = cleanTitle(e.title).replace(/\.$/, "").split(" – ");
  const titulo = first.trim();
  const autoria = rest.join(" – ").trim() || undefined;
  const capa = e.featured ? await importImage(e.featured, `Capa de “${titulo}”`) : null;

  let arquivo: number | undefined;
  if (e.pdfUrl && /\.pdf$/i.test(e.pdfUrl)) {
    const pdf = await importPdf(e.pdfUrl, titulo);
    arquivo = pdf?.id;
    if (pdf) redirects.set(new URL(e.pdfUrl).pathname, pdf.url);
  } else if (e.pdfUrl) {
    stats.warnings.push(`publicação aponta para um arquivo que não é PDF (${e.pdfUrl}): ${titulo}`);
  }

  await upsert("publicacoes", e.wpId, {
    titulo,
    autoria,
    capa: capa ?? undefined,
    arquivo,
    slug: slugify(decodeURIComponent(e.slug)) || `publicacao-${e.wpId}`,
    ano: new Date(e.publishedAt).getUTCFullYear(),
    legado: { wpId: e.wpId, wpUrl: e.url },
    _status: "published",
  });
}

async function importPagina(e: WpEntry, projetoRestaurar: number | undefined) {
  if (!e.path || NAV_ONLY_PAGES.has(e.path)) return;
  const titulo = cleanTitle(e.title);
  await upsert("paginas", e.wpId, {
    titulo,
    caminho: mapPagePath(e.path),
    conteudo: await toLexical(e.bodyHtml, e.inlineImages, titulo),
    projeto: e.path.startsWith("projetos1/projeto-restaurar") ? projetoRestaurar : undefined,
    legado: { wpId: e.wpId, wpUrl: e.url },
    _status: "published",
  });
}

// Redirects --------------------------------------------------------------------------
function buildRedirects() {
  for (const [from, to] of newPathFor) {
    if (from !== to && !from.startsWith("/publicacoes/")) redirects.set(from, to);
  }
  // Old sections with a new home.
  const fixed: Record<string, string> = {
    "/fale-conosco": "/contato",
    "/obrigado": "/contato",
    "/galeria-de-videos": "/videos",
    "/inicio": "/",
    "/projetos1": "/projetos",
  };
  for (const [from, to] of Object.entries(fixed)) redirects.set(from, to);

  const list = [
    ...[...redirects].sort(([a], [b]) => a.localeCompare(b)).map(([source, destination]) => ({ source, destination })),
    // Patterns for anything the snapshot did not list explicitly.
    { source: "/projetos1/:path*", destination: "/projetos/:path*" },
    { source: "/categoria-de-projetos/:slug", destination: "/projetos" },
    { source: "/download/:slug", destination: "/publicacoes" },
    { source: "/publicacoes/:slug", destination: "/publicacoes" },
  ];
  return list.map((r) => ({ ...r, permanent: true }));
}

// Report -----------------------------------------------------------------------------
const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;

async function reviewLists() {
  const find = (where: Parameters<typeof payload.find>[0]["where"]) =>
    payload.find({
      collection: "midia",
      where,
      pagination: false,
      depth: 0,
      select: { alt: true, origem: true, credito: true },
    });
  const alt = await find({ altProvisorio: { equals: true } });
  const third = await find({ credito: { like: "Reprodução:" } });
  return {
    altToReview: alt.docs.map((d) => `#${d.id} ${d.alt}: ${d.origem}`),
    thirdParty: third.docs.map((d) => `#${d.id} ${d.credito}: ${d.origem}`),
  };
}

function report(redirectCount: number, review: { altToReview: string[]; thirdParty: string[] }) {
  const counts = (type: string) => snapshot.entries.filter((e) => e.type === type).length;
  const saving = stats.bytesBefore ? Math.round((1 - stats.bytesAfter / stats.bytesBefore) * 100) : 0;
  const lines = [
    "# Relatório da migração do WordPress",
    "",
    `Snapshot: ${snapshot.exportedAt} · fonte: ${snapshot.source} · importado em ${new Date().toISOString()}${DRY ? " (simulação)" : ""}`,
    "",
    "## Conteúdo",
    "",
    "| Tipo | No WordPress | Criados | Atualizados |",
    "| --- | ---: | ---: | ---: |",
    ...["noticias", "projetos", "publicacoes", "paginas"].map(
      (t) => `| ${t} | ${counts(t)} | ${stats.created[t] ?? 0} | ${stats.updated[t] ?? 0} |`,
    ),
    "",
    `As 3 páginas do mini-site que eram só menus (${[...NAV_ONLY_PAGES].join(", ")}) viraram redirects.`,
    "",
    "## Arquivos",
    "",
    `- Imagens: **${stats.imagesImported + stats.imagesReused}** no site novo (${stats.imagesImported} nesta execução, ${stats.imagesReused} já existiam; falhas: ${stats.imagesFailed.length})`,
    `- PDFs: **${stats.pdfs + stats.pdfsReused}** (${stats.pdfs} nesta execução)`,
    `- Peso das imagens: **${mb(stats.bytesBefore)} → ${mb(stats.bytesAfter)}** (−${saving}%), comparando o arquivo original do WordPress com o maior arquivo que o site novo guarda. Nas páginas, o site ainda serve versões menores (AVIF/WebP no tamanho da tela).`,
    `- Média por imagem: ${kb(stats.bytesBefore / Math.max(1, stats.imagesImported + stats.imagesReused))} → ${kb(stats.bytesAfter / Math.max(1, stats.imagesImported + stats.imagesReused))}`,
    "",
    `## Redirects 301: ${redirectCount}`,
    "",
    "Gerados em `src/redirects.json`. Todo endereço antigo de notícia, projeto, publicação e página leva ao novo.",
    "",
    "## Para a equipe revisar",
    "",
    `### Imagens sem texto alternativo (${review.altToReview.length})`,
    "",
    "Receberam um texto provisório (“Foto da notícia …”). No painel, em Imagens, filtre por",
    "“Texto alternativo provisório” e descreva cada uma; a marcação some ao salvar.",
    "",
    ...review.altToReview.map((a) => `- ${a}`),
    "",
    `### Avisos (${stats.warnings.length})`,
    "",
    ...stats.warnings.map((w) => `- ${w}`),
    ...(review.thirdParty.length
      ? [
          "",
          `### Imagens de outros sites (${review.thirdParty.length})`,
          "",
          "Vieram de matérias republicadas. Receberam o crédito “Reprodução: site”; confirme se podemos usá-las.",
          "",
          ...review.thirdParty.map((a) => `- ${a}`),
        ]
      : []),
    ...(stats.imagesFailed.length
      ? [
          "",
          `### Imagens não importadas (${stats.imagesFailed.length})`,
          "",
          "Rode `npm run wp:import` de novo numa rede sem bloqueios: o import é idempotente e só baixa o que falta.",
          "",
          ...stats.imagesFailed.map((f) => `- ${f}`),
        ]
      : []),
    "",
  ];
  return lines.join("\n");
}

/**
 * Writes here skip the Payload revalidation hooks (they need a Next request),
 * so ask the running site to expire its cache. Without this, pages keep
 * serving pre-import data until the next publish.
 */
async function revalidateSite() {
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    stats.warnings.push("cache não revalidado: defina NEXT_PUBLIC_SERVER_URL e REVALIDATE_SECRET e rode de novo");
    return;
  }
  try {
    const res = await fetch(`${url}/api/revalidate`, { method: "POST", headers: { "x-revalidate-secret": secret } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("cache do site revalidado");
  } catch (error) {
    stats.warnings.push(`cache não revalidado em ${url} (${String(error)}). Site fora do ar? Faça um novo deploy.`);
  }
}

// Main -------------------------------------------------------------------------------
async function main() {
  const entries = snapshot.entries;
  planPaths(entries);

  const byType = (t: WpEntry["type"]) => entries.filter((e) => e.type === t);

  // Projects first, so pages can link to them.
  for (const e of byType("projetos")) await importProjeto(e);
  const restaurar = DRY
    ? undefined
    : ((await payload.find({ collection: "projetos", where: { slug: { equals: "projeto-restaurar" } }, limit: 1 }))
        .docs[0]?.id as number | undefined);

  await mapLimit(byType("noticias"), 3, importNoticia);
  for (const e of byType("publicacoes")) await importPublicacao(e);
  for (const e of byType("paginas")) await importPagina(e, restaurar);

  if (!DRY) await revalidateSite();

  const list = buildRedirects();
  if (!DRY) {
    await writeFile(REDIRECTS, `${JSON.stringify(list, null, 2)}\n`);
    await writeFile(SIZES, `${JSON.stringify(originalSizes, null, 2)}\n`);
  }
  await writeFile(REPORT, report(list.length, DRY ? { altToReview: [], thirdParty: [] } : await reviewLists()));
  console.log(`ok: ${JSON.stringify(stats.created)} criados, ${JSON.stringify(stats.updated)} atualizados`);
  console.log(
    `imagens ${stats.imagesImported} (+${stats.imagesReused} reaproveitadas), PDFs ${stats.pdfs} (+${stats.pdfsReused})`,
  );
  console.log(`${mb(stats.bytesBefore)} → ${mb(stats.bytesAfter)}; ${list.length} redirects; relatório em ${REPORT}`);
  process.exit(0);
}

await main();
