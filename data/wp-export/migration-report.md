# Relatório da migração do WordPress

Snapshot: 2026-09-25T20:49:20.034Z · fonte: https://vianei.org.br · importado em 2026-09-25T21:49:25.861Z

## Conteúdo

| Tipo | No WordPress | Criados | Atualizados |
| --- | ---: | ---: | ---: |
| noticias | 65 | 0 | 65 |
| projetos | 5 | 0 | 5 |
| publicacoes | 14 | 0 | 14 |
| paginas | 10 | 0 | 7 |

As 3 páginas do mini-site que eram só menus (projetos1, projetos1/projeto-restaurar, projetos1/projeto-restaurar/projetos-de-assentamento) viraram redirects.

## Arquivos

- Imagens: **226** no site novo (0 nesta execução, 226 já existiam; falhas: 25)
- PDFs: **14** (0 nesta execução)
- Peso das imagens: **188.7 MB → 37.4 MB** (−80%), comparando o arquivo original do WordPress com o maior arquivo que o site novo guarda. Nas páginas, o site ainda serve versões menores (AVIF/WebP no tamanho da tela).
- Média por imagem: 855 KB → 170 KB

## Redirects 301: 44

Gerados em `src/redirects.json`. Todo endereço antigo de notícia, projeto, publicação e página leva ao novo.

## Para a equipe revisar

### Imagens sem texto alternativo (180)

Receberam um texto provisório (“Foto da notícia …”). No painel, em Imagens, filtre por
“Texto alternativo provisório” e descreva cada uma; a marcação some ao salvar.

