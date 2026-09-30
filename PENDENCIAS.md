# Pendências — Centro Vianei

Itens que dependem da equipe ou de uma decisão antes de publicar. Nada disso foi inventado no site.
(Muitos vêm do `CONTENT-TODO.md` do site em Payload, branch `fase-6-conteudo`.)

## Conteúdo (pedir à equipe)
- [ ] **Diretoria e mandato atuais.** O site mostra a diretoria eleita em 11/11/2022, com mandato de
      08/02/2023 a 07/02/2026 (já vencido). Confirmar a nova composição (`conteudo/paginas/quem-somos.md`).
- [ ] **Números da home** (hectares em restauração, famílias, municípios…): o conceito prevê uma seção de
      números, mas ela só entra com dados confirmados pela equipe. Hoje a home não tem números.
- [ ] **Texto revisado de "Quem somos".** A home antiga cita a assembleia de 2020 e "Quem somos" a de 2022.
- [ ] **E-mails públicos.** O site antigo expunha e-mails pessoais da equipe; o novo mostra só
      `contato@vianei.org.br`. Confirmar quais podem aparecer.
- [ ] **Linha do tempo (home):** só há três marcos com fonte (1983, 1988, hoje). Mandar outros marcos
      (ano, título, uma frase e, se houver, foto) — entram em `site.json → home.secoes → marcos`.
- [ ] **Telefone público:** o site antigo não tinha; o campo está vazio em `site.json → contato.telefone`.
- [ ] **Perfis oficiais:** confirmar facebook.com/centrovianei, instagram.com/centrovianei e o canal do
      YouTube `UCkEIv_GvLhWyFuYBl_y5i8w`.
- [ ] **Classificação das notícias por tema** (Agroecologia, Educação popular…): veio da classificação
      automática da fase 6 (`extraido/curadoria/classificacao.md`). Revisar.
- [ ] **Resumo do Projeto Restaurar** e dos outros projetos: os resumos e subtítulos dos cartões foram
      montados a partir do texto de cada projeto. Conferir.
- [ ] **Textos alternativos das fotos das notícias:** ~180 imagens vieram do WordPress sem descrição;
      quando havia legenda ("Foto 2. …") ela virou o texto alternativo; nas outras o texto é
      "Foto da notícia “…”". Descrever as principais.
- [ ] **Capas dos projetos:** usam fotos de campo do acervo (e não os logotipos do site antigo).
      Confirmar ou mandar fotos próprias de cada projeto.
- [ ] **Fotos novas** (ver `ASSETS-NEEDED.md` na fase 6): araucárias na neblina para a abertura, retratos
      da equipe, fotos de época (1983–2000) para a linha do tempo.
- [ ] **Logotipo em vetor (SVG):** o menu mostra o nome "Centro Vianei" em texto; o logotipo colorido
      aparece no rodapé. Com um SVG de uma cor dá para usá-lo também no menu.
- [ ] **Downloads:** a antiga seção "Downloads" só tinha "Lorem ipsum" (arquivos de teste); ela não foi
      migrada e os endereços levam a /publicacoes/. Definir se haverá outros arquivos.
- [ ] **Websérie Da Terra à Mesa:** a galeria antiga mostrava os episódios 3 a 8. Mandar os links dos
      episódios 1 e 2, se houver. Dois vídeos da galeria antiga (`iApGiVdA5RY`, "ep6… a rede que protege
      polinizadores", e `m1K6t_XT8nM`, "ep5…", segunda versão) não existem mais no YouTube (miniatura e
      oEmbed respondem 404 em 30/09/2026): ficaram de fora. Se foram republicados, mandar o link novo.
- [ ] **Datas das publicações:** o site antigo mostrava a data de envio ao WordPress como "data da
      publicação" (ex.: a Coletânea Pixurum 1989–2000 aparecia como agosto de 2025). O site novo não mostra
      essas datas; se a equipe quiser, informar o ano de cada publicação.

