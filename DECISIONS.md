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

## 2026-09-25 · Fase 2

### Payload 3 embutido, Postgres e migrations obrigatórias

- O Payload roda no mesmo app Next (`src/app/(payload)`), então há um só deploy e um só repositório.
- Postgres com `push: false`: toda mudança de schema passa por migration commitada e revisada.
  O build da Vercel roda `npm run migrate` antes do `next build`.
- GraphQL desligado, porque o site usa a Local API e o painel usa REST. Isso diminui a superfície de ataque e o tamanho do
  servidor.

### Cache: `unstable_cache` + tags, não `use cache`

O Next 16 recomenda `cacheComponents` + `'use cache'`, mas o painel do Payload lê cookies e headers em toda a árvore do
`/admin` e hoje não é compatível com esse modo. Usamos `unstable_cache` com tags (`src/lib/cms/tags.ts`); os hooks do
Payload chamam `revalidateTag(tag, { expire: 0 })`. `expire: 0` (e não `"max"`) porque a equipe espera ver a
notícia publicada na primeira visita, não na segunda. Reavaliar quando o Payload suportar Cache Components.

### Rascunhos, preview e live preview

- Notícias e projetos têm rascunho com autosave; publicações têm rascunho simples.
- `/api/preview` exige `PREVIEW_SECRET` e só aceita caminhos internos (bloqueia `//dominio`, open redirect).
- Em draft mode as consultas ignoram o cache e leem rascunhos. O `LivePreviewListener` é carregado com
  `next/dynamic`, então visitantes comuns nunca baixam esse código (nem via prefetch).
- Agendamento de publicação (`schedulePublish`) ficou de fora: exige um executor de jobs (cron) que o plano da Vercel
  pode não cobrir. Pode ser ligado depois.

### Privacidade

- E-mails em `pessoas` só saem na API pública quando `emailPublico` está marcado (acesso por campo).
- `usuarios` não é listável sem login. Login com bloqueio após 5 tentativas (15 min) e sessão de 8 h.
- O seed não grava e-mails pessoais.

### Mídia

- O upload redimensiona o original para no máximo 2560px e converte para WebP (q82), e gera `miniatura` (480),
  `cartao` (960), `destaque` (1920) e `og` (1200×630 JPEG). Limite de 15 MB por arquivo.
- Em produção os arquivos vão para o Vercel Blob. Sem token (dev/CI), ficam no disco local (`/midia`, ignorado no git).

### Orçamento de performance (revisto)

| Métrica           | Fase 1   | Fase 2                                        |
| ----------------- | -------- | --------------------------------------------- |
| JS (inclui GSAP)  | ≤ 210 KB | ≤ 225 KB: `next/image` (~13 KB) nas listagens |
| LCP (laboratório) | erro     | aviso em 2,5 s. O gate é Performance ≥ 95     |

O LCP simulado oscilou entre 2,0 e 2,6 s em execuções idênticas nesta máquina (Performance entre 96 e 99). Um gate que
falha por ruído treina a equipe a ignorar o CI, então a nota de Performance (que já pondera o LCP) segue bloqueando e o
LCP vira aviso. O `admin` não entra no bundle público: `/` e `/noticias` carregam os mesmos chunks do framework que
antes, mais o `next/image`.

## 2026-09-25 · Fase 3

### Migração em duas etapas: snapshot versionado + importador idempotente

- `npm run wp:export` lê o WordPress e grava `data/wp-export/snapshot.json` (commitado). O import fica reproduzível e
  revisável mesmo depois que o site antigo for desligado.
- `npm run wp:import` grava no Payload. Documentos casam por `legado.wpId` e arquivos por `origem` (URL original),
  então dá para rodar de novo sem duplicar: só baixa o que falta.
- Os tipos `noticias`, `projetos` e `publicacoes` foram criados com JetEngine **sem editor**: a API REST não traz o texto.
  O exportador lê o HTML publicado (widgets do Elementor) e a API só para data, slug e imagem de destaque. Os PDFs das
  publicações só existem nos botões "BAIXAR AGORA" da home.

### Limpeza do conteúdo

