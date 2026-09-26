"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeThumb } from "@/lib/youtube";

type Props = {
  id: string;
  titulo: string;
  className?: string;
  sizes?: string;
  /** Show the title over the thumbnail (off when a caption sits right below). */
  legenda?: boolean;
  /** Above-the-fold facade: load the thumbnail eagerly (it is the LCP). */
  priority?: boolean;
};

/**
 * YouTube facade: a thumbnail and a play button until the visitor asks for
 * the video. Only then does the (privacy-enhanced) player load, with its
 * ~1 MB of scripts and cookies. Works as a plain link without JS.
 */
export function YouTube({
  id,
  titulo,
  className = "",
  sizes = "(min-width: 900px) 68ch, 100vw",
  legenda = true,
  priority = false,
}: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`relative aspect-video overflow-hidden bg-mata ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          onClick={(event) => {
            event.preventDefault();
            setPlaying(true);
          }}
          data-cursor="Assistir"
          className="group absolute inset-0 block"
        >
          <Image
            src={youtubeThumb(id)}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            quality={60}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-linear-to-t from-mata/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 flex items-center gap-3 text-papel">
            <span
              aria-hidden="true"
              className="grid size-14 place-items-center rounded-full bg-papel text-mata transition-transform duration-500 group-hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            <span className="sr-only">Assistir: </span>
            <span className={legenda ? "max-w-[40ch] text-sm leading-snug font-medium drop-shadow" : "sr-only"}>
              {titulo}
            </span>
          </span>
        </a>
      )}
    </div>
  );
}
