/**
 * Content fixes applied on top of the import, on every deploy
 * (scripts/vercel-build.sh). Each fix checks first, so a run with nothing to do
 * writes nothing, and edits made in the admin afterwards are kept.
 *
 * 1. Images lost inside headings: WordPress sometimes wrapped an image in a
 *    heading (<h2><p>[[image:0]]</p></h2>); older imports left the marker as
 *    text. Replaces it with the image, preferring the file the team sent
 *    (complementos.json → imagens) over a download from the old site.
 * 2. Projects: team-supplied gallery and text sections (complementos.json →
 *    projetos.<wpId>.galeria / acrescentar), added once.
 * 3. Pages: images whose download failed at import time and that the team sent
 *    later (complementos.json → paginas.<wpId>.imagensNoFim), appended once.
 *
 *   npm run conteudo:ajustes
 */
import config from "@payload-config";
import { convertHTMLToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { JSDOM } from "jsdom";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import type { WpSnapshot } from "./wp/types";

const COMPLEMENTOS_DIR = path.resolve("data/wp-export/complementos");
const COLLECTIONS = ["paginas", "projetos", "noticias"] as const;
const MIME: Record<string, string> = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg" };

type Foto = { arquivo: string; alt: string; legenda?: string; credito?: string };
type Complementos = {
  imagens?: Record<string, Foto | string>;
  projetos?: Record<string, { galeria?: Foto[]; acrescentar?: string }>;
  paginas?: Record<string, { imagensNoFim?: string[] }>;
};
type LexNode = { type: string; children?: LexNode[]; text?: string; [key: string]: unknown };

const payload = await getPayload({ config });
const snapshot = JSON.parse(await readFile(path.resolve("data/wp-export/snapshot.json"), "utf8")) as WpSnapshot;
const complementos = JSON.parse(
  await readFile(path.resolve("data/wp-export/complementos.json"), "utf8"),
) as Complementos;
// A fresh object per call: the storage plugin keeps the pending upload in req.context.
const ctx = () => ({ disableRevalidate: true });
const log: string[] = [];

const nodeText = (n: LexNode): string => n.text ?? (n.children ?? []).map(nodeText).join("");

async function midiaPorOrigem(origem: string) {
  const { docs } = await payload.find({
    collection: "midia",
    where: { origem: { equals: origem } },
    limit: 1,
    depth: 0,
  });
  return docs[0] ?? null;
}

/** A team file as a midia entry (origem "complementos/<arquivo>"), created once. */
async function midiaDoArquivo(foto: Foto) {
  const origem = `complementos/${foto.arquivo}`;
  const existing = await midiaPorOrigem(origem);
  if (existing) return existing.id;
  const data = await readFile(path.join(COMPLEMENTOS_DIR, foto.arquivo));
  const doc = await payload.create({
    collection: "midia",
    data: { alt: foto.alt, legenda: foto.legenda, credito: foto.credito, origem },
    file: {
      data,
      mimetype: MIME[path.extname(foto.arquivo)] ?? "image/webp",
      name: path.basename(foto.arquivo),
      size: data.length,
    },
    context: ctx(),
  });
  return doc.id;
}

/** The image the marker points to: the team's file, one already imported, or a download. */
async function midiaDaImagem(url: string, titulo: string) {
  const time = complementos.imagens?.[url];
  if (time && typeof time === "object") return midiaDoArquivo(time);
  const existing = await midiaPorOrigem(url);
  if (existing) return existing.id;
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) }).catch(() => null);
  const mimetype = (res?.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!res?.ok || !mimetype.startsWith("image/")) return null;
  const data = Buffer.from(await res.arrayBuffer());
  const doc = await payload.create({
    collection: "midia",
    data: { alt: `Imagem da página “${titulo}”`, altProvisorio: true, origem: url },
    file: { data, mimetype, name: decodeURIComponent(new URL(url).pathname.split("/").pop()!), size: data.length },
    context: ctx(),
  });
  return doc.id;
}

const upload = (value: number | string): LexNode => ({
  type: "upload",
  version: 3,
  format: "",
  fields: {},
  id: crypto.randomUUID().replace(/-/g, "").slice(0, 24),
  relationTo: "midia",
  value,
});

