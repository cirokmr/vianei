# Pendências de conteúdo (equipe do Centro Vianei)

Itens que dependem da equipe. Não inventar dados: o site mostra somente o que for confirmado aqui.

- [ ] **Diretoria e mandato atuais.** O site antigo mostra o mandato de 08/02/2023 a 07/02/2026, já vencido.
- [ ] **Números da home:** anos de atuação, hectares em restauração (o site cita 127 ha do Projeto Restaurar),
      número de projetos e de parceiros.
- [ ] **Texto revisado de "Quem somos".** A home antiga cita a assembleia de 2020 e "Quem somos" cita a de 2022.
- [ ] **Quais e-mails podem ser públicos.** Hoje os e-mails pessoais da equipe estão expostos; a proposta é usar
      `contato@vianei.org.br` + formulário.
- [ ] **Marcos da linha do tempo** (1983 → hoje) com ano, título e uma frase cada.
- [ ] **Downloads:** a seção atual tem "Lorem ipsum". Definir quais arquivos entram.
- [ ] **Confirmar perfis oficiais:** facebook.com/centrovianei, instagram.com/centrovianei e o canal do YouTube
      `UCkEIv_GvLhWyFuYBl_y5i8w`.

## Da migração do WordPress (ver `data/wp-export/migration-report.md`)

- [ ] **Descrever 180 imagens** que vieram sem texto alternativo. No painel: Imagens → filtro "Texto alternativo
      provisório".
- [x] ~~Revista ABEMA 8ª Edição~~: link de leitura online (fliphtml5), enviado em 26/09.
- [x] ~~Cartilha de gestão administrativa~~: PDF enviado em 26/09 (título corrigido para "…grupos de cooperação").
- [ ] **"Produção de pinhão em sistemas tradicionais…"**: aguardando o PDF PEAN0059 (cartilha nas páginas 175–190;
      `scripts/pdf-extract.py` gera o arquivo separado).
- [ ] **"Construção social dos mercados no sul do Brasil" (2020):** o botão aponta para uma imagem (capa), não para o PDF.
- [x] ~~Projeto "Da Terra à Mesa"~~: em andamento (a websérie foi concluída). A situação dos projetos não aparece no
      site por enquanto.
- [x] ~~Fotos de outros sites~~ (Cepagro, Mongabay…): uso autorizado em 26/09. Falta só baixá-las: rodar
      `npm run wp:import` numa rede sem bloqueio.
