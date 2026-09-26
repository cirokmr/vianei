import { PinnedChapter } from "@/components/motion/PinnedChapter";
import type { Timeline } from "@/payload-types";

type Props = { marcos: NonNullable<Timeline["marcos"]> };

const year = "font-display text-[clamp(5rem,20vw,17rem)] leading-[0.85] font-light tracking-[-0.05em] text-salvia";
const step = "px-[var(--gutter)] py-24 md:pl-[max(var(--gutter),12vw)]";

/**
 * The origin story as a pinned chapter: each scroll step replaces the scene.
 * Opening and closing steps are the institutional text; the milestones in
 * between come from the `timeline` global, so the team extends the story
 * from the panel.
 */
export function HistoryChapter({ marcos }: Props) {
  return (
    <PinnedChapter label="Nossa história" className="bg-mata text-papel" dark stepLength={80}>
      <div data-step="" className={step}>
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-limao uppercase">Nossa história</p>
        <h2 className="max-w-4xl font-display text-h2 leading-[1] tracking-[-0.025em]">
          Uma ideia de formação para jovens filhos de agricultores.
        </h2>
        <p className="mt-8 max-w-xl text-lead leading-snug text-papel/85">
          A proposta partiu de profissionais das Ciências Humanas e Sociais e, no início, contou com o financiamento do
          MEC.
        </p>
      </div>

      {marcos.map((marco) => (
        <div key={marco.id ?? marco.ano} data-step="" className={step}>
          <p aria-hidden="true" className={year}>
            {marco.ano}
          </p>
          <h3 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,1.3rem+2vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
            <span className="sr-only">{marco.ano}: </span>
            {marco.titulo}
          </h3>
          {marco.texto ? <p className="mt-4 max-w-xl text-lead leading-snug text-papel/85">{marco.texto}</p> : null}
        </div>
      ))}

      <div data-step="" className={step}>
        <p aria-hidden="true" className={year}>
          Hoje
        </p>
        <h3 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,1.3rem+2vw,3.2rem)] leading-[1.05] tracking-[-0.02em]">
          <span className="sr-only">Hoje: </span>Em rede pelo campo
        </h3>
        <p className="mt-4 max-w-xl text-lead leading-snug text-papel/85">
          O Centro Vianei participa de redes da sociedade civil que promovem a agricultura familiar, a agroecologia e a
          soberania e segurança alimentar.
        </p>
      </div>
    </PinnedChapter>
  );
}
