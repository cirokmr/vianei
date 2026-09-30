import type { Metadata } from 'next';
import Hero from '@/components/secoes/Hero';
import Manifesto from '@/components/secoes/Manifesto';
import Faixa from '@/components/secoes/Faixa';
import Colecao from '@/components/secoes/Colecao';
import Colagem from '@/components/secoes/Colagem';
import Destaques from '@/components/secoes/Destaques';
import Texto from '@/components/secoes/Texto';
import Marcos from '@/components/secoes/Marcos';
import { site } from '@/lib/site';
import { noticias, projetos, type Noticia } from '@/lib/content';

export const metadata: Metadata = { alternates: { canonical: '/' } };

// A home é uma sequência de seções definida em conteudo/site.json → home.secoes.
// Para mudar a ordem, tirar ou repetir uma seção, edite só o JSON.
export default function Home() {
  const itensColecao = projetos.map(({ slug, numero, titulo, subtitulo, tipo, capa, video }) => ({
    slug,
    numero,
    titulo,
    subtitulo,
    tipo,
    capa,
    video,
  }));

  return (
    <>
      {site.home.secoes.map((s, i) => {
        switch (s.tipo) {
          case 'hero':
            return <Hero key={i} dados={s} />;
          case 'manifesto':
            return <Manifesto key={i} dados={s} />;
          case 'faixa':
            return <Faixa key={i} dados={s} />;
          case 'colecao':
            return <Colecao key={i} dados={s} itens={itensColecao} />;
          case 'colagem':
            return <Colagem key={i} dados={s} />;
          case 'destaques': {
            // opções: só com capa; no máximo uma por categoria (evita repetir o mesmo tema)
            const vistas = new Set<string>();
            const umaPorCategoria = s.umaPorCategoria === true;
            const soComCapa = s.soComCapa === true;
            const variar = (n: Noticia) => {
              if (!umaPorCategoria) return true;
              const chave = n.categorias[0] ?? n.slug;
              if (vistas.has(chave)) return false;
              vistas.add(chave);
              return true;
            };
            const lista = noticias
              .filter((n) => n.tipo === 'artigo' && (!soComCapa || n.capa))
              .filter(variar)
              .slice(0, s.quantidade ?? 3);
            return <Destaques key={i} dados={s} noticias={lista} total={noticias.length} />;
          }
          case 'texto':
            return <Texto key={i} dados={s} />;
          case 'marcos':
            return <Marcos key={i} dados={s} />;
          default:
            return null;
        }
      })}
    </>
  );
}
