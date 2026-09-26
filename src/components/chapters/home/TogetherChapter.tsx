import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import type { Parceiro } from "@/payload-types";

type Props = { parceiros: Pick<Parceiro, "id" | "nome">[]; email: string };

/** "Quem caminha junto": partners in a scroll-reactive marquee, then the call to talk. */
export function TogetherChapter({ parceiros, email }: Props) {
  return (
    <div data-header="dark" className="bg-mata pt-[clamp(5rem,14vh,9rem)] text-papel">
      <div className="px-[var(--gutter)]">
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-limao uppercase">Parceiros e apoiadores</p>
        <h2 className="max-w-3xl font-display text-h2 leading-[0.98] tracking-[-0.025em]">Ninguém cultiva sozinho.</h2>
      </div>

      {parceiros.length ? (
        <Marquee label="Parceiros e apoiadores do Centro Vianei" className="mt-[clamp(2.5rem,8vh,5rem)] py-6">
          {parceiros.map((p) => (
            <span key={p.id} className="px-8 font-display text-[clamp(2rem,5vw,4.5rem)] font-light whitespace-nowrap">
              {p.nome} <span className="text-salvia">·</span>
            </span>
          ))}
        </Marquee>
      ) : null}

      <div className="grid gap-10 border-t border-papel/15 px-[var(--gutter)] py-[clamp(4rem,12vh,8rem)] md:grid-cols-[1.3fr_1fr] md:items-end">
        <p className="max-w-2xl font-display text-[clamp(2rem,1.3rem+2.8vw,4.2rem)] leading-[1.02] tracking-[-0.02em]">
          Quer somar ao trabalho no Planalto? <span className="text-salvia">Vamos conversar.</span>
        </p>
        <div className="flex flex-wrap items-center gap-6 md:justify-end">
          <Magnetic>
            <a
              href={`mailto:${email}`}
              data-cursor="Escrever"
              className="inline-block rounded-full bg-limao px-8 py-4 text-eyebrow font-semibold tracking-[0.16em] text-mata uppercase"
            >
              {email}
            </a>
          </Magnetic>
          <Link
            href="/quem-somos#parceiros"
            className="text-eyebrow tracking-[0.16em] uppercase underline-offset-4 hover:underline"
          >
            Ver todos os parceiros
          </Link>
        </div>
      </div>
    </div>
  );
}
