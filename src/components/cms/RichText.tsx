import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type Props = {
  data: SerializedEditorState | null | undefined;
  className?: string;
};

/** Renders Lexical content with the site's editorial typography. */
export function RichText({ data, className = "" }: Props) {
  if (!data) return null;
  return (
    <LexicalRichText
      data={data}
      className={`rich-text max-w-[68ch] text-lead leading-relaxed text-tinta/90 ${className}`}
    />
  );
}
