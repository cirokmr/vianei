# Centro Vianei — site

Novo site do **Centro Vianei de Educação Popular** (Lages/SC, desde 1983), em Next.js, sem WordPress.
Conceito: **"O Tempo da Araucária"**, um documentário que se assiste com o scroll.

O briefing completo está em [`docs/PROMPT.md`](docs/PROMPT.md) e as decisões técnicas em [`DECISIONS.md`](DECISIONS.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v4 (tokens em `src/app/globals.css`)
- GSAP 3 (ScrollTrigger, SplitText, CustomEase) + Lenis, carregados **depois** do `load`
- Fontes próprias com subset: Fraunces (display, eixo SOFT animável) e Inter Tight
- Playwright + axe (acessibilidade), Lighthouse CI com orçamento de performance

## Rodando

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:3000
```

| Script             | O que faz                                       |
| ------------------ | ----------------------------------------------- |
| `npm run check`    | lint + typecheck + formatação                   |
| `npm run build`    | build de produção                               |
| `npm run test:e2e` | Playwright + axe (requer `npm run build` antes) |
| `npm run lhci`     | Lighthouse CI com os orçamentos (requer build)  |
| `npm run analyze`  | relatório do bundle                             |

Na primeira vez, rode `npx playwright install chromium` para ter o navegador dos testes.

## Estrutura

```
src/
  app/                  rotas (App Router); [secao] = placeholders das próximas fases
  components/
    motion/             primitivas de animação ('use client'): SmoothScroll, SplitReveal, ScrubWords…
    ui/                 header, footer, títulos
  config/site.ts        dados institucionais (vão para o Payload na fase 2)
  fonts/                woff2 gerados por scripts/build-fonts.py
  lib/
    gsap.ts             registro único do GSAP e plugins (import dinâmico)
    use-motion.ts       hook que carrega o GSAP sob demanda e limpa tudo no unmount
tests/e2e/              Playwright + axe
```

## Regras de motion

1. Todo conteúdo é renderizado no servidor. A animação só aprimora a página e nunca é pré-requisito para ler.
2. GSAP só por `useMotion()` (nunca import estático), para manter os ~50 KB fora do caminho crítico.
3. O título LCP de cada página usa `HeroTitle` (reveal em CSS puro, sem esperar JS).
4. Todo efeito respeita `prefers-reduced-motion`: sem Lenis, sem pin e sem scrub.
5. Anime apenas `transform`, `opacity`, `clip-path` e variáveis CSS (`--soft`).

## Fases

- [x] **1. Fundação:** tokens, fontes, Lenis + GSAP, reduced motion, CI com orçamento
- [ ] 2. Payload CMS (painel `/admin`, collections, mídia, revalidação)
- [ ] 3. Migração do WordPress + redirects
- [ ] 4. Sistema de motion completo + `/lab`
- [ ] 5. Home e Quem somos (capítulos com scroll hijacking)
- [ ] 6. Páginas de conteúdo
- [ ] 7. Polimento, SEO e lançamento
