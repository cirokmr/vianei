/**
 * Makes sure every image and PDF record has its file in Vercel Blob (or on the
 * local disk in dev, when there is no Blob token).
 * Runs on every Vercel deploy (scripts/vercel-build.sh): checks each file with
 * a HEAD request and re-sends the missing ones from their source (the old
 * WordPress URL in `origem`, or the team's files in data/wp-export/complementos),
 * keeping ids and file names so links in content keep working.
 *
 *   npm run blob:reparar
 */
import config from "@payload-config";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";

const COLLECTIONS = ["midia", "documentos"] as const;
const COMPLEMENTOS_DIR = path.resolve("data/wp-export/complementos");

const payload = await getPayload({ config });

type Doc = {
  id: number;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  origem?: string | null;
};

// Without a Blob token, files live on the local disk (dev): check there instead.
const BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function faltando(collection: string, doc: Doc) {
  if (!BLOB) return !(await stat(path.resolve(collection, doc.filename!)).catch(() => null));
  const res = await fetch(doc.url!, { method: "HEAD" }).catch(() => null);
  return res?.status === 404;
}

async function fonte(doc: Doc): Promise<{ data: Buffer; mimetype: string } | null> {
  const origem = doc.origem ?? "";
  if (origem.startsWith("complementos/")) {
    const data = await readFile(path.join(COMPLEMENTOS_DIR, origem.slice("complementos/".length))).catch(() => null);
    const tipos: Record<string, string> = { ".pdf": "application/pdf", ".webp": "image/webp", ".png": "image/png" };
    return data ? { data, mimetype: tipos[path.extname(origem)] ?? "image/jpeg" } : null;
  }
  if (!/^https?:\/\//.test(origem)) return null;
  const res = await fetch(origem, { signal: AbortSignal.timeout(60_000) }).catch(() => null);
  if (!res?.ok) return null;
  const mimetype = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  return { data: Buffer.from(await res.arrayBuffer()), mimetype };
}

let verificados = 0;
let reenviados = 0;
const falhas: string[] = [];

for (const collection of COLLECTIONS) {
  const { docs } = await payload.find({ collection, pagination: false, depth: 0 });
  const comUrl = (docs as Doc[]).filter((d) => d.filename && (!BLOB || /^https?:\/\//.test(d.url ?? "")));
  verificados += comUrl.length;

  // HEAD checks in small parallel batches; uploads one at a time.
  const ausentes: Doc[] = [];
  for (let i = 0; i < comUrl.length; i += 16) {
    const lote = comUrl.slice(i, i + 16);
    const res = await Promise.all(lote.map((d) => faltando(collection, d)));
    lote.forEach((d, j) => res[j] && ausentes.push(d));
  }

  for (const doc of ausentes) {
    const file = await fonte(doc);
    if (!file) {
      falhas.push(`${collection} #${doc.id} ${doc.filename} (origem: ${doc.origem ?? "nenhuma"})`);
      continue;
    }
    await payload.update({
      collection,
      id: doc.id,
      data: {},
      file: { data: file.data, mimetype: file.mimetype, name: doc.filename!, size: file.data.length },
      // A fresh object per call: the storage plugin keeps the pending upload in req.context.
      context: { disableRevalidate: true },
      depth: 0,
      overwriteExistingFiles: true,
    });
    reenviados++;
  }
}

console.log(`blob: ${verificados} arquivos verificados, ${reenviados} reenviados, ${falhas.length} sem fonte`);
for (const f of falhas) console.log(`  sem fonte: ${f}`);
process.exit(0);
