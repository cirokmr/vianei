import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const Timeline: GlobalConfig = {
  slug: "timeline",
  label: "Linha do tempo",
  admin: { group: "Institucional", description: "Marcos de 1983 até hoje, exibidos na home e em Quem somos." },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "marcos",
      type: "array",
      labels: { singular: "Marco", plural: "Marcos" },
      admin: { initCollapsed: true },
      fields: [
        {
          type: "row",
          fields: [
            { name: "ano", type: "number", required: true, min: 1900, max: 2100 },
            { name: "titulo", label: "Título", type: "text", required: true },
          ],
        },
        { name: "texto", type: "textarea", maxLength: 280 },
        { name: "imagem", type: "upload", relationTo: "midia" },
      ],
    },
  ],
};
