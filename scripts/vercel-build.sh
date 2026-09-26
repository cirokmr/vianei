#!/usr/bin/env bash
# Vercel build (package.json "vercel-build" runs instead of "build").
# Every deploy: apply committed migrations and the idempotent seed, then build.
# One-off content load: set IMPORTAR_CONTEUDO=1 in the project, redeploy, then
# remove it. The import is idempotent, so a repeat run only fills what's missing.
set -euo pipefail

npm run migrate
npm run seed

if [ "${IMPORTAR_CONTEUDO:-}" = "1" ]; then
  echo "IMPORTAR_CONTEUDO=1: importando o conteúdo do WordPress (snapshot em data/wp-export)"
  npm run wp:import
  npm run wp:classify
fi

npm run build
