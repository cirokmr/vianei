import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access";
import { slugField } from "../fields/slug";
import { revalidateCollection, revalidateCollectionDelete } from "../hooks/revalidate";

export const Categorias: CollectionConfig = {
  slug: "categorias",
  labels: { singular: "Categoria", plural: "Categorias" },
  admin: { group: "Conteúdo", useAsTitle: "titulo" },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateCollectionDelete] },
  fields: [{ name: "titulo", type: "text", required: true }, slugField()],
};