- #223 Foto da notícia “Publicação apresenta iniciativas de abastecimento solidário desenvolvidas na pandemia com efeitos que se estendem ao atual cenário de fome no país .”: https://vianei.org.br/wp-content/uploads/2023/08/Captura-de-Tela-2023-08-17-as-16.05.23.png
- #222 Imagem da página “Galeria de Espécies”: https://vianei.org.br/wp-content/uploads/2025/12/Foto-Familias-Silvino-Painel-2-2022.jpg
- #221 Imagem da página “Canela-preta (Ocotea catharinensis)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Ocotea-catharinensis_page-0003.jpg
- #220 Imagem da página “Canela-preta (Ocotea catharinensis)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Ocotea-catharinensis_page-0002.jpg
- #219 Imagem da página “Canela-preta (Ocotea catharinensis)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Ocotea-catharinensis_page-0001.jpg
- #218 Imagem da página “Pixurum – Edição Projeto Restaurar”: https://vianei.org.br/wp-content/uploads/2026/04/pixurum-1-1.png
- #217 Imagem da página “Pixurum – Edição Projeto Restaurar”: https://vianei.org.br/wp-content/uploads/2026/04/pixurum-2-1.png
- #216 Imagem da página “Pixurum – Edição Projeto Restaurar”: https://vianei.org.br/wp-content/uploads/2026/04/pixurum-3-1.png
- #215 Imagem da página “Araucária (Araucaria angustifolia)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Araucaria-angustifolia_page-0003-1.jpg
- #214 Imagem da página “Araucária (Araucaria angustifolia)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Araucaria-angustifolia_page-0002-1.jpg
- #213 Imagem da página “Araucária (Araucaria angustifolia)”: https://vianei.org.br/wp-content/uploads/2026/03/Cartilha-de-identificacao-Araucaria-angustifolia_page-0001-1.jpg
- #212 Capa de “Cartilha de gestão administrativa para grupos de coordenação”: https://vianei.org.br/wp-content/uploads/2024/06/2006.jpg
- #211 Capa de “Prêmio BNDS de Boas Práticas para Sistemas Agrícolas Tradicionais”: https://vianei.org.br/wp-content/uploads/2024/06/Design-sem-nome-10.jpg
- #210 Capa de “Abastecimento Agroecológico de Consumidores Articulado com Soberania e Segurança Alimentar Nutricional”: https://vianei.org.br/wp-content/uploads/2023/03/livro-abastecimento-agroecologico-1.jpg
- #209 Capa de “Produção de pinhão em sistemas tradicionais no planalto serrano catarinense”: https://vianei.org.br/wp-content/uploads/2024/06/Design-sem-nome-9.jpg
- #208 Capa de “Pinhão na Culinária”: https://vianei.org.br/wp-content/uploads/2025/08/Livro-Embrapa.png
- #207 Capa de “Agrofloresta, aprendendo a produzir com a natureza”: https://vianei.org.br/wp-content/uploads/2025/08/Agrofloresta-UFPR-NEPEA.png
- #204 Capa de “Coletânia Pixurum, 1989 a 2000”: https://vianei.org.br/wp-content/uploads/2025/08/Coletania-Pixurum-1986-a-2000.png
- #203 Capa de “Construção social dos mercados no sul do Brasil”: https://vianei.org.br/wp-content/uploads/2025/08/Construcao-social-dos-mercados.png
- #202 Capa de “Agroecologia e gênero”: https://vianei.org.br/wp-content/uploads/2025/08/Agroecologia-e-genero-Centro-Vianei.png
- #201 Capa de “Catálogo fotográfico do Sistema Agrícola Tradicional (SAT) Pinhão”: https://vianei.org.br/wp-content/uploads/2026/09/capa-catalogo-fotografico-SAT-Pinhao.png
- #200 Imagem da página “Festa da Colheita do Pinhão 2023 celebra atividade extrativista e a conservação pelo uso das Araucárias”: https://vianei.org.br/wp-content/uploads/2023/05/Copia-de-banner-80x120cm.jpg
- #199 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-183309.png
- #198 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Avaliacao-da-oficina.png
- #197 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-183112.png
- #196 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-181551.png
- #195 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Foto-das-atividades.png
- #194 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-182941.png
- #193 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-182752.png
- #192 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Lista-de-presenca-02.png
- #191 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Lista-de-presenca-01.png
- #190 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Oficina-Pat-06.png
- #189 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-183551.png
- #188 Imagem da página “Plano de ação para potencialização da cadeia produtiva do pinhão, em formato digital PRODUTO 5 do contrato.”: https://vianei.org.br/wp-content/uploads/2023/11/Captura-de-tela-2023-11-20-183419.png
- #187 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-19.jpeg
- #186 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-18.jpeg
- #185 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-17.jpeg
- #184 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-16.jpeg
- #183 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-15.jpeg
- #182 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-14.jpeg
- #181 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-13.jpeg
- #180 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-12.jpeg
- #179 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-11.jpg
- #178 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-10.jpg
- #177 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-9.jpeg
- #176 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-8.jpeg
- #175 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-7.jpeg
- #174 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-6.jpeg
- #173 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-5.jpeg
- #172 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-3.jpeg
- #171 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-1.jpg
- #170 Imagem da página “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2-1.jpeg
- #169 Foto da notícia “Diagnóstico da cadeia produtiva do pinhão no território dos municípios de abrangência do Território Planalto Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia2.jpg
- #168 Foto da notícia “Formação sobre Abelhas Nativas Sem Ferrão fortalece as práticas agroecológicas e oferece alternativas para jovens da Região Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia3.jpg
- #167 Foto da notícia “Como avaliar os impactos gerados por um projeto de transformação social?”: https://vianei.org.br/wp-content/uploads/2023/05/Foto-PMA-oficina-Parana.png
- #166 Foto da notícia “Centro Vianei de Educação Popular promoveu no ultimo sábado, dia 18 de março de 2023, o encontro dos consumidores”: https://vianei.org.br/wp-content/uploads/2023/05/ID-Visual-Misereor-em-Rede-1.jpg
- #158 Imagem da página “Publicação apresenta iniciativas de abastecimento solidário desenvolvidas na pandemia com efeitos que se estendem ao atual cenário de fome no país .”: https://vianei.org.br/wp-content/uploads/2023/08/Captura-de-Tela-2023-08-17-as-16.05.43.png
- #157 Foto da notícia “Seminário Internacional pauta debate sobre a democratização de alimentos agroecológicos 22 de Maio, 2023”: https://vianei.org.br/wp-content/uploads/2023/05/Seminario-inter.png
- #156 Foto da notícia “ARAUCÁRIA! Teu nome é RESISTÊNCIA!”: https://vianei.org.br/wp-content/uploads/2023/05/Copia-de-FESTA-DA-COLHEITA-DO-PINHAO.jpg
- #155 Foto da notícia “A partir do mês de maio de 2023, o Centro Vianei de Educação Popular passa a integrar o Comité POP Rua Lages”: https://vianei.org.br/wp-content/uploads/2023/05/ID-Visual-Misereor-em-Rede.jpg
- #153 Foto da notícia “O Centro Vianei promove Oficina de preparo de oleatos com ervas medicinais Local: CRAS III Penha, Lages.”: https://vianei.org.br/wp-content/uploads/2023/06/ID-Visual-Misereor-em-Rede.png
- #150 Foto da notícia “Painel recebe equipamentos destinados à seleção do pinhão. Os moradores podem utilizar os equipamentos via agendamento.”: https://vianei.org.br/wp-content/uploads/2023/06/Painel-recebe-equipamentos-destinados-a-selecao-do-pinhao1.jpeg
- #149 Imagem da página “Seminário SAT Pinhão e III Festa da Colheita do Pinhão de São Joaquim foram um sucesso!”: https://vianei.org.br/wp-content/uploads/2024/04/IMG_6089.jpg
- #148 Foto da notícia “Relatório do Seminário virtual de integração entre os projetos dos núcleos de Santa Catarina e do Rio Grande do Sul”: https://vianei.org.br/wp-content/uploads/2023/03/noticia1.jpg
- #146 Foto da notícia “Oficina Pinhão na Culinária”: https://vianei.org.br/wp-content/uploads/2023/08/WhatsApp-Image-2023-07-12-at-16.30.33-1.jpeg
- #145 Foto da notícia “Oficina de Hortinhas com Garrafa Pet.”: https://vianei.org.br/wp-content/uploads/2023/08/ID-Visual-Misereor-em-Rede-2.jpg
- #142 Imagem da página “Seminário SAT Pinhão e III Festa da Colheita do Pinhão de São Joaquim foram um sucesso!”: https://vianei.org.br/wp-content/uploads/2024/04/caminhada.jpg
- #141 Imagem da página “Oficina direcionada à juventude foi realizada no Encontro Ampliado da Rede Ecovida de Agroecologia – EARE 2023”: https://vianei.org.br/wp-content/uploads/2023/11/oficina-EARE.png
- #140 Foto da notícia “Em 16/10 é celebrado o Dia Mundial da Alimentação.”: https://vianei.org.br/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-16-at-14.19.05.jpeg
- #139 Foto da notícia “Oficina direcionada à juventude foi realizada no Encontro Ampliado da Rede Ecovida de Agroecologia – EARE 2023”: https://vianei.org.br/wp-content/uploads/2023/11/CARD.jpeg
- #138 Imagem da página “Oficinas de Bioconstrução e saneamento ecológico promovida pelo Centro Vianei de Educação Popular e Casa de Barro SC.”: https://vianei.org.br/wp-content/uploads/2024/04/202404181115_capa.jpeg
- #137 Foto da notícia “Oficina de saneamento ecológico e bio construção. (Assentamento 1° de maio – Casa de Barro – Curitibanos SC)”: https://vianei.org.br/wp-content/uploads/2024/04/Card-midias-1.jpg
- #136 Foto da notícia “Oficinas de Bioconstrução e saneamento ecológico promovida pelo Centro Vianei de Educação Popular e Casa de Barro SC.”: https://vianei.org.br/wp-content/uploads/2024/04/Oficina-de-bioconstrucao-e-saneamento-ecologico.jpg
- #134 Foto da notícia “2ª Etapa da Oficina de Saneamento Ecológico e Bioconstrução! Centro Vianei e Casa de Barro!”: https://vianei.org.br/wp-content/uploads/2024/04/Oficina-de-bioconstrucao-e-saneamento-ecologico-1.jpg
- #133 Foto da notícia “Bioconstrução e saneamento ecológico. A terceira etapa do processo de construção e convivência. Centro Vianei e Casa de Barro.”: https://vianei.org.br/wp-content/uploads/2024/04/tres-etapas-da-bio-construcao-do-banheiro-seco-aqui-na-Casa-de-Barro-SC-Assentamento-1°-de-Maio-MST-Curitibanos.jpg
- #130 Foto da notícia “Seminário SAT Pinhão e III Festa da Colheita do Pinhão de São Joaquim foram um sucesso!”: https://vianei.org.br/wp-content/uploads/2024/04/tres-etapas-da-bio-construcao-do-banheiro-seco-aqui-na-Casa-de-Barro-SC-Assentamento-1°-de-Maio-MST-Curitibanos.-1.jpg
- #125 Foto da notícia “REVISTA ABEMA 8ª Edição – 2024.”: https://vianei.org.br/wp-content/uploads/2024/08/Capa-Revista-Abema.png
- #123 Foto da notícia “Sementes Crioulas: Guardiãs da Biodiversidade e da Agroecologia!”: https://vianei.org.br/wp-content/uploads/2024/09/image.png
- #122 Foto da notícia “O Centro Vianei promove no dia 13 de setembro a “Oficina de Enxertia de Araucária”.”: https://vianei.org.br/wp-content/uploads/2024/09/Design-sem-nome-4.jpg
- #121 Foto da notícia “Projeto em Rede impulsiona produção agroecológica no Sul do Brasil com foco em mulheres e juventude rural”: https://vianei.org.br/wp-content/uploads/2025/05/Logo-daterra-a-mesa-2-1.ai_.jpg
- #120 Foto da notícia “Série de Mini Docs do IMA a respeito do trabalho realizado pelo PAT Planalto Sul. Confira através do link da matéria!”: https://vianei.org.br/wp-content/uploads/2025/05/Doc-Pat.png
- #119 Imagem da página “Centro Vianei participa de oficina para construção coletiva de indicadores de avaliação para projetos de restauração da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/07/Oficina-Abelardo-2.jpeg
- #118 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Publico-presente-na-Oficina-realizada-no-projeto-Da-Terra-a-mesa-no-municipio-de-Sao-Joaquim-2.jpg
- #117 Imagem da página “Centro Vianei participa de oficina para construção coletiva de indicadores de avaliação para projetos de restauração da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/07/Oficina-Abelardo-3.jpeg
- #116 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Publico-presente-na-Oficina-realizada-no-projeto-Da-Terra-a-mesa-no-municipio-de-Sao-Joaquim-1.jpg
- #114 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Publico-presente-na-Oficina-realizada-no-projeto-Da-Terra-a-mesa-no-municipio-de-Sao-Joaquim.jpg
- #113 Foto da notícia “Centro Vianei participa de oficina para construção coletiva de indicadores de avaliação para projetos de restauração da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/07/capa-Oficina-Abelardo-1.jpg
- #112 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Nilton-Nunes-de-Jesus-extensionista-da-EPAGRI.jpg
- #111 Imagem da página “20ª Feira Regional de Sementes Crioulas e da Agrobiodiversidade”: https://vianei.org.br/wp-content/uploads/2025/09/reuniao-com-MDA.jpg
- #110 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Elaine-Vicente.jpg
- #109 Foto da notícia “Centro Vianei realiza Oficina sobre Mercados Institucionais, Políticas Públicas e Plano Safra 2025/2026”: https://vianei.org.br/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-21-at-11.54.24.jpeg
- #108 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Claudia-Aparecida-Cordova-Barbosa-da-Secretaria-Municipal-de-Educacao.jpg
- #107 Imagem da página “Oficina sobre Políticas Públicas no Município de Painel/SC .”: https://vianei.org.br/wp-content/uploads/2025/07/Foto-02-Oficina-Painel-SC.png
- #105 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/equipe-da-Secretaria-Municipal-de-Agricultura.jpg
- #104 Foto da notícia “Oficina sobre Políticas Públicas no Município de Painel/SC .”: https://vianei.org.br/wp-content/uploads/2025/08/Oficina-em-Painel-SC.png
- #103 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Carolina-Couto.jpg
- #102 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Engenheira-Agronoma-Julia-Goetten-Wagner.jpg
- #101 Foto da notícia “Projeto que fortalece agroecologia no Sul do Brasil será lançado em Feira de Sementes Crioulas no PR”: https://vianei.org.br/wp-content/uploads/2025/08/11.png
- #100 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Engenheiro-Agronomo-Fabio-Anderson.jpg
- #98 Imagem da página “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/Eng.-Agronoma-Cintia-Hoffer.jpg
- #97 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.03-1.jpeg
- #96 Foto da notícia “20ª Feira Regional de Sementes Crioulas e da Agrobiodiversidade”: https://vianei.org.br/wp-content/uploads/2025/09/12.png
- #95 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.03.jpeg
- #94 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.23.36.jpeg
- #93 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.02-2.jpeg
- #92 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.19.23.jpeg
- #91 Foto da notícia “Realizada a 2a oficina do Projeto “Da Terra à Mesa”, no município de São Joaquim”: https://vianei.org.br/wp-content/uploads/2025/10/2a-oficina.png
- #90 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.02-1.jpeg
- #89 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.20.01.jpeg
- #88 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.02.jpeg
- #87 Imagem da página “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-15.06.14.jpeg
- #86 Imagem da página “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-15-at-14.41.01-1.jpeg
- #85 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.20.47.jpeg
- #84 Imagem da página “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-15.06.14-2.jpeg
- #83 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.21.32.jpeg
- #82 Foto da notícia “Oficina do Projeto Da Terra à Mesa realizada no município de São José do Cerrito”: https://vianei.org.br/wp-content/uploads/2025/10/outra-oficina.png
- #81 Imagem da página “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-15.06.14-1.jpeg
- #79 Imagem da página “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-15.06.13.jpeg
- #78 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.21.45.jpeg
- #76 Imagem da página “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-15.06.19.jpeg
- #75 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.22.46.jpeg
- #74 Foto da notícia “Técnicos do Centro Vianei participam de seminário sobre manejo e controle de taquaras”: https://vianei.org.br/wp-content/uploads/2025/10/9.png
- #73 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.23.10.jpeg
- #72 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep8-pre.png
- #71 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.18.54.jpeg
- #70 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.18.28.jpeg
- #69 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.18.13.jpeg
- #67 Imagem da página “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-10-at-23.17.56.jpeg
- #65 Foto da notícia “3a oficina do Projeto “Da Terra à Mesa” junto à Conferência Territorial da Serra Catarinense, em Lages”: https://vianei.org.br/wp-content/uploads/2025/11/oficina-mda.png
- #63 Imagem da página “Viveiro do Centro Vianei abastece Projeto Restaurar com mudas nativas da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/12/viveireista.jpeg
- #62 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep7-pre.png
- #61 Imagem da página “Viveiro do Centro Vianei abastece Projeto Restaurar com mudas nativas da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/12/viveiro.jpeg
- #60 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep6-pre.png
- #59 Imagem da página “Viveiro do Centro Vianei abastece Projeto Restaurar com mudas nativas da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/12/araucaria-viveiro.jpeg
- #58 Foto da notícia “Viveiro do Centro Vianei abastece Projeto Restaurar com mudas nativas da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2025/12/8.png
- #57 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep5-pre.png
- #56 Foto da notícia “Encontro celebra resultados do Projeto Terra a Mesa MDA – Centro Vianei, em Cerro Negro.”: https://vianei.org.br/wp-content/uploads/2025/12/encontro-mulheres-cerro-negro.png
- #55 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep4-pre.png
- #54 Foto da notícia “Cooperativa Ecoserra celebra 25 anos de cooperação e fortalecimento da agricultura familiar”: https://vianei.org.br/wp-content/uploads/2025/12/ecoserra-25-anos.png
- #53 Foto da notícia “Oficina fortalece protagonismo feminino e amplia acesso ao PNAE em Capão Alto”: https://vianei.org.br/wp-content/uploads/2026/02/imagem-destaque-site-centro-vianei-800x583px-1.png
- #52 Imagem da página “Parceria com produtores fortalece ações do Projeto Restaurar no viveiro do Centro Vianei”: https://vianei.org.br/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-26-at-20.03.19.jpeg
- #50 Imagem da página “Parceria com produtores fortalece ações do Projeto Restaurar no viveiro do Centro Vianei”: https://vianei.org.br/wp-content/uploads/2026/04/mudas-entrega.jpg
- #48 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep3-pre.png
- #46 Foto da notícia “Parceria com produtores fortalece ações do Projeto Restaurar no viveiro do Centro Vianei”: https://vianei.org.br/wp-content/uploads/2026/04/2.png
- #44 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep2-pre.png
- #42 Imagem da página “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/capa-ep1-pre.png
- #41 Imagem da página “Projeto Da Terra à Mesa realiza oficina sobre agricultura familiar e sociobiodiversidade do pinhão em Bom Retiro”: https://vianei.org.br/wp-content/uploads/2026/07/Foto-4.-Apresentacao-sobre-a-estruturacao.jpeg
- #40 Foto da notícia “Projeto “Da Terra à Mesa” promove formação sobre políticas públicas para agricultores da Serra Catarinense”: https://vianei.org.br/wp-content/uploads/2026/05/imagem-destaque-site-centro-vianei-800x583px-4.png
- #39 Imagem da página “Projeto Da Terra à Mesa realiza oficina sobre agricultura familiar e sociobiodiversidade do pinhão em Bom Retiro”: https://vianei.org.br/wp-content/uploads/2026/07/Foto-3.-Charles-Grutner-e-Agenor-Scarabelot.jpeg
- #38 Foto da notícia “Websérie apresenta tecnologias sociais que fortalecem a agroecologia no Sul do Brasil”: https://vianei.org.br/wp-content/uploads/2026/05/imagem-destaque-webserie.png
- #37 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/PA-Vida-Nova-Santa-Cecilia.jpg
- #36 Imagem da página “Projeto Da Terra à Mesa realiza oficina sobre agricultura familiar e sociobiodiversidade do pinhão em Bom Retiro”: https://vianei.org.br/wp-content/uploads/2026/07/Foto-2.-Atividade-participativa.jpeg
- #35 Foto da notícia “Centro Vianei participa de encontro com entidades executoras de projetos de restauração da Mata Atlântica”: https://vianei.org.br/wp-content/uploads/2026/06/IMG_20260527_145525408_HDR-scaled.jpg
- #34 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Florestan-Fernandes-Monte-Carlo.jpg
- #32 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Primeiro-de-Maio-Curitibanos.jpg
- #31 Foto da notícia “Projeto Da Terra à Mesa realiza oficina sobre agricultura familiar e sociobiodiversidade do pinhão em Bom Retiro”: https://vianei.org.br/wp-content/uploads/2026/07/destaque-da-terra-a-mesa-bom-retiro.png
- #30 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Indio-Galdino-Curitibanos.jpg
- #29 Imagem da página “Oficina do projeto Da Terra à Mesa orienta agricultores sobre o Programa Nacional de Crédito Fundiário”: https://vianei.org.br/wp-content/uploads/2026/07/ecoserra-4-e1783074339523.jpeg
- #27 Imagem da página “Oficina do projeto Da Terra à Mesa orienta agricultores sobre o Programa Nacional de Crédito Fundiário”: https://vianei.org.br/wp-content/uploads/2026/07/ecoserra-3-e1783074275322.jpeg
- #26 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Butia-Verde-Fraiburgo.jpg
- #23 Imagem da página “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Sao-Joao-Maria-II-Fraiburgo-1.jpg
- #20 Foto da notícia “Projeto Restaurar apresenta novo projeto finalístico aos assentamentos beneficiários”: https://vianei.org.br/wp-content/uploads/2026/08/Sao-Joao-Maria-II-Fraiburgo.jpg
- #19 Foto da notícia “Oficina em Capão Alto debate políticas públicas e fortalecimento da agricultura familiar”: https://vianei.org.br/wp-content/uploads/2026/06/capa-com-logo.png
- #18 Foto da notícia “Oficina do projeto Da Terra à Mesa orienta agricultores sobre o Programa Nacional de Crédito Fundiário”: https://vianei.org.br/wp-content/uploads/2026/07/capa-lages.png
- #16 Foto do projeto “Projeto Consumidores e Agricultores em Rede – Apoio Misereor da Alemanha”: https://vianei.org.br/wp-content/uploads/2023/03/projeto-misereor-rede1.jpg
- #15 Foto do projeto “Projeto Pró Espécies”: https://vianei.org.br/wp-content/uploads/2023/03/projeto-proespecies1.jpg
- #14 Foto do projeto “Projeto Restaurar”: https://vianei.org.br/wp-content/uploads/2023/03/projeto-restaurar1.jpg
- #13 Imagem da página “Programa Saberes e Fazeres do Pinhão”: https://vianei.org.br/wp-content/uploads/2023/06/Screenshot-2023-06-14-at-11.21.43.png
- #12 Imagem da página “Programa Saberes e Fazeres do Pinhão”: https://vianei.org.br/wp-content/uploads/2023/06/Screenshot-2023-06-14-at-11.13.44.png
- #11 Imagem da página “Programa Saberes e Fazeres do Pinhão”: https://vianei.org.br/wp-content/uploads/2023/06/Screenshot-2023-06-14-at-11.07.28.png
- #10 Imagem da página “Programa Saberes e Fazeres do Pinhão”: https://vianei.org.br/wp-content/uploads/2023/06/Screenshot-2023-06-14-at-11.03.53.png
- #9 Foto do projeto “Programa Saberes e Fazeres do Pinhão”: https://vianei.org.br/wp-content/uploads/2023/06/Design-sem-nome-3.jpg
- #8 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/BARRA-logos-MDA-2026.png
- #7 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/ironiuza.jpg
- #6 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/spdagora.png
- #5 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/tres-arroios.png
- #4 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/teixeira-soares.png
- #3 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/tekoa-pora.png
- #2 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/sjose-cerrito-sc.png
- #1 Imagem da página “Da Terra à Mesa | MDA”: https://vianei.org.br/wp-content/uploads/2025/03/areas-de-abrangencia.png

