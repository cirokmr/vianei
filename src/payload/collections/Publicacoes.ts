import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { slugField } from "../fields/slug";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const Publicacoes: CollectionConfig = {
  slug: "publicacoes",
  labels: { singular: "Publicação", plural: "Publicações" },
  admin: { group: "Conteúdo", useAsTitle: "titulo", defaultColumns: ["titulo", "ano", "_status"] },
  defaultSort: "-ano",
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true, maxPerDoc: 10 },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "titulo", type: "text", required: true },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "autoria", type: "text", admin: { description: "Autores ou instituição." } },
    { name: "capa", type: "upload", relationTo: "midia" },
    {
      type: "row",
      fields: [
        { name: "arquivo", label: "PDF", type: "upload", relationTo: "documentos" },
        {
          name: "linkExterno",
          label: "…ou link externo",
          type: "text",
          admin: { description: "Use quando o arquivo está hospedado em outro site." },
        },
      ],
    },
    slugField(),
    { name: "ano", type: "number", min: 1983, max: 2100, admin: { position: "sidebar" } },
  ],
};
