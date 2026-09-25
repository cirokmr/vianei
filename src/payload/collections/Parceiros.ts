import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const Parceiros: CollectionConfig = {
  slug: "parceiros",
  labels: { singular: "Parceiro", plural: "Parceiros e apoiadores" },
  admin: { group: "Institucional", useAsTitle: "nome", defaultColumns: ["nome", "tipo", "ordem"] },
  defaultSort: "ordem",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "nome", type: "text", required: true },
    { name: "descricao", label: "Descrição curta", type: "text" },
    {
      name: "tipo",
      type: "select",
      required: true,
      defaultValue: "parceiro",
      options: [
        { label: "Apoiador (financiador)", value: "apoiador" },
        { label: "Parceiro", value: "parceiro" },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "midia",
      admin: { description: "De preferência SVG ou PNG com fundo transparente." },
    },
    { name: "site", type: "text" },
    { name: "ordem", type: "number", defaultValue: 100, admin: { position: "sidebar" } },
  ],
};
