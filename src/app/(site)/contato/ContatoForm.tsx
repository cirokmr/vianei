"use client";

import { useActionState, useEffect, useRef } from "react";
import { enviarContato, type ContatoState } from "./actions";

const campo =
  "w-full border-b border-tinta/30 bg-transparent py-3 text-lead outline-none transition-colors focus:border-pinhao aria-[invalid=true]:border-pinhao";
const rotulo = "text-eyebrow tracking-[0.14em] text-tinta/80 uppercase";

/** Contact form. A plain POST without JS (server action); inline feedback with it. */
export function ContatoForm() {
  const [state, action, pending] = useActionState<ContatoState, FormData>(enviarContato, { status: "idle" });
  const iniciado = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (iniciado.current) iniciado.current.value = String(Date.now());
  }, []);
  useEffect(() => {
    if (state.status !== "idle") status.current?.focus();
  }, [state]);

  if (state.status === "ok") {
    return (
      <p
        ref={status}
        tabIndex={-1}
        role="status"
        className="font-display text-h2 leading-[1.05] text-mata outline-none"
      >
        {state.mensagem}
      </p>
    );
  }

  const v = state.valores;
  const erro = (c: "nome" | "email" | "mensagem") =>
    state.erros?.[c] ? (
      <span id={`${c}-erro`} className="mt-2 block text-sm text-pinhao">
        {state.erros[c]}
      </span>
    ) : null;

  return (
    <form action={action} noValidate className="grid gap-8" aria-describedby="contato-status">
      <p
        id="contato-status"
        ref={status}
        tabIndex={-1}
        role={state.status === "erro" ? "alert" : undefined}
        className="text-pinhao outline-none empty:hidden"
      >
        {state.status === "erro" ? state.mensagem : ""}
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className={rotulo}>Nome</span>
          <input
            name="nome"
            required
            autoComplete="name"
            maxLength={120}
            defaultValue={v?.nome}
            aria-invalid={Boolean(state.erros?.nome)}
            aria-describedby={state.erros?.nome ? "nome-erro" : undefined}
            className={campo}
          />
          {erro("nome")}
        </label>
        <label className="block">
          <span className={rotulo}>E-mail</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            defaultValue={v?.email}
            aria-invalid={Boolean(state.erros?.email)}
            aria-describedby={state.erros?.email ? "email-erro" : undefined}
            className={campo}
          />
          {erro("email")}
        </label>
      </div>
      <label className="block">
        <span className={rotulo}>Assunto (opcional)</span>
        <input name="assunto" maxLength={120} defaultValue={v?.assunto} className={campo} />
      </label>
      <label className="block">
        <span className={rotulo}>Mensagem</span>
        <textarea
          name="mensagem"
          required
          rows={6}
          maxLength={4000}
          defaultValue={v?.mensagem}
          aria-invalid={Boolean(state.erros?.mensagem)}
          aria-describedby={state.erros?.mensagem ? "mensagem-erro" : undefined}
          className={`${campo} resize-y`}
        />
        {erro("mensagem")}
      </label>
      {/* Spam traps: invisible to people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Não preencha
          <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={iniciado} type="hidden" name="iniciado" />
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-pinhao px-8 py-4 text-eyebrow font-semibold tracking-[0.16em] text-papel uppercase transition-opacity disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}
