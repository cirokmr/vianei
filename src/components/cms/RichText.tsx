import type { SerializedLinkNode, SerializedParagraphNode, SerializedUploadNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { type JSXConvertersFunction, RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import type { Midia } from "@/payload-types";
import { mediaSrc } from "@/lib/cms/media";
import { youtubeId } from "@/lib/youtube";
import { type Miniatura, Miniaturas } from "./Miniaturas";
import { YouTubeEmbed } from "./YouTubeEmbed";

type Props = {
  data: SerializedEditorState | null | undefined;
  className?: string;
};

function UploadImage({ node }: { node: SerializedUploadNode }) {
  if (node.relationTo !== "midia" || typeof node.value !== "object") return null;
  const media = node.value as Midia;
  const src = mediaSrc(media, "destaque");
  if (!src) return null;

  return (
    <figure className="my-10">
      <Image
        src={src.url}
        width={src.width}
        height={src.height}
        alt={media.alt}
        sizes="(min-width: 900px) 68ch, calc(100vw - 2 * var(--gutter))"
        className="h-auto w-full"
      />
      {media.legenda || media.credito ? (
        <figcaption className="mt-2 text-sm text-tinta/70">
          {media.legenda}
          {media.credito ? <span className="ml-2 tracking-[0.12em] uppercase">{media.credito}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Uploads render through next/image (responsive AVIF/WebP), not a raw <img>
// of the 2560px original.
/**
 * A paragraph holding nothing but a bare YouTube link is how WordPress (and
 * editors) embed a video: render it as a lightweight player facade.
 */
function bareYouTube(node: SerializedParagraphNode): string | null {
  if (node.children.length !== 1 || node.children[0]?.type !== "link") return null;
  const link = node.children[0] as SerializedLinkNode;
  const id = youtubeId(link.fields.url);
  const text = link.children
    .map((c) => ("text" in c ? String(c.text) : ""))
    .join("")
    .trim();
  if (!id || !/^https?:\/\/\S+$/.test(text)) return null;
  return id;
}

// Structure the text itself suggests ------------------------------------------------
type Node = { type: string; children?: Node[]; text?: string; [key: string]: unknown };
type Evento = { dia: string; mes: string; hora?: string; lugar: string; detalhe?: string };

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const textOf = (n: Node): string => n.text ?? (n.children ?? []).map(textOf).join("");
const vazio = (n: Node) => n.type === "paragraph" && !textOf(n).trim();

/** "11/08, às 14h – PA Butiá Verde, Fraiburgo, na sede" → an agenda entry. */
function evento(n: Node): Evento | null {
  if (n.type !== "paragraph") return null;
  const m = textOf(n)
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?,?\s*(?:(?:às|a partir das)\s*([\dh:]+))?\s*[–—-]\s*(.+)$/);
  const mes = m ? MESES[Number(m[2]) - 1] : undefined;
  if (!m || !mes) return null;
  const [lugar, ...resto] = m[4].split(/,\s*/);
  return { dia: m[1].padStart(2, "0"), mes, hora: m[3], lugar, detalhe: resto.join(", ") || undefined };
}

function miniatura(n: Node): Miniatura | null {
  const media = n.value as Midia;
  const thumb = mediaSrc(media, "cartao");
  const full = mediaSrc(media, "destaque");
  return thumb && full ? { id: media.id, alt: media.alt, legenda: media.legenda, thumb, full } : null;
}

/**
 * Imported posts often carry a schedule as loose "dd/mm – place" paragraphs and
 * a pile of images (e.g. one invitation per date). Three or more in a row
 * become an agenda, or a grid of thumbnails, instead of a long column.
 */
function agrupar(children: Node[]): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < children.length;) {
    const eventos: Evento[] = [];
    let j = i;
    for (let e: Evento | null; j < children.length && (e = evento(children[j])); j++) eventos.push(e);
    if (eventos.length >= 3) {
      out.push({ type: "agenda", eventos });
      i = j;
      continue;
    }
    const imagens: Miniatura[] = [];
    let fim = i;
    for (j = i; j < children.length; j++) {
      const n = children[j];
      if (n.type === "upload" && n.relationTo === "midia" && typeof n.value === "object") {
        const m = miniatura(n);
        if (!m) break;
        imagens.push(m);
        fim = j + 1;
      } else if (!vazio(n)) break;
    }
    if (imagens.length >= 3) {
      out.push({ type: "miniaturas", imagens });
      i = fim;
      continue;
    }
    out.push(children[i]);
    i++;
  }
  return out;
}

function Agenda({ eventos }: { eventos: Evento[] }) {
  return (
    <ol className="!my-12 !list-none divide-y divide-tinta/15 border-y border-tinta/15 !pl-0">
      {eventos.map((e) => (
        <li key={`${e.dia}${e.mes}${e.lugar}`} className="!mt-0 grid grid-cols-[4.5rem_1fr] items-center gap-5 py-5">
          <p className="text-center leading-none text-mata">
            <span className="block font-display text-[2.6rem] tracking-[-0.03em]">{e.dia}</span>
            <span className="mt-1 block text-eyebrow tracking-[0.18em] text-musgo uppercase">{e.mes}</span>
          </p>
          <div className="!mt-0 leading-snug">
            <p className="font-display text-[1.3rem] text-mata">{e.lugar}</p>
            <p className="mt-1 text-[0.95rem] text-tinta/70">
              {e.hora ? <span className="mr-3 font-semibold text-pinhao">{e.hora}</span> : null}
              {e.detalhe}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  agenda: ({ node }) => <Agenda eventos={(node as unknown as { eventos: Evento[] }).eventos} />,
  miniaturas: ({ node }) => <Miniaturas imagens={(node as unknown as { imagens: Miniatura[] }).imagens} />,
  upload: ({ node }) => <UploadImage node={node as SerializedUploadNode} />,
  paragraph: (args) => {
    const video = bareYouTube(args.node as SerializedParagraphNode);
    if (video) return <YouTubeEmbed id={video} className="my-10" />;
    const paragraph = defaultConverters.paragraph;
    return typeof paragraph === "function" ? paragraph(args) : null;
  },
});

/** Renders Lexical content with the site's editorial typography. */
export function RichText({ data, className = "" }: Props) {
  if (!data) return null;
  const root = data.root as unknown as Node;
  const structured = {
    ...data,
    root: { ...data.root, children: agrupar(root.children ?? []) },
  } as SerializedEditorState;
  return (
    <LexicalRichText
      data={structured}
      converters={converters}
      className={`rich-text max-w-[66ch] text-tinta/90 ${className}`}
    />
  );
}
