import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const Pessoas: CollectionConfig = {
  slug: "pessoas",
  labels: { singular: "Pessoa", plural: "Diretoria e equipe" },
  admin: { group: "Institucional", useAsTitle: "nome", defaultColumns: ["nome", "grupo", "cargo", "ordem"] },
  defaultSort: "ordem",
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [
    { name: "nome", type: "text", required: true },
    {
      name: "grupo",
      type: "select",
      required: true,
      options: [
        { label: "Diretoria", value: "diretoria" },
        { label: "Conselho fiscal", value: "conselho-fiscal" },
        { label: "Equipe técnica", value: "equipe-tecnica" },
      ],
    },
    { name: "cargo", type: "text", admin: { description: "Ex.: Presidente, Coordenador de projetos." } },
    { name: "formacao", label: "Formação", type: "text" },
    { name: "foto", type: "upload", relationTo: "midia" },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          // The public API only exposes the address when the team opted in.
          access: { read: ({ req, doc }) => Boolean(req.user) || Boolean(doc?.emailPublico) },
        },
        {
          name: "emailPublico",
          label: "Mostrar e-mail no site",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Desmarcado por padrão para evitar spam." },
        },
      ],
    },
    { name: "ordem", type: "number", defaultValue: 100, admin: { position: "sidebar" } },
  ],
};
