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

## Motion (fase 4)

- Primitivas em `src/components/motion/`, todas via `useMotion()`. Teste qualquer mudança em `/lab`
  (`ENABLE_LAB=1` no build de produção).
- Seção escura: `data-header="dark"` (ou `dark` no `PinnedChapter`). Não recrie a lógica do header com ScrollTrigger.
- Efeitos de cursor usam `FINE_POINTER` (`src/lib/motion.ts`); nada de cursor custom no celular.

## Capítulos (fase 5)

- Páginas compõem capítulos de `src/components/chapters/`; cada um dentro de `<Chapter id label>` e listado no
  `ChapterRail` da página.
- Pin acima da dobra: passe `pinSpacer` com um wrapper renderizado no servidor (ver `Dawn.tsx`). Sem isso o GSAP
  reinsere o elemento no DOM e o LCP vai para o momento em que o motion carrega.
- Números e marcos vêm dos globals `numeros` e `timeline`. Nunca escreva um número institucional no código.

## Conteúdo (fase 6)

- Rotas de índice compartilham componentes: `NoticiasIndex` (lista, tema e paginação), `PageHeader`.
- Não use `dynamicParams = false` em rotas revalidadas por tag: no Next 16 a revalidação faz a página cair em
  404 (NoFallbackError). Trate slugs inválidos com `notFound()`.
- Vídeos: sempre pela fachada `YouTube` (miniatura até o clique, `youtube-nocookie`). Um link solto do YouTube num
  parágrafo do editor vira player automaticamente (`RichText`).
- Mensagens de contato só são criadas pela server action (`overrideAccess`); a API pública não aceita `create`.
