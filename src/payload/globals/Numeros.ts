import type { GlobalConfig } from "payload";
import { anyone, authenticated } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const Numeros: GlobalConfig = {
  slug: "numeros",
  label: "Números da home",
  admin: {
    group: "Institucional",
    description: "Contadores animados da home. Use apenas números confirmados.",
  },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "itens",
      type: "array",
      maxRows: 6,
      labels: { singular: "Número", plural: "Números" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "valor", type: "number", required: true },
            { name: "prefixo", type: "text", admin: { description: "Ex.: +" } },
            { name: "sufixo", type: "text", admin: { description: "Ex.: ha, anos" } },
          ],
        },
        { name: "rotulo", label: "Rótulo", type: "text", required: true },
        { name: "fonte", type: "text", admin: { description: "De onde vem o número (uso interno)." } },
      ],
    },
  ],
};