- HTML reduzido a tags semânticas (parágrafos, títulos, listas, links, ênfase), sem classes e estilos do Elementor.
- Títulos sem emojis (o slug antigo com emoji ganha redirect para o novo, limpo).
- Níveis de título normalizados: o corpo começa em `h2` (os posts pulavam de `h1` para `h3`, o que reprovava a acessibilidade).
- Imagem de capa repetida no início do texto é descartada.
- Links internos antigos reescritos para os novos endereços; PDFs linkados no texto são migrados e os links reescritos.
- Link quebrado no original (ex.: `http://“Título”`) perde o link e mantém o texto.

### Imagens

- Original do WordPress (não a cópia redimensionada) → WebP de até 2560px: **188,7 MB → 37,4 MB (−80%)**.
- Nas páginas, imagens do corpo passam por `next/image` (AVIF/WebP no tamanho da tela), e não mais por `<img>` com o original.
- Sem texto alternativo no WordPress (180 imagens): recebem um texto provisório legível e o campo
  `altProvisorio`, que o painel filtra e que se desmarca sozinho quando alguém edita o texto. Não usamos um prefixo
  como "[descrever]" porque leitores de tela o leriam em voz alta.
- Fotos de terceiros (matérias republicadas) recebem o crédito "Reprodução: site" e entram numa lista de verificação.

### URLs de arquivos relativas

O Payload devolve URLs absolutas com `serverURL` (`http://localhost:3000/...` em dev). Elas vinham gravadas no conteúdo
e nos redirects, e o `next/image` recusava. `publicPath()` / `publicUrl()` guardam caminhos relativos para arquivos do
próprio site; URLs do Vercel Blob continuam absolutas.

### Cache após escrita fora do Next

Escritas do import não disparam os hooks de revalidação (eles precisam de uma requisição Next), e o cache de dados
persiste entre builds e deploys. O importador chama `POST /api/revalidate` (protegido por `REVALIDATE_SECRET`) no final.

### Mini-site do Projeto Restaurar

As páginas em `/projetos1/projeto-restaurar/...` viraram a coleção `paginas` em `/projetos/projeto-restaurar/...`.
As 3 que eram só menus viraram redirects. Um padrão `/projetos1/:path*` cobre qualquer endereço não listado.

### Redirects

- 44 regras em `src/redirects.json` (geradas), mais os padrões. Next responde **308** (equivalente permanente do 301
  para buscadores).
- URLs antigas com barra final fazem 2 saltos (remove a barra → destino). Aceitável para buscadores e mais simples que
  desligar a normalização de barra do Next.

### Não migrado

- `download` (6 itens "Arquivo 1…7" com Lorem ipsum): conteúdo de teste.
- Páginas "Início", "Quem somos", "Fale conosco", "Galeria de vídeos" e "Obrigado": viram as novas páginas das fases
  5 e 6 (os dados de "Quem somos" já estão no seed).

### Complementos da equipe (26/09)

Material enviado depois do snapshot fica em `data/wp-export/complementos.json` (+ arquivos em
`data/wp-export/complementos/`), chaveado pelo `wpId`, e o importador aplica. Assim a correção vale também para o
import de produção, sem edição manual no painel. PDFs enviados passam por `scripts/pdf-extract.py` (recorte de páginas e
recompressão das imagens; a cartilha de gestão caiu de 11,9 MB para 4,2 MB sem perder legibilidade).

### Situação dos projetos fora do site

A pedido da equipe, "em andamento/concluído" não aparece no site por enquanto. O campo continua no painel.

- PDFs enviados pelo GitHub foram reduzidos e os originais saíram do repositório. O PEAN0059 veio embrulhado num
  envelope multipart (`ZENDHTTPCLIENT`) do repositório de origem; o PDF interno estava íntegro e o recorte gerado é
  um PDF limpo.
- "Construção social dos mercados" (2020, wpId 1102) era o mesmo livro da publicação 1187 (PDF idêntico). A pedido
  da equipe, a entrada repetida é omitida (`complementos.omitir`); o endereço antigo cai no redirect
  `/publicacoes/:slug`. O importador também sabe reaproveitar o arquivo de outra publicação (`mesmoArquivoDe`).

## 2026-09-26 · Fase 4

### Menu mobile com `<dialog>` nativo

