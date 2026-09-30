# Direção de arte — Centro Vianei de Educação Popular

> Status: **aprovada** — é o conceito "O Tempo da Araucária", aprovado pela equipe nas fases 1–6
> do site em Payload (branches `fase-*`, ver `docs/PROMPT.md` e `DECISIONS.md` lá). Aqui ele foi
> **adaptado ao molde da fábrica** (tokens, seções e motor de movimento), com acabamento no
> nível do Tombô. Nada da identidade do Tombô ou de outro cliente foi reutilizado.

## 1. Conceito — "O Tempo da Araucária"

A araucária leva décadas para dar pinhão, e o Vianei trabalha há mais de 40 anos no mesmo
território. O site é lido como **um dia na Serra Catarinense**: começa no amanhecer (hero com a
floresta de araucárias contra o céu), passa pela luz de papel e neblina das seções de leitura e
volta à mata escura nos capítulos de memória e no rodapé.

Como o conceito aparece:
- **Seções alternam mata (escuro) e papel (claro)**, como a luz ao longo do dia; o verde-limão do
  logotipo é a "luz" que acende detalhes (anos, fios de progresso, botões, cursor).
- **Rótulos numerados** "(01) Quem somos … (05) Notícias", como capítulos de um documentário.
- **Linha do tempo "Desde 1983"** (seção nova e genérica `marcos`): os anos aparecem apagados e
  se preenchem de baixo para cima com a rolagem — o tempo que a araucária leva para crescer.
- **Marca gráfica**: uma araucária estilizada em traço (candelabro) usada como ornamento na faixa
  de parceiros, no rodapé e no favicon (`site.json → marca`).
- A abertura diz "Amanhecendo" enquanto carrega; o 404 fala em "trilha".

## 2. Hero

- **Palavra gigante:** Vianei (Fraunces leve, caixa baixa).
- **Frase em itálico:** "Educação popular e agroecologia desde 1983." — o lema do logotipo.
- **Ao abrir em tela cheia:** "No tempo da araucária, *aprender junto com quem vive da terra.*"
  (frase de efeito; não afirma fatos novos).
- **Fotos que passam no círculo:** pinha aberta → caminhada no campo com araucárias → mudas no
  viveiro → sapecada de pinhão → **floresta de araucárias ao amanhecer** (foto final, em cor).

## 3. Paleta — "luz do dia na serra"

| Token | Cor | De onde veio |
|---|---|---|
| `--escuro` | `#1c2616` mata | `--mata` da direção aprovada (noite na mata) |
| `--claro` | `#f4efe6` papel | `--papel` da direção aprovada |
| `--claro-2` | `#e9e6df` neblina | `--neblina` (amanhecer) |
| `--destaque` | `#a8cf45` limão | verde-limão do logotipo e do site antigo |
| `--destaque-sobre-claro` | `#556621` musgo | `--musgo` (primária da direção aprovada) |
| `--apoio` | `#8c3b24` pinhão | `--pinhao` (acento quente) |

**Contrastes calculados (WCAG):**

| Combinação | Contraste | Resultado |
|---|---|---|
| Papel sobre mata | 13,7:1 | ✓ |
| Mata sobre limão | 8,7:1 | ✓ |
| Limão sobre mata | 8,7:1 | ✓ |
| Musgo sobre papel | 5,5:1 | ✓ |
| Musgo sobre neblina | 5,1:1 | ✓ |
| Limão sobre papel | 1,6:1 | ✗ → nas seções claras o acento vira musgo |

## 4. Tipografia (só duas famílias, como na direção aprovada)

| Papel no molde | Fonte | Pacote |
|---|---|---|
| Display (títulos) | Fraunces variável, eixo óptico (`opsz`), peso 360, **caixa baixa** | `@fontsource-variable/fraunces` (`opsz.css`) |
| Serifa itálica (acentos) | Fraunces itálico | `@fontsource-variable/fraunces` (`opsz-italic.css`) |
| Texto | Inter Tight variável | `@fontsource-variable/inter-tight` |
| "Mono" (rótulos, metadados) | Inter Tight em caixa-alta espaçada (não há mono no conceito) | idem |

