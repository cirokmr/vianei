"use server";

import { headers } from "next/headers";
import { payload } from "@/lib/cms/payload";

export type ContatoState = {
  status: "idle" | "ok" | "erro";
  mensagem?: string;
  erros?: Partial<Record<"nome" | "email" | "mensagem", string>>;
  valores?: { nome: string; email: string; assunto: string; mensagem: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort flood guard per server instance: 5 messages / 10 min per IP.
const recentes = new Map<string, number[]>();
function excedeuLimite(ip: string) {
  const agora = Date.now();
  const janela = (recentes.get(ip) ?? []).filter((t) => agora - t < 10 * 60_000);
  janela.push(agora);
  recentes.set(ip, janela);
  return janela.length > 5;
}

const texto = (form: FormData, campo: string) => String(form.get(campo) ?? "").trim();

export async function enviarContato(_prev: ContatoState, form: FormData): Promise<ContatoState> {
  const valores = {
    nome: texto(form, "nome").slice(0, 120),
    email: texto(form, "email").slice(0, 200),
    assunto: texto(form, "assunto").slice(0, 120),
    mensagem: texto(form, "mensagem").slice(0, 4000),
  };

  const erros: ContatoState["erros"] = {};
  if (valores.nome.length < 2) erros.nome = "Diga seu nome.";
  if (!EMAIL.test(valores.email)) erros.email = "Informe um e-mail válido, para podermos responder.";
  if (valores.mensagem.length < 10) erros.mensagem = "Escreva sua mensagem (pelo menos 10 caracteres).";
  if (Object.keys(erros).length) {
    return { status: "erro", mensagem: "Confira os campos destacados.", erros, valores };
  }

  // Spam traps, after validation so people always get real feedback: a
  // honeypot field and a minimum fill time (set when the form hydrates).
  // Bots get a fake success and nothing is stored.
  const iniciado = Number(form.get("iniciado") ?? 0);
  if (texto(form, "site") || (iniciado && Date.now() - iniciado < 2500)) {
    return { status: "ok", mensagem: "Mensagem enviada. Obrigado!" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (excedeuLimite(ip)) {
    return { status: "erro", mensagem: "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.", valores };
  }

  try {
    await (await payload()).create({ collection: "mensagens", data: valores, overrideAccess: true });
    return { status: "ok", mensagem: "Mensagem enviada. Obrigado! Respondemos pelo e-mail informado." };
  } catch {
    return {
      status: "erro",
      mensagem: "Não foi possível enviar agora. Tente de novo ou escreva para o nosso e-mail.",
      valores,
    };
  }
}
