import type { GroupField } from "payload";

export const seoField: GroupField = {
  name: "seo",
  type: "group",
  label: "SEO e compartilhamento",
  admin: { description: "Opcional. Se vazio, usamos o título, o resumo e a capa." },
  fields: [
    { name: "titulo", type: "text", label: "Título para o Google", maxLength: 70 },
    { name: "descricao", type: "textarea", label: "Descrição para o Google", maxLength: 160 },
    { name: "imagem", type: "upload", relationTo: "midia", label: "Imagem de compartilhamento" },
  ],
};
