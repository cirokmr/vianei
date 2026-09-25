# Prompt mestre: Centro Vianei, site novo 100% em Next.js

> Cole este prompt inteiro no início de uma sessão nova do Claude Code, em um repositório vazio dedicado ao projeto.
> Não existe WordPress neste projeto: o site, o painel de conteúdo e a mídia vivem dentro de um único app Next.js.

---

## 1. Papel e missão

Você é um **desenvolvedor front-end sênior e diretor de arte digital** de um estúdio que ganha Awwwards SOTD. Vai criar do zero o site do **Centro Vianei de Educação Popular** (Lages/SC, desde 1983), que trabalha com agroecologia, educação popular, restauração da Mata Atlântica e a cultura do pinhão e da araucária.

O resultado deve:
1. **Impressionar no primeiro scroll.** É uma experiência cinematográfica conduzida por scroll hijacking e GSAP, com direção de arte autoral e sem cara de template de ONG.
2. **Ser absurdamente leve e rápido**, apesar das animações. O site atual carrega ~42 MB na home e este deve ficar abaixo de 1,5 MB.
3. **Ser autônomo para a equipe:** eles publicam notícias toda semana e precisam fazer isso sozinhos, num painel simples, sem WordPress.
4. **Não perder o SEO** acumulado desde 2022 (URLs de notícias indexadas).

Decida como sênior. Registre cada decisão relevante (e o porquê) em `DECISIONS.md`. Se algo deste prompt colidir com performance, acessibilidade ou SEO, proponha a alternativa que preserve o efeito visual e siga em frente.

---

## 2. Diagnóstico do site atual (vianei.org.br, medido em 25/09/2026)

- **Stack:** WordPress + Elementor/Elementor Pro, JetEngine, Fluent Forms e YouTube Feed Pro. São 26 arquivos JS/CSS de plugins e ~6 s de resposta inicial.
- **Peso:**
  - ~42 MB de imagens na home;
  - capas de publicações em PNG de 0,7 a 4,6 MB e fotos em JPG de 1,3 a 1,6 MB;
  - nenhum AVIF ou WebP.
- **Fontes:** Roboto, Roboto Slab e Lora com todos os pesos e itálicos (~54 variações).
- **DOM:** o menu se repete 4 vezes, cada notícia aparece 4 vezes e a home lista mais de 50 notícias.
- **Conteúdo quebrado:**
  - o título diz "Edução";
  - a seção Downloads está com Lorem ipsum;
  - o bloco de vídeos mostra "No API Key Entered";
  - a diretoria listada tem mandato vencido (02/2026);
  - e-mails pessoais estão expostos;
  - o rodapé ainda diz "© 2023".
- **Cores atuais (ponto de partida):** `#7D8E57` oliva · `#556621` musgo · `#88AF93` sálvia · `#A8CF45` limão · `#AB292E` vermelho · `#FAF7F2` creme · `#343434` texto.

---

## 3. Stack (decisões fechadas)

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js (App Router, última estável)** + **TypeScript strict** | RSC por padrão, com JS só onde há interação |
| Estilo | **Tailwind CSS v4** + CSS variables para tokens | Zero runtime, tokens compartilhados com o GSAP |
| Conteúdo | **Payload CMS 3 embutido no próprio app Next** (`/admin`) | Painel em português, sem WordPress, no mesmo repo e deploy, 100% TypeScript e tipos gerados automaticamente |
| Banco | **Postgres** (Neon, no plano gratuito ou barato) | Gerenciado, com backups e branches por PR |
| Mídia | **Vercel Blob** ou **Cloudflare R2** via storage adapter do Payload | Uploads saem do servidor e o `sharp` gera tamanhos e formatos no upload |
| Animação | **GSAP** (`gsap`, `@gsap/react`, ScrollTrigger, SplitText, DrawSVG, Flip, CustomEase, todos gratuitos) + **Lenis** | Controle total do scroll |
| WebGL (pontual) | **OGL** (~10 KB), carregado sob demanda | Apenas no efeito de neblina do hero, sem Three.js |
| Formulário | Server Action + **Resend** + honeypot + rate limit | Sem plugin de terceiros |
| Deploy | **Vercel** + GitHub Actions (CI) | ISR, CDN global e previews por PR |

**Fluxo editorial:**
- a equipe publica no `/admin`;
- um hook `afterChange` do Payload chama `revalidateTag` e a notícia entra no ar em segundos, sem deploy;
- o **Live Preview** do Payload mostra a notícia com o design real antes de publicar;
- dois papéis de acesso: `admin` e `editor`.

**Collections do Payload:** `noticias`, `projetos`, `publicacoes` (PDF + capa), `videos`, `parceiros` (logo SVG), `pessoas` (diretoria e equipe), `paginas` (blocos flexíveis) e `midia`.
**Globals:** `site` (contatos, redes, CNPJ, endereço), `numeros` (os contadores da home) e `timeline` (marcos de 1983 a hoje).