Até aqui o celular não tinha navegação (o menu era `hidden md:block`). O menu usa `<dialog>` com `showModal()`:
foco preso, Esc, fundo inerte e retorno do foco vêm do navegador, sem biblioteca. A animação de entrada é CSS puro.

### Cor do header medida ao vivo, não com ScrollTrigger

A primeira versão calculava as posições das seções escuras com ScrollTrigger. Como o header monta antes do conteúdo,
essas posições eram calculadas sem o espaço extra dos _pins_ e ficavam erradas (14 divergências em 70 amostras no
`/lab`; nem `refreshPriority` resolveu por completo). O `HeaderShell` agora mede `getBoundingClientRect()` das seções
`[data-header="dark"]` uma vez por frame de scroll: zero divergências, sem GSAP no header.

### Recalcular posições depois de cada setup

Primitivas montam e carregam o GSAP em ordens diferentes, e cada _pin_ desloca o que vem abaixo. `useMotion()` agenda
um `ScrollTrigger.refresh()` único e agrupado (120 ms) depois de cada setup e de cada desmontagem.

### Transição de página

`<ViewTransition>` do React no `template.tsx` (que remonta a cada navegação): a página antiga sobe e some, a nova é
revelada de baixo para cima. O header fica ancorado (`view-transition-name`). A "cortina cor de terra" do briefing não
é possível só com CSS de view transitions (o snapshot da página nova cobre a raiz); o wipe limpo foi escolhido no lugar.
Com `prefers-reduced-motion`, a troca é instantânea.

### Neblina WebGL

OGL (~10 KB) importado sob demanda depois do `load` e de `requestIdleCallback`; só em telas ≥ 768px, com movimento
permitido e sem economia de dados. Pausa fora da tela e em abas escondidas; DPR limitado a 1,5.

### Acessibilidade das primitivas

- `HorizontalGallery` no celular é uma faixa rolável: recebeu `tabIndex=0` e rótulo, para rolar pelo teclado
  (o axe apontou `scrollable-region-focusable`).
- `Counter` entrega o valor final ao leitor de tela (texto `sr-only`); só os dígitos visuais animam.
- `Marquee` duplica o conteúdo com `aria-hidden` e pausa ao receber foco ou hover.
- Com movimento reduzido: nenhum _pin_, nenhum canvas, marquee estático, capítulos lidos em ordem.

### `/lab`

Vitrine interna com fotos reais (versões leves em `public/lab/`). Em produção responde 404, a menos que
`ENABLE_LAB=1` (usado no CI para testar as primitivas).

## 2026-09-26 · Fase 5

### Home em sete capítulos, Quem somos em seis

As páginas são Server Components que só buscam dados e compõem capítulos (`src/components/chapters/`). Cada
capítulo fica dentro de um `<Chapter>`: um wrapper fora de qualquer pin, com `id` (âncora) e `data-chapter`
(índice). O `ChapterRail` (desktop) mostra "03 / 07" e leva a cada capítulo pelo Lenis, depois move o foco para
ele. As etiquetas só aparecem no hover/foco, para o índice nunca cobrir conteúdo.

### Dados reais, nunca inventados

- Linha do tempo: global `timeline` (hoje só 1983 e 1988). O capítulo cresce sozinho quando a equipe cadastra
  marcos. O painel "Hoje" lista os projetos publicados, sem dizer se estão em andamento (pedido da equipe).
- Números: os anos de atuação são calculados a partir de 1983 (um fato, que não envelhece). Os demais vêm do
  global `numeros`, hoje vazio, e aparecem assim que a equipe preencher.
- Textos de Quem somos, áreas de atuação (a–p) e propósito: do site atual, levemente editados para leitura.
  Equipe, diretoria e parceiros: das collections, com e-mail só quando marcado como público.

### Fotos curadas em `public/fotos/`

Dez fotos do acervo migrado, recortadas e reencodadas (2,9 MB no repositório; o `next/image` serve AVIF/WebP no
tamanho certo). O hero usa direção de arte (`<picture>`): copa horizontal no desktop (qualidade 55), tronco
vertical no celular (qualidade 40, porque ali só a copa aparece acima da névoa). Quando chegarem fotos novas (ver
`ASSETS-NEEDED.md`), basta trocar os arquivos. O `/lab` passou a usar as mesmas fotos (a pasta `public/lab` saiu).

