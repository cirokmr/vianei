import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { YouTube } from "@/components/ui/YouTube";
import { getSite, getVideos } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";
import { getChannelVideos, youtubeId, type Video } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Websérie, seminários e registros do trabalho do Centro Vianei no território.",
  alternates: { canonical: "/videos" },
};

// The channel feed is re-read every 6 h (see getChannelVideos).
export const revalidate = 21600;

export default async function VideosPage() {
  const site = await getSite();
  const [curados, canal] = await Promise.all([getVideos(), getChannelVideos(site.redes?.youtubeChannelId)]);

  // Panel entries first (they can be highlighted or captioned), then the channel, without repeats.
  const vistos = new Set<string>();
  const videos: Video[] = [];
  for (const v of [
    ...curados.map((c) => ({
      id: youtubeId(c.youtube) ?? "",
      titulo: c.titulo,
      publicadoEm: c.publicadoEm,
      descricao: c.descricao,
    })),
    ...canal,
  ]) {
    if (v.id && !vistos.has(v.id)) {
      vistos.add(v.id);
      videos.push(v);
    }
  }
  const [destaque, ...resto] = videos;

  return (
    <>
      <PageHeader
        dark
        eyebrow="Vídeos"
        title="O território em movimento"
        lead="Websérie, seminários e registros do trabalho com agricultoras, agricultores e extrativistas."
      />
      <div data-header="dark" className="bg-mata px-[var(--gutter)] pb-[clamp(4rem,12vh,8rem)] text-papel">
        {destaque ? (
          <section aria-labelledby="video-destaque" className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <YouTube
              id={destaque.id}
              titulo={destaque.titulo}
              legenda={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div>
              {destaque.publicadoEm ? (
                <p className="text-eyebrow tracking-[0.14em] text-limao uppercase">
                  {formatDate(destaque.publicadoEm)}
                </p>
              ) : null}
              <h2
                id="video-destaque"
                className="mt-3 font-display text-[clamp(1.8rem,1.3rem+1.8vw,3rem)] leading-[1.05]"
              >
                {destaque.titulo}
              </h2>
              {destaque.descricao ? <p className="mt-4 line-clamp-5 text-papel/80">{destaque.descricao}</p> : null}
            </div>
          </section>
        ) : (
          <p className="text-lead text-papel/80">Os vídeos aparecem aqui assim que o canal responder.</p>
        )}

        {resto.length ? (
          <ul className="mt-20 grid gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((v) => (
              <li key={v.id}>
                <YouTube
                  id={v.id}
                  titulo={v.titulo}
                  legenda={false}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
                <h3 className="mt-4 font-display text-xl leading-snug">{v.titulo}</h3>
                {v.publicadoEm ? <p className="mt-1 text-sm text-papel/70">{formatDate(v.publicadoEm)}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}

        {site.redes?.youtube ? (
          <a
            href={site.redes.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-16 inline-block rounded-full border border-papel/40 px-8 py-4 text-eyebrow tracking-[0.16em] uppercase hover:border-limao hover:text-limao"
          >
            Ver o canal no YouTube <span aria-hidden="true">↗</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : null}
      </div>
    </>
  );
}
