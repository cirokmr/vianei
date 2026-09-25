@AGENTS.md

# Projeto: site do Centro Vianei

- Briefing: `docs/PROMPT.md`. Decisões: `DECISIONS.md`. Sempre registre ali uma decisão que desvie do briefing.
- Idioma do conteúdo e da UI: pt-BR. Código e comentários: inglês.
- GSAP só via `useMotion()` / `loadMotionKit()` (`src/lib/use-motion.ts`), nunca com import estático de `gsap`.
- O `h1` LCP usa `HeroTitle` (CSS puro). Não troque por SplitText.
- Antes de concluir: `npm run check`, `npm run build`, `npm run test:e2e` e `npm run lhci`.
