/**
 * Snapshots the current WordPress site into data/wp-export/snapshot.json.
 *
 *   npm run wp:export
 *
 * Why HTML scraping: the custom post types (noticias, projetos, publicacoes)
 * were built with JetEngine without the editor, so the REST API exposes only
 * title/date/featured image. The body lives in Elementor widgets on the
 * rendered page. Publications' PDF links only exist on the home page.
 *
 * The snapshot is committed: the import is reproducible and reviewable even
 * after the old site is switched off.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cleanHtml, decodeEntities, originalImageUrl, parse, textOf } from "./wp/clean";
import { get, getJson, mapLimit } from "./wp/http";
import type { WpEntry, WpImage, WpSnapshot } from "./wp/types";

const SOURCE = process.env.WP_URL ?? "https://vianei.org.br";
const OUT = path.resolve("data/wp-export/snapshot.json");
const warnings: string[] = [];

type RestItem = {
  id: number;
  slug: string;
  link: string;
  date_gmt: string;
  modified_gmt: string;
  parent?: number;
  title: { rendered: string };
  content?: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string;
      alt_text?: string;
      caption?: { rendered: string };
      media_details?: { width?: number; height?: number; filesize?: number };
    }[];
    "wp:term"?: { name: string }[][];
  };
};

async function listAll(type: string): Promise<RestItem[]> {
  const items: RestItem[] = [];
  for (let page = 1; ; page++) {
    const { data, headers } = await getJson<RestItem[]>(
      `${SOURCE}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_embed=1&orderby=date&order=desc`,
    );
    items.push(...data);
    if (page >= Number(headers.get("x-wp-totalpages") ?? 1)) break;
  }
  return items;
}

function featured(item: RestItem): WpImage | null {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return null;
  return {
    url: media.source_url,
    alt: media.alt_text?.trim() ?? "",
    caption: media.caption ? textOf(media.caption.rendered) : "",
    width: media.media_details?.width,
    height: media.media_details?.height,
    bytes: media.media_details?.filesize,
  };
}

const utc = (gmt: string) => (gmt.endsWith("Z") ? gmt : `${gmt}Z`);
const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/**
 * Finds the post body on a JetEngine/Elementor single template: the title
 * heading, an optional h4 subtitle right after it, and the largest rich
 * heading/text widget after that.
 */
function extractFromPage(html: string, title: string, url: string) {
  const { document } = parse(html, url).window;
  const widgets = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".elementor-widget-heading .elementor-widget-container, .elementor-widget-text-editor .elementor-widget-container",
    ),
  ).filter((el) => !el.closest("footer, header, nav, .elementor-location-footer, .elementor-location-header"));

  const titleIndex = widgets.findIndex((el) => normalize(el.textContent ?? "") === normalize(title));
  const after = titleIndex >= 0 ? widgets.slice(titleIndex + 1) : widgets;

  let subtitle = "";
  const first = after[0];
  if (first?.querySelector("h4") && (first.textContent ?? "").trim().length < 400) {
    subtitle = first.textContent!.replace(/\s+/g, " ").trim();
  }

  const candidates = after.filter((el) => !/©\s*Centro Vianei/.test(el.textContent ?? ""));
  const body = candidates.reduce<HTMLElement | null>(
    (best, el) => ((el.textContent?.length ?? 0) > (best?.textContent?.length ?? 0) ? el : best),
    null,
  );
  if (!body) warnings.push(`sem corpo encontrado: ${url}`);

  return { subtitle, bodyFragment: body?.innerHTML ?? "" };
}

async function exportSingle(item: RestItem, type: "noticias" | "projetos" | "publicacoes"): Promise<WpEntry> {
  const title = decodeEntities(item.title.rendered);
  const page = await (await get(item.link)).text();
  const { subtitle, bodyFragment } = extractFromPage(page, title, item.link);
  const { html, images } = cleanHtml(bodyFragment, item.link);

  return {
    wpId: item.id,
    type,
    slug: item.slug,
    url: item.link,
    title,
    subtitle: subtitle && normalize(subtitle) !== normalize(title) ? subtitle : "",
    publishedAt: utc(item.date_gmt),
    modifiedAt: utc(item.modified_gmt),
    bodyHtml: html,
    featured: featured(item),
    inlineImages: images,
    terms: item._embedded?.["wp:term"]?.flat().map((t) => t.name) ?? [],
  };
}

