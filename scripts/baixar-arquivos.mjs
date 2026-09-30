#!/usr/bin/env node
/**
 * BAIXAR ARQUIVOS AVULSOS DO SITE ANTIGO (a partir de uma lista)
 * --------------------------------------------------------------
 * Para o que a extração não pega sozinha: PDFs de publicações, a imagem ORIGINAL
 * de uma capa, miniaturas de vídeos, um JSON de API pública etc.
 * Roda no GitHub Actions (workflow "Extrair site antigo", campo "lista"), que tem internet.
 *
 *   node scripts/baixar-arquivos.mjs extraido/baixar.json
 *
 * Formato da lista (JSON):
 *   [
 *     { "url": "https://site/arquivo.pdf", "destino": "public/arquivos/arquivo.pdf" },
 *     { "url": "https://site/foto.jpg", "destino": "public/img/noticias/foto.webp", "largura": 1600, "maxKB": 300 },
 *     { "url": "https://site/capa.png", "destino": "public/img/capa.webp", "altura": 900 },
 *     { "url": "https://site/original.jpg", "alternativa": "https://site/original-1024x768.jpg", "destino": "…" }
 *   ]
 * - destino .webp → converte com sharp (largura/altura máximas; baixa a qualidade até
 *   caber em maxKB, padrão 300 KB).
 * - qualquer outro destino → grava o arquivo como veio (avisa se passar de maxMB, padrão 15).
 * - arquivos que já existem no destino são pulados (rode de novo sem medo).
 * Gera <lista>.resultado.json (tamanho de cada arquivo e erros).
 */
import fs from 'node:fs';
import path from 'node:path';
import { carregar } from './carregar.mjs';

const arqLista = process.argv[2];
if (!arqLista || !fs.existsSync(arqLista)) {
  console.error('Uso: node scripts/baixar-arquivos.mjs lista.json');
  process.exit(1);
}
const lista = JSON.parse(fs.readFileSync(arqLista, 'utf8'));
const precisaSharp = lista.some((i) => /\.webp$/i.test(i.destino));
const sharp = precisaSharp ? (await carregar('sharp')).default : null;

const resultado = [];
let ok = 0;
let falhas = 0;

async function baixar(url) {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (fabrica-de-sites)' }, redirect: 'follow' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (tentativa === 3) throw e;
      await new Promise((res) => setTimeout(res, 1500 * tentativa));
    }
  }
}

for (const item of lista) {
  const { url, destino } = item;
  if (!url || !destino) continue;
  if (fs.existsSync(destino)) {
    resultado.push({ url, destino, kb: Math.round(fs.statSync(destino).size / 1024), pulado: true });
    continue;
  }
  try {
    let corpo;
    try {
      corpo = await baixar(url);
    } catch (e) {
      if (!item.alternativa) throw e;
      corpo = await baixar(item.alternativa); // ex.: a cópia redimensionada do WordPress
    }
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    if (/\.webp$/i.test(destino)) {
      const maxKB = item.maxKB ?? 300;
      const redim = { width: item.largura ?? 1600, height: item.altura, fit: 'inside', withoutEnlargement: true };
      let qualidade = item.qualidade ?? 78;
      let saida;
      for (;;) {
        saida = await sharp(corpo).rotate().resize(redim).webp({ quality: qualidade }).toBuffer();
        if (saida.length <= maxKB * 1024 || qualidade <= 40) break;
        qualidade -= 8;
      }
      if (saida.length > maxKB * 1024) {
        // ainda grande: reduz as dimensões
        const meta = await sharp(saida).metadata();
        saida = await sharp(saida).resize({ width: Math.round((meta.width ?? 1600) * 0.75) }).webp({ quality: 60 }).toBuffer();
      }
      fs.writeFileSync(destino, saida);
      const meta = await sharp(saida).metadata();
      resultado.push({ url, destino, kb: Math.round(saida.length / 1024), largura: meta.width, altura: meta.height, qualidade });
    } else {
      fs.writeFileSync(destino, corpo);
      const mb = corpo.length / 1024 / 1024;
      resultado.push({ url, destino, kb: Math.round(corpo.length / 1024), ...(mb > (item.maxMB ?? 15) ? { aviso: `arquivo grande: ${mb.toFixed(1)} MB` } : {}) });
    }
    ok++;
    console.log(`   ✓ ${destino}`);
  } catch (e) {
    falhas++;
    resultado.push({ url, destino, erro: String(e.message || e) });
    console.log(`   ✗ ${destino}: ${e.message || e}`);
  }
}

fs.writeFileSync(arqLista.replace(/\.json$/, '') + '.resultado.json', JSON.stringify(resultado, null, 2) + '\n');
console.log(`\n✅ ${ok} baixado(s), ${falhas} falha(s), ${resultado.filter((r) => r.pulado).length} já existiam`);
