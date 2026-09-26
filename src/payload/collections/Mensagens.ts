import type { CollectionAfterChangeHook, CollectionConfig } from "payload";
import { authenticated } from "../access";

type Mensagem = { id: number; nome: string; email: string; assunto?: string | null; mensagem: string };

/**
 * Notifies the team by e-mail. Without an SMTP transport configured
 * (see payload.config.ts) Payload only logs it; the message is kept here
 * either way, so nothing is lost.
 */
const notificar: CollectionAfterChangeHook<Mensagem> = async ({ doc, operation, req, context }) => {
  if (operation !== "create" || context.disableEmail) return doc;
  try {
    const site = await req.payload.findGlobal({ slug: "site", depth: 0 });
    await req.payload.sendEmail({
      to: site.email,
      replyTo: doc.email,
      subject: `[site] ${doc.assunto || "Mensagem"} — ${doc.nome}`,
      text: `${doc.mensagem}\n\n— ${doc.nome} <${doc.email}>\n\nVer no painel: /admin/collections/mensagens`,
    });
  } catch (error) {
    req.payload.logger.error({ err: error, msg: "falha ao enviar o aviso da mensagem de contato" });
  }
  return doc;
};

export const Mensagens: CollectionConfig = {
  slug: "mensagens",
  labels: { singular: "Mensagem", plural: "Mensagens" },
  admin: {
    group: "Contato",
    useAsTitle: "nome",
    defaultColumns: ["nome", "assunto", "createdAt", "lida"],
    description: "Enviadas pelo formulário de contato do site.",
  },
  defaultSort: "-createdAt",
  // Created only by the site's server action (overrideAccess); never through the public API.
  access: { create: () => false, read: authenticated, update: authenticated, delete: authenticated },
  hooks: { afterChange: [notificar] },
  fields: [
    { name: "nome", type: "text", required: true, maxLength: 120 },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "assunto", type: "text", maxLength: 120 },
    { name: "mensagem", type: "textarea", required: true, maxLength: 4000 },
    { name: "lida", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
  ],
};
