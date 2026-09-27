"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type Miniatura = {
  id: number;
  alt: string;
  legenda?: string | null;
  thumb: { url: string; width: number; height: number };
  full: { url: string; width: number; height: number };
};

/**
 * A run of images in the text as a grid of thumbnails; each opens large in a
 * native <dialog> (Esc closes, arrows move between images).
 */
export function Miniaturas({ imagens }: { imagens: Miniatura[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [atual, setAtual] = useState<number | null>(null);
  const aberta = atual === null ? null : imagens[atual];

  const abrir = (i: number) => {
    setAtual(i);
    dialog.current?.showModal();
  };
  const mover = (passo: number) => setAtual((i) => (i === null ? i : (i + passo + imagens.length) % imagens.length));

  return (
    <div className="my-12">
      <ul className="grid !list-none grid-cols-2 gap-3 !pl-0 sm:grid-cols-3">
        {imagens.map((img, i) => (
          <li key={img.id} className="!mt-0">
            <button
              type="button"
              onClick={() => abrir(i)}
              aria-label={`Ampliar imagem ${i + 1} de ${imagens.length}: ${img.alt}`}
              className="group block w-full overflow-hidden bg-tinta/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pinhao"
            >
              <Image
                src={img.thumb.url}
                width={img.thumb.width}
                height={img.thumb.height}
                alt=""
                sizes="(min-width: 640px) 14rem, 45vw"
                className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Imagem ampliada"
        onClose={() => setAtual(null)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") mover(1);
          if (e.key === "ArrowLeft") mover(-1);
        }}
        className="m-auto w-[min(92vw,70rem)] max-w-none bg-transparent p-0 backdrop:bg-tinta/85"
        // The dialog itself takes focus on open; the ring belongs to its buttons.
        style={{ outline: "none" }}
      >
        {aberta ? (
          <figure className="flex flex-col items-center gap-3">
            <Image
              key={aberta.id}
              src={aberta.full.url}
              width={aberta.full.width}
              height={aberta.full.height}
              alt={aberta.alt}
              sizes="92vw"
              // Lazy images never load inside a closed-then-opened dialog.
              loading="eager"
              className="h-auto max-h-[80svh] w-auto max-w-full object-contain"
            />
            <figcaption className="!mt-0 flex w-full items-center justify-between gap-4 !text-sm !text-papel">
              <span>{aberta.legenda ?? `${atual! + 1} / ${imagens.length}`}</span>
              <span className="flex shrink-0 gap-2">
                {imagens.length > 1 ? (
                  <>
                    <BotaoDialogo onClick={() => mover(-1)} label="Imagem anterior">
                      ←
                    </BotaoDialogo>
                    <BotaoDialogo onClick={() => mover(1)} label="Próxima imagem">
                      →
                    </BotaoDialogo>
                  </>
                ) : null}
                <BotaoDialogo onClick={() => dialog.current?.close()} label="Fechar">
                  ✕
                </BotaoDialogo>
              </span>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </div>
  );
}

function BotaoDialogo({ onClick, label, children }: { onClick: () => void; label: string; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-papel/40 text-papel hover:bg-papel hover:text-tinta"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