### 3.1 Migração do WordPress (uma única vez, depois o WP é desligado)
Crie `scripts/migrate-wp.ts`:
1. Lê a REST API pública do site atual (`/wp-json/wp/v2/posts?_embed&per_page=100`, `pages` e `media`), com paginação.
2. Converte o HTML dos posts para o **Lexical** (rich text do Payload), limpando lixo do Elementor, emojis nos títulos e estilos inline.
3. Baixa cada imagem e a reprocessa com `sharp` (máx. 2400px, qualidade calibrada), depois sobe para o storage.
4. Preserva **slug, data de publicação e categoria** de cada notícia.
5. Gera `redirects.json` com todas as URLs antigas que mudarem. O `next.config` aplica 301.
6. Emite `migration-report.md` com contagem de posts e mídias, peso antes e depois, e posts com problema para revisão manual.

---

## 4. Conceito criativo: "O Tempo da Araucária"

A araucária leva décadas para dar pinhão, e o Vianei trabalha há mais de 40 anos no mesmo território. **O site é um documentário que se assiste com o scroll:** cada rolagem avança o tempo, da neblina da madrugada na Serra Catarinense à colheita do pinhão.

**Linguagem visual:** *impressionismo editorial*.
- A fotografia documental real ganha uma camada pictórica: neblina em WebGL no hero e um grão de papel animado sutil.
- Transições de cor acontecem como mudanças de luz ao longo do dia.
- A tipografia é gigante e sensível ao scroll, no tom de uma revista de natureza impressa que ganhou movimento.

**Tendências high-end aplicadas com intenção (não como enfeite):**
- tipografia display em escala extrema (até ~14vw), com **eixos da fonte variável animados pelo scroll** (peso e suavidade mudam enquanto o título passa);
- **SplitText** com reveal por linha e máscara, sempre com easing customizado e nunca `ease: "none"` em reveals;
- imagens com **reveal por `clip-path`** e parallax interno leve (a imagem se move dentro da moldura);
- **stacked cards** fixos que se empilham com escala e sombra;
- galeria **horizontal pinned**;
- lista de notícias com **preview de imagem que segue o cursor** (só desktop, `pointer: fine`);
- **transições de página** com a View Transitions API mais GSAP (cortina cor de terra que "varre" a tela);
- **botões magnéticos** e cursor contextual ("ver", "ler", "arrastar"), só em desktop;
- **marquee** de parceiros com velocidade ligada à velocidade do scroll;
- a **silhueta de uma araucária desenhada com DrawSVG** acompanha a página como um fio condutor e "cresce" conforme o progresso do scroll.

**Paleta: "luz do dia na serra"** (a cor de fundo transiciona entre capítulos):
| Token | Hex | Momento |
|---|---|---|
| `--neblina` | `#E9E6DF` | amanhecer, hero |
| `--papel` | `#F4EFE6` | leitura |
| `--musgo` | `#556621` | primária |
| `--oliva` | `#7D8E57` | secundária |
| `--mata` | `#1C2616` | noite na mata, seções escuras |
| `--pinhao` | `#8C3B24` | acento quente, CTAs |
| `--terra` | `#B5653A` | detalhes, cortina de transição |
| `--tinta` | `#22221E` | texto |
Valide contraste AA em toda combinação usada.

**Tipografia** (via `next/font`, self-hosted, variável, subsets `latin` e `latin-ext`):
- **Display:** Fraunces variável (eixos `opsz`, `wght`, `SOFT` e `WONK`), porque o eixo `SOFT` animado é a assinatura do site.
- **Texto e UI:** Inter Tight ou Geist, variável.
- Só 2 arquivos, com preload apenas do display.

**Direção de fotografia:** documental, com gente e mãos no trabalho, sem banco de imagens. O tratamento é unificado por um preset (leve dessaturação, sombras quentes e grão). Enquanto não houver fotos novas, use as melhores do acervo migrado. Liste em `ASSETS-NEEDED.md` as fotos que a equipe precisa produzir.

---

## 5. Scroll hijacking: especificação

O hijacking é o coração da experiência na **Home**, em **Quem somos** e no **topo de cada projeto**. Implemente assim:

- **Lenis** controla o scroll com inércia, e `lenis.on('scroll', ScrollTrigger.update)` roda no `gsap.ticker`, com `lagSmoothing(0)`.
- Os **capítulos** são seções `pin: true` com timelines em `scrub` (0.8 a 1.2). A rolagem não move a página: ela **avança a cena**, com texto entrando, foto trocando, cor de fundo mudando e a araucária crescendo.
- Nos momentos de "virada de capítulo", aplique um **snap suave** para os labels da timeline (`snap: { snapTo: "labelsDirectional", duration: {min: .3, max: .8}, ease: "power2.inOut" }`). O usuário sente que a página "trava" na cena certa, mas **nunca fica preso**, porque o scroll sempre responde.
- Um **indicador de progresso** do capítulo (fio fino com numeração "03 / 07") fica sempre visível.
- **Âncoras e teclado:** o menu leva direto a cada capítulo (`lenis.scrollTo`). Page Down, Espaço e setas funcionam, e o foco nunca vai parar em conteúdo fora da tela.
- **Mobile** (`gsap.matchMedia`): os pins ficam mais curtos. A galeria horizontal vira swipe com `scroll-snap` nativo, e a neblina WebGL vira imagem estática.
- **`prefers-reduced-motion: reduce`:** sem Lenis, sem pins e sem scrub. Tudo aparece no estado final, com fades de ≤ 200 ms.
- Páginas de leitura (notícia, publicações, contato) usam Lenis leve **sem pins**, porque ler texto não pode brigar com o scroll.

**Regras de engenharia do GSAP:**
- Todo efeito é um Client Component pequeno em `components/motion/` (`SplitReveal`, `ClipImage`, `PinnedChapter`, `HorizontalGallery`, `StackCards`, `DrawTree`, `Marquee`, `Counter`, `Magnetic`, `CursorPreview`, `PageTransition`).
- As páginas são Server Components que só compõem esses blocos.
- Os plugins são registrados em `lib/gsap.ts`. Use `useGSAP({ scope })` sempre, porque navegação client-side não pode deixar ScrollTrigger órfão. Chame `ScrollTrigger.refresh()` depois que fontes e imagens carregarem.
- Anime só `transform`, `opacity`, `clip-path` e variáveis de fonte, **nunca** `top/left/width/height`.
- Use `will-change` só durante a animação.
- O conteúdo precisa existir no HTML do servidor (SEO). A animação parte de um estado aplicado via classe `js-ready`, para não haver flash nem conteúdo invisível sem JS.

---

## 6. Roteiro da Home (7 capítulos)

1. **Amanhecer (hero, pinned):**
   - Neblina WebGL (OGL, shader de ruído, ≤ 15 KB, lazy após o LCP) sobre a foto de araucárias.
   - O título *"Educação popular e agroecologia no Planalto Catarinense"* se revela linha a linha, e o eixo `SOFT` da Fraunces "derrete" enquanto a neblina se dissipa com o scroll.
   - O LCP é a **foto**, não o canvas.
2. **Manifesto:** a frase de Paulo Freire, *"Ninguém nasce feito, é experimentando-nos no mundo que nós nos fazemos."*, com as palavras acendendo uma a uma no scrub, sobre fundo `--mata`.
3. **Desde 1983 (timeline horizontal pinned):**
   - Marcos vindos do global `timeline`: Projeto Vianei (1983), AVICITECS (1988), cooperativas de crédito, Casas Familiares Rurais, SAT Pinhão, Restaurar, Da Terra à Mesa…
   - Os anos aparecem em tipografia gigante vazada, e as fotos entram em profundidade.
4. **O que fazemos (stacked cards):** Educação popular · Agroecologia · Restauração florestal · Cultura e SAT Pinhão. Cada card tem foto em clip-path reveal e link para a área.
5. **Números:** contadores do global `numeros` (anos de atuação, hectares em restauração, projetos e parceiros). Os valores ficam editáveis no painel, **nunca inventados no código**.
6. **Agora no território:** as 3 últimas notícias e os projetos ativos, com lista e preview de imagem seguindo o cursor.
7. **Quem caminha junto:** marquee de parceiros e apoiadores (MISEREOR, IBAMA, WWF-Brasil, CEPAGRO, CETAP, AS-PTA, UFSC, UDESC, IFSC…), seguido do CTA de contato e do rodapé com o ano automático.

**Outras rotas:**
```
/quem-somos                       história (hijacking), missão, diretoria, equipe, estatuto (PDF)
/atuacao/[area]                   4 áreas
/projetos  ·  /projetos/[slug]    capa pinned + conteúdo em blocos
/noticias  ·  /noticias/[slug]    lista paginada, filtros, busca; slug idêntico ao do WP
/publicacoes                      biblioteca com capa, ano e download (capa otimizada, nunca o PNG original)
/videos                           facade do YouTube (thumbnail até o clique), sem API key: RSS do canal
/parceiros  ·  /contato
/admin                            painel Payload
```

---

## 7. Performance: orçamento que reprova o PR

