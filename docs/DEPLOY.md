# Deploy na Vercel

## Primeira configuração (uma vez)

1. Importar `cirokmr/vianei` na Vercel com o preset **Next.js**.
2. **Storage → Create Database → Neon (Postgres)** e conectar ao projeto: cria `DATABASE_URL`.
3. **Storage → Blob** e conectar ao projeto: cria `BLOB_READ_WRITE_TOKEN` (fotos e PDFs).
4. **Settings → Environment Variables:**

| Variável                                                | Valor                                                               |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `REVALIDATE_SECRET` | textos aleatórios (`openssl rand -hex 24`)                          |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`               | primeiro login do painel (`/admin`)                                 |
| `IMPORTAR_CONTEUDO`                                     | `1` só no deploy que carrega o conteúdo do WordPress; depois apague |
| `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SITE_URL`        | só com domínio próprio (ex.: `https://vianei.org.br`)               |
| `SMTP_*`                                                | opcional, avisos do formulário de contato (ver `.env.example`)      |

Sem `NEXT_PUBLIC_SERVER_URL`, o site usa o endereço do próprio deploy (`src/lib/server-url.ts`): o link da branch
nas prévias e o de produção em produção.

## O que cada deploy faz

`package.json` → `vercel-build` → `scripts/vercel-build.sh`:

1. `npm run migrate`: aplica as migrations commitadas (nunca altera o banco por conta própria);
2. `npm run seed`: dados institucionais, parceiros, equipe e o admin (idempotente);
3. com o Blob conectado: `blob:reparar` confere (HEAD) se cada imagem e PDF do banco existe no Blob e reenvia o
   que faltar, a partir da URL de origem no WordPress ou de `data/wp-export/complementos`, mantendo ids e nomes.
   Leva segundos quando está tudo lá;
4. com `IMPORTAR_CONTEUDO=1` (só no ambiente **Preview** ou **Production** onde se quer carregar): `wp:import` (notícias, projetos, publicações, páginas, imagens e PDFs a partir de
   `data/wp-export/snapshot.json`) e `wp:classify`. Os dois são idempotentes;
5. `next build`.

Cada PR ganha um link de prévia. Prévias da Vercel já saem com `noindex`.
