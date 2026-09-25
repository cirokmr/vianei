import type { GlobalConfig } from "payload";
import { adminsField, anyone, authenticated } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

export const Site: GlobalConfig = {
  slug: "site",
  label: "Dados institucionais",
  admin: { group: "Institucional" },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "nome", type: "text", required: true, defaultValue: "Centro Vianei de Educação Popular" },
    {
      name: "razaoSocial",
      label: "Razão social",
      type: "text",
      defaultValue: "AVICITECS – Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde",
    },
    {
      name: "cnpj",
      type: "text",
      defaultValue: "78.492.261/0001-63",
      access: { update: adminsField },
    },
    { name: "email", type: "email", required: true, defaultValue: "contato@vianei.org.br" },
    { name: "telefone", type: "text" },
    {
      name: "endereco",
      label: "Endereço",
      type: "group",
      fields: [
        { name: "logradouro", type: "text", defaultValue: "Av. Papa João XXIII, 1565 – Área Industrial" },
        {
          type: "row",
          fields: [
            { name: "cidade", type: "text", defaultValue: "Lages" },
            { name: "uf", label: "UF", type: "text", defaultValue: "SC", maxLength: 2 },
            { name: "cep", label: "CEP", type: "text", defaultValue: "88514-720" },
          ],
        },
      ],
    },
    {
      name: "redes",
      label: "Redes sociais",
      type: "group",
      fields: [
        { name: "instagram", type: "text", defaultValue: "https://www.instagram.com/centrovianei/" },
        { name: "facebook", type: "text", defaultValue: "https://www.facebook.com/centrovianei" },
        { name: "youtube", type: "text", defaultValue: "https://www.youtube.com/channel/UCkEIv_GvLhWyFuYBl_y5i8w" },
        {
          name: "youtubeChannelId",
          label: "ID do canal do YouTube",
          type: "text",
          defaultValue: "UCkEIv_GvLhWyFuYBl_y5i8w",
          admin: { description: "Usado para listar os vídeos automaticamente (sem chave de API)." },
        },
      ],
    },
    {
      name: "estatuto",
      label: "Estatuto (PDF)",
      type: "upload",
      relationTo: "documentos",
    },
    {
      name: "mandatoDiretoria",
      label: "Mandato da diretoria",
      type: "text",
      admin: { description: "Ex.: 08/02/2026 a 07/02/2029" },
    },
  ],
};
