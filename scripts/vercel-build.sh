#!/usr/bin/env bash
# Vercel build (package.json "vercel-build" runs instead of "build").
# Every deploy: apply committed migrations and the idempotent seed, then build.
# One-off content load: set IMPORTAR_CONTEUDO=1 in the project, redeploy, then
# remove it. The import is idempotent, so a repeat run only fills what's missing.
set -euo pipefail

# Fail early, in plain words, when the project isn't fully configured (docs/DEPLOY.md).
faltando=()
for var in DATABASE_URL PAYLOAD_SECRET; do
  [ -n "${!var:-}" ] || faltando+=("$var")
done
if [ ${#faltando[@]} -gt 0 ]; then
  echo "ERRO: faltam variáveis de ambiente na Vercel: ${faltando[*]}"
  echo "  DATABASE_URL: Storage → Neon (Postgres) → conectar ao projeto (Production e Preview)."
  echo "  PAYLOAD_SECRET: Settings → Environment Variables."
  echo "Depois, Deployments → este deploy → Redeploy. Passo a passo: docs/DEPLOY.md"
  exit 1
fi
if [ -z "${BLOB_READ_WRITE_TOKEN:-}" ]; then
  echo "AVISO: sem BLOB_READ_WRITE_TOKEN (Storage → Blob). Uploads e a importação de imagens não vão persistir."
  if [ "${IMPORTAR_CONTEUDO:-}" = "1" ]; then
    echo "ERRO: IMPORTAR_CONTEUDO=1 exige o Blob conectado." && exit 1
  fi
fi

npm run migrate
npm run seed

if [ "${IMPORTAR_CONTEUDO:-}" = "1" ]; then
  echo "IMPORTAR_CONTEUDO=1: importando o conteúdo do WordPress (snapshot em data/wp-export)"
  npm run wp:import
  npm run wp:classify
fi

npm run build