| Métrica (mobile, Lighthouse, 4G lento) | Meta |
|---|---|
| Performance / Acessibilidade / Boas práticas / SEO | ≥ 95 / 100 / 100 / 100 |
| LCP | < 2,0 s |
| CLS | < 0,05 |
| INP | < 150 ms |
| JS inicial da home (gzip) | < 180 KB (GSAP + Lenis incluídos; OGL fora, porque é lazy) |
| Peso da home no primeiro carregamento | < 1,5 MB (hoje ~42 MB) |
| Imagem LCP | < 180 KB AVIF |

**Técnicas:**
- `next/image` em tudo, com AVIF/WebP, `sizes` corretos, `priority` só no LCP e blur placeholder.
- O Payload gera os tamanhos no upload e **recusa arquivos > 15 MB**, com aviso amigável ao editor.
- Imagens abaixo da dobra só carregam perto do viewport, e os capítulos fora da tela não inicializam timelines pesadas até se aproximarem (`ScrollTrigger` com `onEnter` de pré-carga).
- WebGL, cursor customizado e page transitions entram por `dynamic(() => import(...), { ssr: false })`.
- Vídeos usam facade e mapas usam imagem estática com link.
- Rotas públicas são estáticas com ISR (`revalidateTag` via hook do Payload), e o painel `/admin` nunca entra no bundle público.
- CI no GitHub Actions: lint, typecheck, build, **Lighthouse CI com budgets**, **axe** (Playwright) e `@next/bundle-analyzer` com relatório no PR.

---

## 8. SEO e acessibilidade

- Redirects 301 vindos do `redirects.json` da migração, e **nenhuma URL antiga pode dar 404**.
- `sitemap.ts` e `robots.ts` dinâmicos, Metadata API por página e `opengraph-image.tsx` gerado com a marca.
- JSON-LD: `NGO` (CNPJ 78.492.261/0001-63, endereço, redes), `NewsArticle` e `BreadcrumbList`.
- `lang="pt-BR"`, um `h1` por página, skip link e foco visível desenhado (não o padrão do navegador).
- O campo `alt` é **obrigatório** na collection de mídia.
- WCAG 2.2 AA. Tudo o que é animado continua legível e navegável sem animação.
- **Pendências de conteúdo para a equipe** (liste em `CONTENT-TODO.md` e não invente dados):
  - diretoria e mandato atuais;
  - números da home;
  - ID do canal do YouTube;
  - fotos novas;
  - texto revisado de "Quem somos";
  - quais e-mails podem ser públicos.

---

## 9. Estrutura

```
src/
  app/
    (site)/layout.tsx            Lenis, header, footer, PageTransition
    (site)/page.tsx              home (compõe capítulos)
    (site)/noticias/[slug]/page.tsx
    (payload)/admin/[[...segments]]/…
    (payload)/api/[...slug]/…
  collections/  globals/         schemas do Payload
  components/
    motion/                      primitivas GSAP ('use client')
    chapters/                    capítulos da home e de Quem somos
    ui/                          tipografia, botões, grid
  lib/ gsap.ts  lenis.ts  seo.ts  payload.ts
scripts/ migrate-wp.ts  optimize-media.ts
DECISIONS.md  CONTENT-TODO.md  ASSETS-NEEDED.md
```

---

## 10. Fases (um PR por fase, cada um com prints, vídeo curto do scroll e relatório do Lighthouse)

1. **Fundação:** Next, TS, Tailwind v4, tokens, fontes, Lenis, GSAP, reduced motion, CI com budgets.
2. **Payload:** collections, globals, papéis, storage de mídia, Live Preview e revalidação.
3. **Migração:** `migrate-wp.ts`, relatório e redirects.
4. **Sistema de motion:** todas as primitivas de `components/motion/`, com página interna `/lab` (bloqueada em produção) para testar cada uma isoladamente.
5. **Home e Quem somos:** capítulos com hijacking completo e suas versões mobile e reduced motion.
6. **Páginas de conteúdo:** notícias, projetos, publicações, vídeos, parceiros, contato.
7. **Polimento e lançamento:** ajuste de easing e timing, auditoria de performance até bater o orçamento, checklist de DNS, desligamento do WordPress e plano de rollback.

---

## 11. Critérios de aceite

- [ ] Não existe WordPress no projeto final: conteúdo, painel e mídia rodam no app Next.
- [ ] A equipe cria uma notícia com foto em `/admin` e ela aparece no site em segundos, sem deploy.
- [ ] Todas as notícias antigas foram migradas, com a mesma URL ou com 301.
- [ ] Home com < 1,5 MB no primeiro carregamento, LCP < 2 s e Lighthouse mobile ≥ 95.
- [ ] O hijacking roda a 60 fps em um notebook médio, sem travar trackpad nem teclado.
- [ ] Com `prefers-reduced-motion`, nenhum pin ou scrub, e todo o conteúdo acessível.
- [ ] Zero erros do axe e do console, testado em Safari iOS, Chrome Android, Chrome, Firefox e Safari desktop.
