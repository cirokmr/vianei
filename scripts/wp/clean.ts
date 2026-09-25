import { JSDOM, VirtualConsole } from "jsdom";

/** jsdom without console noise (Elementor CSS it can't parse, etc.). */
export function parse(html: string, url?: string) {
  return new JSDOM(html, { url, virtualConsole: new VirtualConsole() });
}

function absoluteUrl(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" ? url.href : null;
  } catch {
    return null;
  }
}

const KEEP = new Set([
  "P",
  "H2",
  "H3",
  "H4",
  "STRONG",
  "EM",
  "U",
  "A",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "BR",
  "IMG",
  "FIGURE",
  "FIGCAPTION",
]);
const RENAME: Record<string, string> = { B: "STRONG", I: "EM", H1: "H2", H5: "H4", H6: "H4" };
const UNWRAP = new Set([
  "DIV",
  "SPAN",
  "SECTION",
  "ARTICLE",
  "FONT",
  "CENTER",
  "MAIN",
  "HEADER",
  "FOOTER",
  "SMALL",
  "SUP",
  "SUB",
  "MARK",
  "PICTURE",
  "SOURCE",
  "TABLE",
  "TBODY",
  "THEAD",
  "TR",
  "TD",
  "TH",
]);
const DROP = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "FORM",
  "INPUT",
  "BUTTON",
  "NAV",
  "IFRAME",
  "VIDEO",
  "AUDIO",
  "OBJECT",
  "EMBED",
  "LINK",
  "META",
]);

export function youtubeIdFromUrl(url: string): string | null {
  const m = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}

/** The original upload behind a WordPress resized copy (name-1024x768.jpg → name.jpg). */
export function originalImageUrl(src: string): string {
  return src.replace(/-\d{2,5}x\d{2,5}(?=\.(?:jpe?g|png|webp|gif)$)/i, "");
}

function imageSrc(img: Element): string | null {
  const src = img.getAttribute("data-src") || img.getAttribute("src");
  return !src || src.startsWith("data:") ? null : src;
}

/**
 * Turns Elementor/WordPress markup into small, semantic HTML the Lexical
 * converter handles well. YouTube iframes become `[[youtube:ID]]` paragraphs
 * and images become `[[image:N]]` paragraphs (N indexes `images`), which the
 * importer swaps for real nodes after upload.
 */
export function cleanHtml(fragment: string, baseUrl: string) {
  const dom = parse(`<body>${fragment}</body>`, baseUrl);
  const { document } = dom.window;
  const images: { url: string; fallbackUrl: string; alt: string; caption: string }[] = [];
  const youtube: string[] = [];

  // Media first, while attributes are intact.
  for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
    const id = youtubeIdFromUrl(iframe.getAttribute("src") ?? iframe.getAttribute("data-src") ?? "");
    if (id) {
      youtube.push(id);
      const p = document.createElement("p");
      p.textContent = `[[youtube:${id}]]`;
      (iframe.closest("figure") ?? iframe).replaceWith(p);
    }
  }
  for (const img of Array.from(document.querySelectorAll("img"))) {
    const src = imageSrc(img);
    if (!src || /emoji|gravatar|placeholder/i.test(src)) {
      img.remove();
      continue;
    }
    const figure = img.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim() ?? "";
    const absolute = absoluteUrl(src, baseUrl);
    if (!absolute) {
      img.remove();
      continue;
    }
    images.push({
      url: originalImageUrl(absolute),
      fallbackUrl: absolute,
      alt: img.getAttribute("alt")?.trim() ?? "",
      caption,
    });
    const p = document.createElement("p");
    p.textContent = `[[image:${images.length - 1}]]`;
    (figure ?? img).replaceWith(p);
  }

  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      walk(child);
      const tag = child.tagName;
      if (DROP.has(tag)) {
        child.remove();
      } else if (RENAME[tag]) {
        const renamed = document.createElement(RENAME[tag]);
        renamed.append(...Array.from(child.childNodes));
        child.replaceWith(renamed);
      } else if (UNWRAP.has(tag) || !KEEP.has(tag)) {
        child.replaceWith(...Array.from(child.childNodes));
      }
    }
  };
  walk(document.body);

  for (const el of Array.from(document.body.querySelectorAll("*"))) {
    for (const attr of Array.from(el.attributes)) {
      if (el.tagName === "A" && attr.name === "href") continue;
      el.removeAttribute(attr.name);
    }
    if (el.tagName === "A") {
      // Broken links (e.g. `http://“Title”`) keep their text, lose the link.
      const href = absoluteUrl(el.getAttribute("href") ?? "", baseUrl);
      if (!href || href.startsWith(`${baseUrl}#`)) el.replaceWith(...Array.from(el.childNodes));
      else el.setAttribute("href", href);
    }
  }

  // Loose text directly under body becomes paragraphs; empty blocks go away.
  for (const node of Array.from(document.body.childNodes)) {
    if (node.nodeType === 3 && node.textContent?.trim()) {
      const p = document.createElement("p");
      p.textContent = node.textContent.trim();
      node.replaceWith(p);
    } else if (node.nodeType === 3) {
      node.remove();
    }
  }
  for (const el of Array.from(document.body.querySelectorAll("p, h2, h3, h4, li, blockquote, strong, em"))) {
    if (!el.textContent?.replace(/ /g, " ").trim() && !el.querySelector("br, img")) el.remove();
  }

  const html = document.body.innerHTML
    .replace(/ /g, " ")
    .replace(/(<br>\s*){3,}/g, "<br><br>")
    .trim();
  return { html, images, youtube };
}

export function textOf(html: string): string {
  return parse(`<body>${html}</body>`).window.document.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export function decodeEntities(value: string): string {
  return parse(`<body>${value}</body>`).window.document.body.textContent?.trim() ?? value;
}

/**
 * Shifts heading levels so the body starts at h2 (the page title is the h1).
 * WordPress posts often used h3/h4 as section titles, which skips levels.
 */
export function normalizeHeadings(html: string): string {
  const levels = [...html.matchAll(/<h([2-4])>/g)].map((m) => Number(m[1]));
  if (!levels.length) return html;
  const shift = Math.min(...levels) - 2;
  if (shift <= 0) return html;
  return html.replace(/<(\/?)h([2-4])>/g, (_, slash: string, level: string) => `<${slash}h${Number(level) - shift}>`);
}
