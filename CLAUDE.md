@AGENTS.md

# Projeto: site do Centro Vianei

- Briefing: `docs/PROMPT.md`. Decisões: `DECISIONS.md`. Sempre registre ali uma decisão que desvie do briefing.
- Idioma do conteúdo e da UI: pt-BR. Código e comentários: inglês.
- GSAP só via `useMotion()` / `loadMotionKit()` (`src/lib/use-motion.ts`), nunca com import estático de `gsap`.
- O `h1` LCP usa `HeroTitle` (CSS puro). Não troque por SplitText.
- Antes de concluir: `npm run check`, `npm run build`, `npm run test:e2e` e `npm run lhci`.

## CMS (Payload)

- Schema em `src/payload/`. Depois de mudar: `npm run generate:types`, `npm run generate:importmap` e
  `npm run migrate:create -- nome`. Commite os três.
- O site lê dados só por `src/lib/cms/queries.ts` (Local API + `unstable_cache` com tags de `src/lib/cms/tags.ts`).
- Coleção nova que aparece no site: adicione `revalidateCollection` / `revalidateCollectionDelete` nos hooks.
- Nunca exponha e-mails de `pessoas` sem `emailPublico`.
- Dev local: Postgres em `DATABASE_URL`; `npm run migrate && npm run seed`.
- Scripts que escrevem no banco fora do Next (seed, import) não revalidam o cache: chame `POST /api/revalidate`
  com `x-revalidate-secret`, como faz `scripts/wp-import.ts`.
- Links e mídia do CMS: use `mediaSrc()` / `publicPath()` para caminhos relativos (o Payload devolve URLs absolutas).
