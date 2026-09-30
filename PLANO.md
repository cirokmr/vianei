# Plano da reconstrução — Centro Vianei

Fonte: `extraido/` (extração de vianei.org.br em 30/09/2026, 109 páginas, 117 URLs) +
`extraido/curadoria/` (snapshot do WordPress e material da equipe, fases 1–6).

## Conteúdo criado

| Arquivo | Vem de |
|---|---|
| `conteudo/site.json` | contatos, redes, menu, textos da home (home e "Quem somos" antigos), parceiros |
| `conteudo/paginas/quem-somos.md` | `/quem-somos/` + textos institucionais da home antiga |
| `conteudo/paginas/publicacoes.md` | `/publicacoes/` + 14 páginas de publicação (13 no site: a repetida saiu) |
| `conteudo/paginas/videos.md` | `/galeria-de-videos/` + vídeos citados nas notícias (títulos via oEmbed) |
| `conteudo/projetos/*.md` (5) | `/projetos/<slug>/`; o Restaurar também reúne o mini-site `/projetos1/…` |
| `conteudo/noticias/*.md` (65) | `/noticias/<slug>/` (HTML do snapshot convertido; fotos e PDFs baixados) |
| `public/img/fotos/` | fotos curadas pela equipe na fase 5 |
| `public/img/noticias/`, `public/img/projetos/`, `public/img/publicacoes/`, `public/img/videos/` | baixadas pelo workflow Extrair (campo `lista`, `extraido/curadoria/baixar.json`) |
| `public/arquivos/*.pdf` (17) | PDFs das publicações, estatuto e cartilhas (mesmos nomes de arquivo) |

## URLs antigas → destino (77 regras em `redirects.json`)

| URL antiga | Destino |
|---|---|
| `/`, `/quem-somos/`, `/projetos/`, `/noticias/`, `/publicacoes/` | mesma URL |
| `/projetos`, `/publicacoes`, `/noticias` (mesma página sem barra) | mesma página |
| `/projetos/<slug>/` (5) | mesma URL |
| `/projetos/projeto-em-rede-da-terra-a-mesa/` | `/projetos/da-terra-a-mesa-mda/` |
| `/noticias/<slug>/` (59) | mesma URL |
| `/noticias/%f0%9f…-<slug>/` (6, com emoji) | `/noticias/<slug-limpo>/` (também com %XX maiúsculo) |
| `/noticias/…/whatsapp-image-…/` (4 anexos) | a notícia |
| `/noticias/<slug-encurtado>/` (7, endereços da fase 6) | `/noticias/<slug-original>/` |
| `/publicacoes/<slug>/` (14) | `/publicacoes/#<slug>` (a repetida → a edição de 2025) |
| `/projetos1/` | `/projetos/` |
| `/projetos1/projeto-restaurar/…` (9) | `/projetos/projeto-restaurar/#<capítulo>` |
| `/projetos1/*` | `/projetos/projeto-restaurar/` |
| `/fale-conosco/`, `/obrigado/` | `/contato/` |
| `/galeria-de-videos/` | `/videos/` |
| `/inicio/` | `/` |
| `/download/`, `/download/arquivo-N/`, `/download/*` | `/publicacoes/` |
| `/categoria-de-projetos/*` | `/projetos/` |
| `/wp-content/uploads/…/*.pdf` (17) | `/arquivos/<mesmo nome>.pdf` |