/** Publication title → PDF/cover links, taken from the home page listing. */
async function publicationLinks(): Promise<Map<string, { pdf?: string; cover?: string }>> {
  const html = await (await get(`${SOURCE}/`)).text();
  const { document } = parse(html, SOURCE).window;
  const map = new Map<string, { pdf?: string; cover?: string }>();

  for (const button of Array.from(document.querySelectorAll<HTMLAnchorElement>("a"))) {
    if (!/baixar agora/i.test(button.textContent ?? "")) continue;
    // Walk up to the listing item that holds both the title and the button.
    let item: Element | null = button;
    while (item && !item.querySelector("p")) item = item.parentElement;
    const titleEl = item?.querySelector("p");
    if (!titleEl) continue;
    const cover = item?.querySelector("img")?.getAttribute("src") ?? undefined;
    map.set(normalize(titleEl.textContent ?? ""), {
      pdf: button.href,
      cover: cover ? originalImageUrl(cover) : undefined,
    });
  }
  return map;
}

/** WordPress pages worth keeping: the Projeto Restaurar microsite under /projetos1/. */
async function exportPages(): Promise<WpEntry[]> {
  const pages = await listAll("pages");
  const byId = new Map(pages.map((p) => [p.id, p]));
  const microsite = pages.filter((p) => new URL(p.link).pathname.startsWith("/projetos1/"));

  return microsite.map((item) => {
    const url = new URL(item.link);
    const { html, images } = cleanHtml(item.content?.rendered ?? "", item.link);
    return {
      wpId: item.id,
      type: "paginas" as const,
      slug: item.slug,
      url: item.link,
      title: decodeEntities(item.title.rendered),
      subtitle: "",
      publishedAt: utc(item.date_gmt),
      modifiedAt: utc(item.modified_gmt),
      bodyHtml: html,
      featured: null,
      inlineImages: images,
      terms: [],
      parentWpId: item.parent && byId.has(item.parent) ? item.parent : undefined,
      path: url.pathname.replace(/^\/|\/$/g, ""),
    };
  });
}

async function main() {
  console.log(`exportando ${SOURCE}…`);
  const entries: WpEntry[] = [];

  for (const type of ["noticias", "projetos"] as const) {
    const items = await listAll(type);
    const exported = await mapLimit(items, 3, (item) => exportSingle(item, type));
    entries.push(...exported);
    console.log(`  ${type}: ${exported.length}`);
  }

  const links = await publicationLinks();
  const pubs = await listAll("publicacoes");
  for (const item of pubs) {
    const title = decodeEntities(item.title.rendered);
    const link = links.get(normalize(title));
    if (!link?.pdf) warnings.push(`publicação sem PDF na home: "${title}"`);
    entries.push({
      wpId: item.id,
      type: "publicacoes",
      slug: item.slug,
      url: item.link,
      title,
      subtitle: "",
      publishedAt: utc(item.date_gmt),
      modifiedAt: utc(item.modified_gmt),
      bodyHtml: "",
      featured: featured(item) ?? (link?.cover ? { url: link.cover, alt: "", caption: "" } : null),
      inlineImages: [],
      terms: [],
      pdfUrl: link?.pdf,
    });
  }
  console.log(`  publicacoes: ${pubs.length}`);

  const pages = await exportPages();
  entries.push(...pages);
  console.log(`  paginas (mini-site Restaurar): ${pages.length}`);

  const snapshot: WpSnapshot = { exportedAt: new Date().toISOString(), source: SOURCE, entries, warnings };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`snapshot: ${OUT} (${entries.length} itens, ${warnings.length} avisos)`);
  for (const w of warnings) console.log(`  ! ${w}`);
}

await main();