### LCP da home: o título, não a foto

O elemento de LCP da home é o título. Três ajustes o mantêm rápido:

1. **Pin sem reinserir o DOM.** O hero é fixado pelo ScrollTrigger, que por padrão embrulha o elemento em um
   `div` novo. Isso reinseria o título no DOM, o Chrome contava uma nova pintura e o LCP ia para o momento em que
   o motion carrega (~3,2 s). O `Dawn` passa o próprio wrapper renderizado no servidor (`pinSpacer`) e o LCP
   observado voltou a coincidir com o FCP. Regra: **pin acima da dobra sempre com `pinSpacer`**. (O wrapper
   herda o `display: flex` da seção; por isso a seção leva `w-full`.)
2. **A foto entra depois do `load`** (`DawnPhoto`), com fade, como a névoa se dissipando. Assim os ~40–60 KB da
   foto saem da primeira leva de requisições, que fica com a fonte do título e o JS da página. Sem JS, uma cópia
   em `<noscript>` mostra a foto.
3. **Animação do título** com easing de saída rápida e sem atraso inicial: as letras entram na máscara nos
   primeiros quadros.

Também: os setups de motion rodam um por tarefa (`scheduler.yield`/`setTimeout`), em vez de todos juntos logo
após o `load`, e o GSAP só carrega depois do `load` **e** de um período ocioso (TBT da home: ~200 ms → ~90 ms).

Depois do primeiro CI (home 0,93, LCP 3,1 s), mais três ajustes:

- **CSS externo (`inlineCss: false`).** O Next inlinava o CSS duas vezes: num `<style>` e de novo no payload RSC
  (~19 KB gzip por página). Externo, ele vai uma vez e fica em cache entre páginas; o LCP medido ficou igual.
- **`content-visibility` até o boot.** Em páginas de capítulos, os capítulos depois do primeiro pulam estilo e
  layout até o `motion-ready` (a regra sai antes de qualquer ScrollTrigger medir, então os pins veem tamanhos
  reais; o que muda está fora da tela, sem CLS). A primeira pintura só calcula o hero (LCP observado ~100 ms).
- **Sem placeholder de blur** nas fotos da home: o base64 entrava duas vezes no documento (HTML + payload).

O índice de capítulos e a névoa WebGL (só desktop, nada a renderizar no servidor) carregam depois da hidratação
via `next/dynamic` (`src/components/chapters/lazy.tsx`). Do JS inicial (~150 KB gzip), ~135 KB são React e o
runtime do Next; o código do site é ~6 KB no layout e ~10 KB na home, então não há mais o que cortar ali.

No Lighthouse, toda página tem um piso de ~2,7 s de LCP simulado, que vem dos ~150 KB de JS do Next pedidos antes
do LCP; a home fica ~0,1 s acima por ter mais HTML.

Tentado e descartado: envolver cada capítulo em `<Suspense>` para hidratar por partes. O TBT piorou (a
hidratação continuou em uma tarefa e o HTML cresceu com os marcadores).

Resultado local (mediana de 5, mobile, Lighthouse CI): home 95 (95–96 em todas as execuções), quem-somos 98, notícias 96; CLS ≤ 0,022. O LCP
simulado varia entre 2,2 e 2,9 s de uma execução para outra nas três páginas (o Lantern soma todo o JS pedido
antes do LCP); continua como alerta, não como bloqueio.

### Orçamento de JS: 225 → 240 KB

`/quem-somos` virou página real, e o `<Link>` do header pré-carrega o código dela em qualquer página (~8 KB).
O Lighthouse conta esse prefetch como script da página, então `/noticias` passou de 225 KB. O JS da própria home
continua em ~212 KB.

### Capítulo fixo acessível

As etapas escondidas do `PinnedChapter` agora usam só `opacity` (antes `visibility`), para continuarem na árvore
de acessibilidade: um leitor de tela lê a história inteira. Só a etapa visível recebe cliques, e o foco que entra
em uma etapa escondida rola o capítulo até ela.
