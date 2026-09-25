import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a bare id or any common YouTube URL and stores the 11-char id. */
export function extractYoutubeId(input: string): string | null {
  const value = input.trim();
  if (YOUTUBE_ID.test(value)) return value;
  const match = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export const Videos: CollectionConfig = {
  slug: "videos",
  labels: { singular: "Vídeo", plural: "Vídeos" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "publicadoEm", "destaque"],
    description: "Os vídeos do canal também são lidos automaticamente; cadastre aqui os que quer destacar ou legendar.",
  },
  defaultSort: "-publicadoEm",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "titulo", type: "text", required: true },
    {
      name: "youtube",
      label: "Link ou ID do YouTube",
      type: "text",
      required: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? (extractYoutubeId(value) ?? value) : value)],
      },
      validate: (value: string | null | undefined) =>
        (typeof value === "string" && YOUTUBE_ID.test(value)) || "Cole um link válido do YouTube.",
    },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "publicadoEm", label: "Data", type: "date", admin: { position: "sidebar" } },
    { name: "destaque", type: "checkbox", admin: { position: "sidebar" } },
  ],
};
