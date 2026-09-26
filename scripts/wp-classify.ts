/**
 * Suggests categories and related projects for migrated news that have none,
 * and areas of work for projects without any.
 * WordPress had no taxonomy we could carry over, so this reads the title and
 * summary against a few keyword rules. It only fills EMPTY fields (an editor's
 * choice always wins), is idempotent, and writes a report to review in /admin.
 *
 *   npm run wp:classify            # apply
 *   npm run wp:classify -- --dry   # report only
 */
import { writeFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";

const DRY = process.argv.includes("--dry");

// Category slug → pattern (title + summary, case-insensitive).
const CATEGORIAS: Record<string, RegExp> = {
  "restauracao-florestal":
    /restaur|reserva legal|viveiro|mudas|mata atl[aâ]ntica|taquara|pr[oó][- ]?esp[eé]cies|pat planalto|enxertia|conserva[cç][aã]o de esp[eé]cies/i,
  "sat-pinhao": /pinh[aã]o|sat pinh|arauc[aá]ria/i,
  agroecologia:
    /agroecol|sementes? crioula|terra (?:[àa] )?mesa|ecoserra|bioconstru|saneamento ecol|abelhas|hortinha|consumidor|aliment|oleato|ervas medicinais|agrofloresta|agricultura familiar|em rede/i,
  "politicas-publicas":
    /pol[ií]ticas? p[uú]blica|pnae|plano safra|cr[eé]dito fundi[aá]rio|mercados institucionais|comit[eêé]|confer[eê]ncia|pgpm/i,
  "educacao-popular": /oficina|forma[cç][aã]o|curso|semin[aá]rio|juventude|capacita|educa[cç][aã]o|diagn[oó]stico|drp/i,
};

// Project slug → pattern.
const PROJETOS: Record<string, RegExp> = {
  "projeto-restaurar": /restaurar|final[ií]stico|127 hectares|reserva legal/i,
  "da-terra-a-mesa-mda": /terra (?:[àa] )?mesa/i,
  "programa-saberes-e-fazeres-do-pinhao": /sat pinh|saberes e fazeres|festa da colheita|semin[aá]rio territorial/i,
  "projeto-pro-especies": /pr[oó][- ]?esp[eé]cies|pat planalto/i,
  "projeto-misereor-em-rede": /em rede|misereor|webs[eé]rie|semeando sa[uú]de/i,
};

const payload = await getPayload({ config });
const ids = async (collection: "categorias" | "projetos") =>
  new Map(
    (await payload.find({ collection, pagination: false, depth: 0, select: { slug: true } })).docs.map((d) => [
      d.slug as string,
      d.id,
    ]),
  );
const categoriaIds = await ids("categorias");
const projetoIds = await ids("projetos");

const match = (rules: Record<string, RegExp>, known: Map<string, number>, text: string) =>
  Object.entries(rules)
    .filter(([slug, re]) => known.has(slug) && re.test(text))
    .map(([slug]) => slug);

const noticias = await payload.find({
  collection: "noticias",
  pagination: false,
  depth: 0,
  select: { titulo: true, resumo: true, slug: true, categorias: true, projetos: true },
});

const slugOf = (known: Map<string, number>) => {
  const inverse = new Map([...known].map(([slug, id]) => [id, slug]));
  return (list: (number | { id: number })[] | null | undefined) =>
    (list ?? []).map((item) => inverse.get(typeof item === "object" ? item.id : item)).filter(Boolean);
};
const categoriaSlug = slugOf(categoriaIds);
const projetoSlug = slugOf(projetoIds);

const rows: string[] = [];
let changed = 0;
for (const n of noticias.docs) {
  // The organisation's own name ("…de Educação Popular") is not a topic.
  const text = `${n.titulo} ${n.resumo ?? ""}`.replace(/centro vianei de educa[cç][aã]o popular/gi, "Centro Vianei");
  const cats = n.categorias?.length ? categoriaSlug(n.categorias) : match(CATEGORIAS, categoriaIds, text);
  const projs = n.projetos?.length ? projetoSlug(n.projetos) : match(PROJETOS, projetoIds, text);
  const data: { categorias?: number[]; projetos?: number[] } = {};
  if (!n.categorias?.length && cats.length) data.categorias = cats.map((s) => categoriaIds.get(s!)!);
  if (!n.projetos?.length && projs.length) data.projetos = projs.map((s) => projetoIds.get(s!)!);
  const auto = Object.keys(data).length > 0;

  rows.push(
    `| ${n.titulo.replace(/\|/g, "/")} | ${cats.join(", ") || "—"} | ${projs.join(", ") || "—"} | ${auto ? "sugestão desta execução" : cats.length || projs.length ? "já preenchido" : "sem sugestão"} |`,
  );
  if (!auto) continue;
  changed++;
  if (!DRY) {
    await payload.update({ collection: "noticias", id: n.id, data, depth: 0, context: { disableRevalidate: true } });
  }
}

// Projects: areas of work (select field), same rules as the categories.
const AREA_DA_CATEGORIA: Record<string, string> = {
  "educacao-popular": "educacao-popular",
  agroecologia: "agroecologia",
  "restauracao-florestal": "restauracao-florestal",
  "sat-pinhao": "cultura-sat-pinhao",
};
const projetos = await payload.find({
  collection: "projetos",
  pagination: false,
  depth: 0,
  select: { titulo: true, resumo: true, areas: true },
});
const projetoRows: string[] = [];
for (const p of projetos.docs) {
  const text = `${p.titulo} ${p.resumo ?? ""}`;
  const auto = !p.areas?.length;
  const areas = (
    auto
      ? Object.entries(AREA_DA_CATEGORIA)
          .filter(([categoria]) => CATEGORIAS[categoria].test(text))
          .map(([, area]) => area)
      : p.areas
  ) as NonNullable<typeof p.areas>;
  projetoRows.push(
    `| ${p.titulo.replace(/\|/g, "/")} | ${areas.join(", ") || "—"} | ${auto ? (areas.length ? "sugestão desta execução" : "sem sugestão") : "já preenchido"} |`,
  );
  if (auto && areas.length && !DRY) {
    await payload.update({
      collection: "projetos",
      id: p.id,
      data: { areas },
      depth: 0,
      context: { disableRevalidate: true },
    });
  }
}

const report = `# Classificação automática (notícias e projetos)

Gerado por \`npm run wp:classify\` em ${new Date().toISOString().slice(0, 10)}. Só campos vazios foram preenchidos.
Revise no painel (Notícias → barra lateral: Categorias e Projetos relacionados); o que a equipe mudar não é
sobrescrito numa nova execução.

${changed} de ${noticias.totalDocs} notícias receberam sugestões nesta execução. A tabela mostra o estado atual de todas.

| Notícia | Categorias | Projetos | Origem |
|---|---|---|---|
${rows.join("\n")}

## Áreas de atuação dos projetos

| Projeto | Áreas | Origem |
|---|---|---|
${projetoRows.join("\n")}
`;
writeFileSync("data/wp-export/classificacao.md", report);
console.log(
  `${DRY ? "[dry] " : ""}${changed}/${noticias.totalDocs} notícias classificadas → data/wp-export/classificacao.md`,
);

// Expire cached pages when the site is up (same contract as wp-import).
const { NEXT_PUBLIC_SERVER_URL: url, REVALIDATE_SECRET: secret } = process.env;
if (!DRY && url && secret) {
  await fetch(`${url}/api/revalidate`, { method: "POST", headers: { "x-revalidate-secret": secret } }).catch(() => {
    console.warn("cache não revalidado (site fora do ar?)");
  });
}
process.exit(0);
