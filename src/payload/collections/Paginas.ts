import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { legadoField } from "../fields/legado";
import { seoField } from "../fields/seo";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

const CAMINHO = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

/**
 * Free-form pages at a nested path, e.g. the Projeto Restaurar microsite
 * (`projetos/projeto-restaurar/galeria-de-especies/araucaria`).
 */
export const Paginas: CollectionConfig = {
  slug: "paginas",
  labels: { singular: "Página", plural: "Páginas" },
  admin: {
    group: "Conteúdo",
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "caminho", "_status"],
    description: "Páginas avulsas, como as do mini-site do Projeto Restaurar.",
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 20 },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "titulo", type: "text", required: true },
    { name: "conteudo", label: "Conteúdo", type: "richText" },
    {
      name: "caminho",
      label: "Endereço",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Sem barra inicial. Ex.: projetos/projeto-restaurar/galeria-de-especies",
      },
      validate: (value: string | null | undefined) =>
        (typeof value === "string" && CAMINHO.test(value)) || "Use letras minúsculas, números, hífens e barras.",
    },
    {
      name: "projeto",
      label: "Projeto relacionado",
      type: "relationship",
      relationTo: "projetos",
      admin: { position: "sidebar" },
    },
    legadoField,
    seoField,
  ],
};
