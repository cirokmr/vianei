import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { seoField } from "../fields/seo";
import { legadoField } from "../fields/legado";
import { slugField } from "../fields/slug";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";
import { previewUrl } from "../preview";

export const Noticias: CollectionConfig = {
  slug: "noticias",
  labels: { singular: "Notícia", plural: "Notícias" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "publicadoEm", "_status"],
    livePreview: { url: ({ data }) => previewUrl("noticias", data?.slug) },
    preview: (data) => previewUrl("noticias", data?.slug as string | undefined),
  },
  defaultSort: "-publicadoEm",
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "titulo", type: "text", required: true },
    {
      name: "resumo",
      type: "textarea",
      maxLength: 280,
      admin: { description: "Uma ou duas frases. Aparece nas listas e no Google." },
    },
    { name: "capa", type: "upload", relationTo: "midia" },
    { name: "conteudo", label: "Conteúdo", type: "richText", required: true },
    slugField(),
    {
      name: "publicadoEm",
      label: "Data de publicação",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      index: true,
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime", displayFormat: "dd/MM/yyyy HH:mm" } },
    },
    {
      name: "categorias",
      type: "relationship",
      relationTo: "categorias",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    {
      name: "projetos",
      label: "Projetos relacionados",
      type: "relationship",
      relationTo: "projetos",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    seoField,
    legadoField,
  ],
};
