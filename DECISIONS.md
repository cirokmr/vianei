# Decisões técnicas

Registro das decisões que desviam do briefing ou que não são óbvias.

## 2026-09-25 · Fase 1

### GSAP carregado sob demanda, depois do `load`

`src/lib/gsap.ts` só é importado dinamicamente via `loadMotionKit()` (`src/lib/use-motion.ts`), que espera o evento
`load`. Assim os ~50 KB (gzip) de GSAP + plugins não competem com a fonte do LCP e com a hidratação. O custo é que
elementos com `[data-reveal]` ficam ocultos até o GSAP chegar (tipicamente < 300 ms após o `load`). Há um failsafe
no `<head>` que remove a classe `js` após 4 s se a camada de motion não subir.

`@gsap/react` foi removido: `useMotion()` cobre o mesmo papel (`gsap.context` com escopo e `revert()` no unmount)
com import dinâmico.

### Título do hero em CSS puro (`HeroTitle`)

O `h1` é o elemento LCP. Com SplitText ele ficaria invisível até o JS hidratar (LCP de 3,8 s no Lighthouse mobile).
`HeroTitle` quebra as palavras no servidor e anima com `@keyframes`: o LCP pinta no primeiro frame.

### Fontes próprias com subset (`scripts/build-fonts.py`)

| Fonte               | Google Fonts | Nosso arquivo |
| ------------------- | -----------: | ------------: |
| Fraunces (display)  |       118 KB |         40 KB |
| Inter Tight (texto) |        44 KB |         18 KB |

- Fraunces: `opsz` fixo em **72**, `wght` 300–500 e eixo `SOFT` mantido (animado no scroll).
  Com `opsz` 144 e peso light, os traços finos somem e o "e" parece "c" em tamanho de título. Testado e descartado.
- O eixo `WONK` e os itálicos foram removidos para economizar bytes (sem uso previsto).
- Glifos: ASCII + acentos do português + pontuação tipográfica.

### Header com cor explícita, não `mix-blend-difference`

O blend-mode dá o efeito "automático" sobre qualquer fundo, mas o axe não consegue medir o contraste e o resultado
é imprevisível sobre fotos. As seções escuras usam `data-header="dark"` e o header troca de cor via ScrollTrigger.

### Palavras "apagadas" no scrub com opacidade 0,42

Abaixo disso o texto fica com contraste < 3:1 antes da rolagem (falha WCAG AA para texto grande). Com 0,42 o
efeito continua perceptível e o texto é legível desde o início.

### Orçamento de performance: ajustes em relação ao briefing

| Métrica            | Briefing | Adotado no CI | Medido (mobile, 3 execuções) |
| ------------------ | -------: | ------------: | ---------------------------: |
| Performance        |     ≥ 95 |          ≥ 95 |                        96–98 |
| LCP (laboratório)  |  < 2,0 s |       < 2,5 s |                    2,3–2,4 s |
| JS inicial (gzip)  | < 180 KB |      < 210 KB |                       194 KB |
| Fontes             |        — |      < 150 KB |                        60 KB |
| Peso total da home | < 1,5 MB |      < 1,5 MB |                       278 KB |

- **JS:** só React 19 + Next 16 somam ~155 KB gzip, antes de qualquer código nosso. Como o GSAP (~50 KB) já sai do
  caminho crítico, o teto de 180 KB com GSAP incluído não é atingível. O teto passa a 210 KB.
- **LCP:** o LCP simulado ficou em 2,3–2,4 s, e os experimentos mostraram que não depende da fonte, da animação nem do
  GSAP. O que resta é TTFB mais o JS do framework no modelo de rede simulado. O CI usa 2,5 s (limite "bom" do Google);
  a meta de 2,0 s passa a ser acompanhada com dados reais de campo (Vercel Speed Insights, na fase 7).

### Rotas placeholder (`src/app/[secao]`)

Os links do menu já apontam para as rotas finais. Enquanto elas não existem, `[secao]` gera páginas "Em breve" com
`noindex`, para não haver 404 nem erros no console. Cada rota real criada nas próximas fases tem precedência.