## Dados pessoais (LGPD)
- [ ] **Nomes e celulares de pessoas nas notícias**: "Diagnóstico da cadeia produtiva do pinhão…" (lista de
      produtores e contatos, com vários celulares (49) 9…) e "Plano de ação… PRODUTO 5" (nomes de participantes
      e contatos) republicam dados pessoais que estavam no site antigo. A equipe deve confirmar se essas pessoas
      autorizaram a publicação; se não, remover os telefones (e, se for o caso, os nomes) desses textos.

## Direitos autorais e reproduções
- [ ] **Citação de Paulo Freire** ("Ninguém nasce feito…"), que estava em "Quem somos": não foi
      reproduzida (texto de terceiro). Pode voltar se a equipe quiser a citação, com a devida autoria.
- [ ] **Matérias de outros veículos reproduzidas nas notícias** (ex.: Mongabay em "Coletando pinhão…",
      entrevista do Pró-Espécies com Braulio Dias, Embrapa sobre enxertia, "Ser sustentável" com "Fonte
      da matéria"): foram mantidas porque já estavam publicadas no site do Vianei, com a fonte. Confirmar
      que há autorização para o texto (a de fotos foi dada em 26/09/2026) ou trocar por um resumo + link.
- [ ] **Trecho da Wikipédia** em "Consumidores e Agricultores em Rede" (definição de agroecologia): licença
      CC BY-SA, mantido com a fonte.

## Técnico / publicação
- [ ] **Deploys na Vercel desligados** para os branches `fabrica` e `prints` (`vercel.json → git.deploymentEnabled`),
      porque a conta Hobby atingiu o limite diário. Para ver a prévia, ligar `fabrica` (trocar para `true`)
      quando houver cota — ou usar os prints do workflow Prints.
- [ ] **Domínio:** `site.json → url` já é `https://vianei.org.br`. Na troca, apontar o domínio para a
      hospedagem nova; os 77 redirects (endereços do WordPress) estão em `redirects.json`.
- [ ] **Formulário de contato:** usa o Formsubmit com `contato@vianei.org.br`. A primeira mensagem enviada
      pede a ativação por e-mail (clicar no link que chega nessa caixa). Se preferir o formulário do
      Tombo CMS, trocar `contato.formEndpoint`.
- [ ] **package-lock.json** foi apagado ao trocar as fontes (sem npm aqui); o workflow Qualidade gera um novo
      e faz o commit automático.
- [ ] **PDFs grandes:** as publicações vão como estavam no site antigo (ver tamanhos em
      `extraido/curadoria/baixar.resultado.json`). Se algum pesar demais, gerar uma versão comprimida.

## Fora do site (de propósito)
- Seção "Downloads" com Lorem ipsum; bloco de vídeos que mostrava "No API Key Entered".
- Página "Obrigado" (o formulário novo responde na própria página) — o endereço leva a /contato/.
- Publicação repetida "Construção social dos mercados no sul do Brasil" (2020): mesmo PDF da edição
  de 2025; o endereço antigo leva a ela (pedido da equipe na fase 3).
- Páginas de anexo do WordPress (fotos de WhatsApp) — levam à notícia.

## Avisos do controle de qualidade (justificados)
- **Títulos longos** (59 notícias): são os títulos originais das matérias; não foram encurtados para
  não mudar o sentido. A equipe pode encurtar no CMS.
- **Cobertura de conteúdo abaixo de 70%** em `quem-somos`, `home`, `publicacoes`, `fale-conosco` e
  `obrigado`: os textos institucionais foram reorganizados em capítulos (a lista a–p virou etapas,
  a diretoria virou o bloco de pessoas, o endereço ganhou pontuação), sem mudar fatos. "Obrigado" era
  a mensagem automática do formulário antigo (fala em "orçamento") e não foi reproduzida.
