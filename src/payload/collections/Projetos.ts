import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { seoField } from "../fields/seo";
import { slugField } from "../fields/slug";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";
import { previewUrl } from "../preview";

export const AREAS = [
  { label: "Educação popular", value: "educacao-popular" },
  { label: "Agroecologia", value: "agroecologia" },
  { label: "Restauração florestal", value: "restauracao-florestal" },
  { label: "Cultura e SAT Pinhão", value: "cultura-sat-pinhao" },
] as const;

export const Projetos: CollectionConfig = {
  slug: "projetos",
  labels: { singular: "Projeto", plural: "Projetos" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "situacao", "areas", "_status"],
    livePreview: { url: ({ data }) => previewUrl("projetos", data?.slug) },
    preview: (data) => previewUrl("projetos", data?.slug as string | undefined),
  },
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
    { name: "resumo", type: "textarea", maxLength: 320 },
    { name: "capa", type: "upload", relationTo: "midia" },
    { name: "conteudo", label: "Conteúdo", type: "richText" },
    {
      name: "galeria",
      type: "array",
      labels: { singular: "Foto", plural: "Fotos" },
      fields: [{ name: "imagem", type: "upload", relationTo: "midia", required: true }],
    },
    slugField(),
    {
      name: "situacao",
      label: "Situação",
      type: "select",
      required: true,
      defaultValue: "ativo",
      options: [
        { label: "Em andamento", value: "ativo" },
        { label: "Concluído", value: "concluido" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "areas",
      label: "Áreas de atuação",
      type: "select",
      hasMany: true,
      options: [...AREAS],
      admin: { position: "sidebar" },
    },
    {
      type: "row",
      fields: [
        { name: "inicio", label: "Início", type: "date", admin: { date: { pickerAppearance: "monthOnly" } } },
        { name: "fim", label: "Término", type: "date", admin: { date: { pickerAppearance: "monthOnly" } } },
      ],
    },
    {
      name: "financiadores",
      label: "Financiadores e parceiros",
      type: "relationship",
      relationTo: "parceiros",
      hasMany: true,
    },
    { name: "destaque", label: "Destacar na home", type: "checkbox", admin: { position: "sidebar" } },
    seoField,
  ],
};
