# Pendências de conteúdo (equipe do Centro Vianei)

Itens que dependem da equipe. Não inventar dados: o site mostra somente o que for confirmado aqui.

- [ ] **Diretoria e mandato atuais.** O site antigo mostra o mandato de 08/02/2023 a 07/02/2026, já vencido.
- [ ] **Números da home:** hectares em restauração (o site cita 127 ha do Projeto Restaurar), número de projetos,
      famílias atendidas etc. Os anos de atuação já são calculados automaticamente. Painel: Institucional →
      Números da home.
- [ ] **Texto revisado de "Quem somos".** A home antiga cita a assembleia de 2020 e "Quem somos" cita a de 2022.
- [ ] **Quais e-mails podem ser públicos.** Hoje os e-mails pessoais da equipe estão expostos; a proposta é usar
      `contato@vianei.org.br` + formulário.
- [ ] **Marcos da linha do tempo** (1983 → hoje) com ano, título e uma frase cada. Aparecem na home e em Quem
      somos assim que cadastrados no painel (Institucional → Linha do tempo), com foto opcional.
- [ ] **Downloads:** a seção atual tem "Lorem ipsum". Definir quais arquivos entram.
- [ ] **Confirmar perfis oficiais:** facebook.com/centrovianei, instagram.com/centrovianei e o canal do YouTube
      `UCkEIv_GvLhWyFuYBl_y5i8w`.

- [ ] **Revisar a classificação automática** das notícias (temas e projetos) e das áreas dos projetos:
      `data/wp-export/classificacao.md`. O que for mudado no painel não é sobrescrito.
- [ ] **Resumo do Projeto Restaurar:** hoje é "Arquivo download – PROJETO RESTAURAR – IBAMA – VIANEI" (veio assim
      do WordPress). Escrever uma frase de apresentação no painel (Projetos → Projeto Restaurar → Resumo).
- [ ] **Capas dos projetos:** "Saberes e Fazeres" e "Restaurar" usam o logotipo como capa; "Da Terra à Mesa" não
      tem capa. Uma foto de campo fica melhor na capa fixa da página do projeto.
- [ ] **E-mail do formulário de contato:** as mensagens já ficam no painel (Contato → Mensagens). Para receber
      aviso por e-mail, configurar SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) no Vercel.
- [ ] **Telefone público** (campo em Dados institucionais): aparece em /contato quando preenchido.

## Da migração do WordPress (ver `data/wp-export/migration-report.md`)

- [ ] **Descrever 180 imagens** que vieram sem texto alternativo. No painel: Imagens → filtro "Texto alternativo
      provisório".
- [x] ~~Revista ABEMA 8ª Edição~~: link de leitura online (fliphtml5), enviado em 26/09.
- [x] ~~Cartilha de gestão administrativa~~: PDF enviado em 26/09 (título corrigido para "…grupos de cooperação").
- [x] ~~"Produção de pinhão em sistemas tradicionais…"~~: cartilha extraída do PEAN0059 (págs. 175–190), 8 MB → 1,1 MB.
- [x] ~~"Construção social dos mercados no sul do Brasil" (2020)~~: o PDF enviado é idêntico ao da publicação de 2025; a entrada repetida (2020) foi removida a pedido da equipe; o endereço antigo redireciona para /publicacoes.
- [x] ~~Projeto "Da Terra à Mesa"~~: em andamento (a websérie foi concluída). A situação dos projetos não aparece no
      site por enquanto.
- [x] ~~Fotos de outros sites~~ (Cepagro, Mongabay…): uso autorizado em 26/09. Falta só baixá-las: rodar
      `npm run wp:import` numa rede sem bloqueio.
