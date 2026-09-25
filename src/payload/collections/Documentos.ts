import type { CollectionConfig } from "payload";
import { anyone, authenticated } from "../access";

export const Documentos: CollectionConfig = {
  slug: "documentos",
  labels: { singular: "Documento (PDF)", plural: "Documentos (PDF)" },
  admin: { group: "Biblioteca", useAsTitle: "titulo" },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: { mimeTypes: ["application/pdf"] },
  fields: [{ name: "titulo", type: "text", required: true }],
};