- Fraunces não tem eixo de largura: `--display-largura: 100%`.
- O molde ganhou tokens genéricos para display em caixa baixa e de outra família
  (`--font-display`, `--display-caixa`, `--display-espaco`, `--display-entrelinha`).
- Títulos de notícias, cartões e intertítulos da prosa também em Fraunces (em `tema.css`).
- Faixa de parceiros em estilo `apagado` (fonte variável: o contorno cruzaria as letras).

## 5. Home, seção a seção

| # | Seção | Tema | Conteúdo |
|---|---|---|---|
| — | `hero` | escuro | Vianei + lema; fotos do acervo; floresta ao amanhecer em tela cheia |
| 01 | `manifesto` | claro | quem somos (texto do site antigo); foto do extrativista na araucária |
| 02 | `marcos` (nova, genérica) | escuro | 1983 Projeto Vianei · 1988 AVICITECS · Hoje, em rede |
| 03 | `colecao` | claro | os 5 projetos na horizontal |
| 04 | `colagem` | escuro | "No Planalto Catarinense, do campo à cidade" + público atendido; 5 fotos |
| 05 | `destaques` | claro | "Agora no território": 3 notícias recentes com foto |
| — | `faixa` | claro | "Quem caminha junto": nomes dos 20 apoiadores e parceiros |
| — | rodapé | escuro | "Quer somar ao trabalho no Planalto?" + logotipo colorido + e-mail |

Números da home (hectares, famílias…) **não entram**: dependem da equipe (ver PENDENCIAS.md).

## 6. Mapa do site

| Página nova | Vem de |
|---|---|
| `/` | home antiga (textos institucionais) |
| `/quem-somos/` | `/quem-somos/` + textos da home antiga (história, áreas, diretoria, equipe, parceiros) |
| `/projetos/` e 5 projetos | `/projetos/<slug>/` (mesmos endereços) |
| `/projetos/projeto-restaurar/` | também o mini-site `/projetos1/projeto-restaurar/…` (capítulos com âncoras) |
| `/noticias/` e 65 notícias | `/noticias/<slug>/` (mesmos endereços; 6 com emoji no endereço → endereço limpo) |
| `/publicacoes/` | `/publicacoes/` e as 14 páginas `/publicacoes/<slug>/` (→ `#slug`) |
| `/videos/` | `/galeria-de-videos/` + vídeos citados nas notícias |
| `/contato/` | `/fale-conosco/` e `/obrigado/` |

Todos os redirects: `redirects.json` (ver `PLANO.md`).

### Publicações e vídeos (como o CMS edita)
O Tombo CMS edita `paginas`, `projetos`, `noticias`, `site.json` e imagens. Por isso
**publicações e vídeos são páginas** (`conteudo/paginas/publicacoes.md` e `videos.md`) com um
bloco genérico novo, a **estante** (`<div class="covers">…`, ver `docs/BLOCOS.md`): capa, data,
autoria, título e botão "Baixar PDF"/"Assistir". Para acrescentar uma publicação, copia-se um
`<article class="cover">`, sobe-se a capa e o PDF (em `public/arquivos/`). Cada item tem `id`
igual ao endereço antigo, e `/publicacoes/<slug>/` leva direto a ele.

### Equipe, diretoria e parceiros
Em `/quem-somos/`, com os blocos `.people` (nome + função) e `.facts` (dados institucionais).
Sem e-mails pessoais (a equipe decide quais publicar).

## 7. Fotos

- **Tratamento:** `natural` (cor), hero em cor. A cor é conteúdo aqui (pinhão, mata, mudas).
- Fotos curadas pela equipe na fase 5 (`public/img/fotos/`, ≤ 300 KB): floresta ao amanhecer,
  araucária de Painel, pinha, catador, caminhada, mudas, oficina, mística, sapecada, festa da
  colheita, saída de campo, restauração, sementes.
- Capas dos projetos: fotos de campo em vez dos logotipos que o site antigo usava.
- Capas das notícias aparecem **inteiras** (`noticias.capaInteira`): muitas são cartazes.
- Logotipo colorido só no rodapé (fundo mata). No menu, o nome em Fraunces: o menu flutua com
  `mix-blend-mode: difference` e um logotipo colorido ficaria com as cores invertidas.

## 8. O que falta do cliente
Ver `PENDENCIAS.md`.
