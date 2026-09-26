import type { SerializedUploadNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { type JSXConvertersFunction, RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import type { Midia } from "@/payload-types";
import { mediaSrc } from "@/lib/cms/media";

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
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => <UploadImage node={node as SerializedUploadNode} />,
});

/** Renders Lexical content with the site's editorial typography. */
export function RichText({ data, className = "" }: Props) {
  if (!data) return null;
  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={`rich-text max-w-[68ch] text-lead leading-relaxed text-tinta/90 ${className}`}
    />
  );
}
