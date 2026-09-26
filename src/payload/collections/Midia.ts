import type { CollectionConfig, FieldHook } from "payload";
import { anyone, authenticated } from "../access";
import { origemField } from "../fields/legado";

/** Editing the alt text in the admin marks it as reviewed. */
const clearProvisional: FieldHook = ({ value, data, originalDoc, req }) => {
  if (req.user && originalDoc && data?.alt !== undefined && data.alt !== originalDoc.alt) return false;
  return value;
};

export const Midia: CollectionConfig = {
  slug: "midia",
  labels: { singular: "Imagem", plural: "Imagens" },
  admin: {
    group: "Biblioteca",
    description: "Fotos em alta, até 15 MB. O site gera versões leves (AVIF/WebP) automaticamente.",
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    // Originals are capped at 2560px and re-encoded, so a 12 MB phone photo
    // never reaches the CDN as-is.
    resizeOptions: { width: 2560, height: 2560, fit: "inside", withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 82 } },
    imageSizes: [
      { name: "miniatura", width: 480, formatOptions: { format: "webp", options: { quality: 78 } } },
      { name: "cartao", width: 960, formatOptions: { format: "webp", options: { quality: 78 } } },
      { name: "destaque", width: 1920, formatOptions: { format: "webp", options: { quality: 80 } } },
      {
        name: "og",
        width: 1200,
        height: 630,
        position: "centre",
        formatOptions: { format: "jpeg", options: { quality: 80 } },
      },
    ],
    adminThumbnail: "miniatura",
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      required: true,
      admin: {
        description: "Descreva a imagem para quem não pode vê-la. Ex.: “Agricultora colhendo pinhão em Painel”.",
      },
    },
    {
      name: "altProvisorio",
      label: "Texto alternativo provisório (revisar)",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description: "Marcado pela migração quando a imagem veio sem descrição. Some ao editar o texto.",
      },
      hooks: { beforeChange: [clearProvisional] },
    },
    { name: "legenda", type: "text" },
    { name: "credito", label: "Crédito da foto", type: "text" },
    origemField,
  ],
};