// 1. Markers left as text ---------------------------------------------------------
const entradas = new Map(snapshot.entries.map((e) => [e.wpId, e]));
for (const collection of COLLECTIONS) {
  const { docs } = await payload.find({
    collection,
    where: { "legado.wpId": { exists: true } },
    pagination: false,
    depth: 0,
  });
  for (const doc of docs as unknown as Array<{
    id: number;
    titulo: string;
    legado?: { wpId?: number };
    conteudo?: { root: LexNode };
  }>) {
    const root = doc.conteudo?.root;
    if (!root?.children?.some((n) => /^\[\[image:\d+\]\]$/.test(nodeText(n).trim()))) continue;
    const imagens = entradas.get(doc.legado!.wpId!)?.inlineImages ?? [];
    const children: LexNode[] = [];
    for (const node of root.children) {
      const marker = nodeText(node)
        .trim()
        .match(/^\[\[image:(\d+)\]\]$/);
      if (!marker) {
        children.push(node);
        continue;
      }
      const imagem = imagens[Number(marker[1])];
      const id = imagem ? await midiaDaImagem(imagem.url, doc.titulo) : null;
      if (id) children.push(upload(id));
      else log.push(`  ${collection} #${doc.id}: imagem ${marker[1]} sem fonte, marcador removido`);
    }
    await payload.update({
      collection,
      id: doc.id,
      data: { conteudo: { ...doc.conteudo, root: { ...root, children } } },
      context: ctx(),
      depth: 0,
    });
    log.push(`${collection} #${doc.id} “${doc.titulo}”: imagens repostas`);
  }
}

// 2. Project galleries and sections ------------------------------------------------
const editorConfig = await editorConfigFactory.default({ config: payload.config });
for (const [wpId, extra] of Object.entries(complementos.projetos ?? {})) {
  if (!extra.galeria && !extra.acrescentar) continue;
  const { docs } = await payload.find({
    collection: "projetos",
    where: { "legado.wpId": { equals: Number(wpId) } },
    limit: 1,
    depth: 0,
  });
  const projeto = docs[0];
  if (!projeto) continue;
  const data: Record<string, unknown> = {};

  if (extra.galeria && !projeto.galeria?.length) {
    const ids = [];
    for (const foto of extra.galeria) ids.push(await midiaDoArquivo(foto));
    data.galeria = ids.map((imagem) => ({ imagem }));
  }

  if (extra.acrescentar && projeto.conteudo) {
    const html = await readFile(path.join(COMPLEMENTOS_DIR, extra.acrescentar), "utf8");
    const novo = convertHTMLToLexical({ editorConfig, html, JSDOM }).root as unknown as LexNode;
    const root = projeto.conteudo.root as unknown as LexNode;
    const marca = nodeText(novo.children![0]).trim();
    // Added once: skipped when the section's first heading is already there.
    if (!root.children!.some((n) => nodeText(n).trim() === marca)) {
      // Before the closing credits ("Início: …", "Duração: …"), or at the end.
      const fim = root.children!.findIndex((n) => /^Início:/.test(nodeText(n).trim()));
      const children = [...root.children!];
      children.splice(fim === -1 ? children.length : fim, 0, ...novo.children!);
      data.conteudo = { ...projeto.conteudo, root: { ...root, children } };
    }
  }

  if (Object.keys(data).length) {
    await payload.update({ collection: "projetos", id: projeto.id, data, context: ctx(), depth: 0 });
    log.push(`projetos #${projeto.id} “${projeto.titulo}”: ${Object.keys(data).join(" e ")} complementados`);
  }
}

// 3. Images appended to pages ------------------------------------------------------
for (const [wpId, extra] of Object.entries(complementos.paginas ?? {})) {
  const { docs } = await payload.find({
    collection: "paginas",
    where: { "legado.wpId": { equals: Number(wpId) } },
    limit: 1,
    depth: 0,
  });
  const pagina = docs[0];
  const root = pagina?.conteudo?.root as unknown as LexNode | undefined;
  if (!pagina || !root) continue;
  const presentes = new Set(root.children!.filter((n) => n.type === "upload").map((n) => n.value));
  const novos: LexNode[] = [];
  for (const url of extra.imagensNoFim ?? []) {
    const id = await midiaDaImagem(url, pagina.titulo);
    if (id && !presentes.has(id)) novos.push(upload(id));
  }
  if (!novos.length) continue;
  // Trailing empty paragraphs (where the lost image used to be) go first.
  const children = [...root.children!];
  while (children.length && children.at(-1)!.type === "paragraph" && !nodeText(children.at(-1)!).trim()) children.pop();
  await payload.update({
    collection: "paginas",
    id: pagina.id,
    data: { conteudo: { ...pagina.conteudo, root: { ...root, children: [...children, ...novos] } } },
    context: ctx(),
    depth: 0,
  });
  log.push(`paginas #${pagina.id} “${pagina.titulo}”: ${novos.length} imagem(ns) no fim`);
}

console.log(`ajustes de conteúdo: ${log.length ? "" : "nada a fazer"}`);
for (const l of log) console.log(`  ${l}`);
process.exit(0);
