# Centro Vianei — site

Novo site do **Centro Vianei de Educação Popular** (Lages/SC, desde 1983), em Next.js, sem WordPress.
Conceito: **"O Tempo da Araucária"**, um documentário que se assiste com o scroll.

O briefing completo está em [`docs/PROMPT.md`](docs/PROMPT.md) e as decisões técnicas em [`DECISIONS.md`](DECISIONS.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- **Payload CMS 3** embutido no próprio app (painel em `/admin`), Postgres, mídia no Vercel Blob
- Tailwind CSS v4 (tokens em `src/app/globals.css`)
- GSAP 3 (ScrollTrigger, SplitText, CustomEase) + Lenis, carregados **depois** do `load`
- Fontes próprias com subset: Fraunces (display, eixo SOFT animável) e Inter Tight
- Playwright + axe (acessibilidade), Lighthouse CI com orçamento de performance

## Rodando

Pré-requisitos: Node 22 e um Postgres 16 local (ou Docker:
`docker run -d -p 5432:5432 -e POSTGRES_USER=vianei -e POSTGRES_PASSWORD=vianei postgres:16`).

```bash
nvm use
npm install
cp .env.example .env    # preencha PAYLOAD_SECRET e PREVIEW_SECRET (openssl rand -hex 32)
npm run migrate         # cria as tabelas
SEED_ADMIN_EMAIL=voce@exemplo.org SEED_ADMIN_PASSWORD='senha-forte' npm run seed
npm run dev             # site em http://localhost:3000, painel em /admin
```

| Script                           | O que faz                                                   |
| -------------------------------- | ----------------------------------------------------------- |
| `npm run check`                  | lint + typecheck + formatação                               |
| `npm run build`                  | build de produção (precisa do banco: páginas são estáticas) |
| `npm run test:e2e`               | Playwright + axe (requer build, banco e seed)               |
| `npm run lhci`                   | Lighthouse CI com os orçamentos (requer build)              |
| `npm run migrate`                | aplica as migrations pendentes                              |
| `npm run migrate:create -- nome` | gera migration depois de mudar collections/globals          |
| `npm run generate:types`         | atualiza `src/payload-types.ts`                             |
| `npm run seed`                   | dados institucionais (idempotente)                          |
| `npm run analyze`                | relatório do bundle                                         |

Na primeira vez, rode `npx playwright install chromium` para ter o navegador dos testes.

### Mudando o modelo de conteúdo

1. Edite a collection/global em `src/payload/`.
2. `npm run generate:types && npm run generate:importmap`
3. `npm run migrate:create -- descricao-da-mudanca` e revise o SQL gerado.
4. Commit dos três (config, tipos, migration). O CI falha se tipos ou import map estiverem desatualizados.

### Migração do WordPress

```bash
npm run wp:export          # (opcional) atualiza data/wp-export/snapshot.json a partir do site antigo
npm run wp:import          # importa o snapshot; idempotente, pode rodar de novo
```

Resultado em `data/wp-export/migration-report.md` e `src/redirects.json`. Rode o import com o site no ar e
`REVALIDATE_SECRET` definido, para ele expirar o cache no final. Detalhes em `DECISIONS.md` (fase 3).

### Produção (Vercel)

Variáveis: `DATABASE_URL` (Neon), `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL`,
`NEXT_PUBLIC_SITE_URL`, `BLOB_READ_WRITE_TOKEN`, `REVALIDATE_SECRET`. Build command: `npm run migrate && npm run build`.

## Estrutura

```
src/
  app/
    (site)/             site público; [secao] = placeholders das próximas fases
    (payload)/          painel /admin e API REST (arquivos gerados pelo Payload)
  components/
    motion/             primitivas de animação ('use client'): SmoothScroll, SplitReveal, ScrubWords…
    chapters/           capítulos da home e de Quem somos, Chapter (âncora) e ChapterRail (índice)
    cms/                RichText, barra de rascunho, live preview
    ui/                 header, footer, títulos
  config/site.ts        navegação e metadados estáticos
  config/areas.ts       as quatro áreas de atuação (texto, foto, link)
  fonts/                woff2 gerados por scripts/build-fonts.py
  lib/
    cms/                acesso a dados (Local API + cache por tags), mídia
    gsap.ts             registro único do GSAP e plugins (import dinâmico)
    use-motion.ts       hook que carrega o GSAP sob demanda e limpa tudo no unmount
  payload/              collections, globals, acesso, hooks de revalidação
  payload.config.ts
  migrations/           migrations do Postgres (geradas, revisadas e commitadas)
scripts/                seed, fontes, migração do WordPress (wp-export, wp-import)
data/wp-export/         snapshot do WordPress, relatório da migração
public/fotos/           fotos curadas do acervo (hero, áreas); o next/image gera AVIF/WebP
tests/e2e/              Playwright + axe (fundação, CMS, redirects, motion, capítulos)
docs/EDITORES.md        guia do painel para a equipe
```

## Sistema de motion (`src/components/motion/`)

Veja todas as primitivas funcionando em **`/lab`** (em dev, ou com `ENABLE_LAB=1`; em produção é 404).

| Primitiva           | O que faz                                                                      |
| ------------------- | ------------------------------------------------------------------------------ |
| `SmoothScroll`      | Lenis sincronizado ao ticker do GSAP; `useSmoothScroll()` para `scrollTo/lock` |
| `SplitReveal`       | revela texto linha a linha com máscara                                         |
| `HeroTitle`         | título LCP com reveal em CSS puro (ui/)                                        |
| `ScrubWords`        | fixa a seção e acende palavra por palavra                                      |
| `PinnedChapter`     | o coração do hijacking: fixa e avança `[data-step]` com snap                   |
| `HorizontalGallery` | scroll vertical vira horizontal (desktop); swipe nativo no celular             |
| `StackCards`        | cards fixos que se empilham e recuam                                           |
| `ClipImage`         | imagem revelada por clip-path + parallax interno                               |
| `DrawTree`          | araucária desenhada com o scroll (DrawSVG)                                     |
| `Counter`           | número que conta até o valor (valor final no HTML)                             |
| `Marquee`           | faixa infinita que acelera com o scroll, pausável                              |
| `Magnetic`          | botão atraído pelo cursor                                                      |
| `CursorPreview`     | imagem flutuante ao passar sobre itens `[data-preview]`                        |
| `ContextCursor`     | rótulo junto ao cursor em `[data-cursor="Ler"]`                                |
| `Fog`               | neblina WebGL (OGL), só em telas grandes, depois do carregamento               |

Transição de página: `<ViewTransition>` em `src/app/(site)/template.tsx` + CSS em `globals.css`.

## Regras de motion

1. Todo conteúdo é renderizado no servidor. A animação só aprimora a página e nunca é pré-requisito para ler.
2. GSAP só por `useMotion()` (nunca import estático), para manter os ~50 KB fora do caminho crítico.
3. O título LCP de cada página usa `HeroTitle` (reveal em CSS puro, sem esperar JS).
4. Todo efeito respeita `prefers-reduced-motion`: sem Lenis, sem pin e sem scrub.
5. Anime apenas `transform`, `opacity`, `clip-path` e variáveis CSS (`--soft`).
6. Efeitos de cursor só com `(pointer: fine)`; no celular, pins mais curtos e galerias com swipe nativo.
7. Seções escuras levam `data-header="dark"` (ou `dark` no `PinnedChapter`) para o header trocar de cor.

## Fases

- [x] **1. Fundação:** tokens, fontes, Lenis + GSAP, reduced motion, CI com orçamento
- [x] **2. Payload CMS:** painel `/admin`, collections, mídia, revalidação, preview e live preview
- [x] **3. Migração do WordPress:** 65 notícias, 5 projetos, 14 publicações, 7 páginas, 226 imagens, 14 PDFs, 44 redirects
- [x] **4. Sistema de motion:** 15 primitivas, `/lab`, menu mobile, transição de página, neblina WebGL
- [x] **5. Home e Quem somos:** 7 + 6 capítulos com scroll hijacking, índice de capítulos, versões mobile e reduced motion
- [ ] 6. Páginas de conteúdo
- [ ] 7. Polimento, SEO e lançamento