### Avisos (5)

- publicação sem PDF na home: "REVISTA ABEMA 8ª Edição. Associação Brasileira de Entidades Estaduais de Meio Ambiente."
- publicação sem PDF na home: "Produção de pinhão em sistemas tradicionais no planalto serrano catarinense."
- publicação sem PDF na home: "Cartilha de gestão administrativa para grupos de coordenação."
- projeto sem situação no WP (marcado como concluído): Da Terra à Mesa | MDA
- publicação aponta para um arquivo que não é PDF (https://vianei.org.br/wp-content/uploads/2024/06/Capa-livro.jpeg): Construção social dos mercados no sul do Brasil

### Imagens não importadas (25)

Rode `npm run wp:import` de novo numa rede sem bloqueios: o import é idempotente e só baixa o que falta.

- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145749/20220603_fellipeabreu_santacatarina_129484.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8839-Copy.jpg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145727/20220530_fellipeabreu_santacatarina_128946.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8585-Copy.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-12.10.25.jpeg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05180237/20220604_fellipeabreu_santacatarina_130108.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-12.15.17.jpeg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145742/20220531_fellipeabreu_santacatarina_129195.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-12.18.09.jpeg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145800/20220604_fellipeabreu_santacatarina_130026.jpeg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-12.26.43.jpeg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145739/20220531_fellipeabreu_santacatarina_129134.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8824-Copy.jpg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145736/20220530_fellipeabreu_santacatarina_129014.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8787-Copy.jpg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145746/20220601_fellipeabreu_santacatarina_129454.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8801-Copy.jpg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05145757/20220604_fellipeabreu_santacatarina_129960.jpeg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8826-Copy.jpg (download falhou)
- https://imgs.mongabay.com/wp-content/uploads/sites/29/2023/04/05180604/20220530_fellipeabreu_santacatarina_128704-1.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8814-Copy.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8760.jpg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/WhatsApp-Image-2023-04-19-at-12.38.09.jpeg (download falhou)
- https://cepagro.org.br/wp-content/uploads/2023/04/IMG_8740-Copy.jpg (download falhou)
- https://mcusercontent.com/b3bb80010fa6252bd5def4f82/images/afcb4887-4ff7-f2ec-13bd-9d0a865181e6.png (download falhou)
