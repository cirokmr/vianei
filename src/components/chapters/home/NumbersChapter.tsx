import { Counter } from "@/components/motion/Counter";
import { site } from "@/config/site";
import type { Numero } from "@/payload-types";

type Props = { itens: NonNullable<Numero["itens"]> };

// Editors type "ha" or "anos"; words get a space, symbols ("%", "+") don't.
const spaced = (s?: string | null) => (s && /^\p{L}/u.test(s) ? ` ${s}` : (s ?? undefined));

/**
 * "Números": years of work are derived from the founding year (a fact, never
 * stale); every other figure comes from the `numeros` global, edited by the
 * team. Nothing here is invented in code.
 */
export function NumbersChapter({ itens }: Props) {
  const anos = new Date().getFullYear() - site.foundedYear;
  const numeros = [{ id: "anos", valor: anos, prefixo: null, sufixo: "anos", rotulo: "de educação popular" }, ...itens];

  return (
    <div className="relative overflow-hidden bg-papel px-[var(--gutter)] py-[clamp(5rem,14vh,9rem)]">
      {/* The opening's araucárias again, faint along the bottom edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ilustracoes/araucarias.svg"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] w-full object-cover object-bottom opacity-[0.09]"
      />
      <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Em números</p>
      <h2 className="max-w-3xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata">
        O tempo da araucária é o tempo do trabalho de base.
      </h2>
      <dl className="relative mt-[clamp(3rem,10vh,6rem)] grid gap-x-10 gap-y-14 md:max-w-[70%] md:grid-cols-2">
        {numeros.map((n) => (
          <div key={n.id ?? n.rotulo} className="flex flex-col-reverse border-t border-tinta/20 pt-6">
            <dt className="mt-3 text-tinta/75">{n.rotulo}</dt>
            <dd className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-none font-light tracking-[-0.04em] text-mata">
              <Counter value={n.valor} prefix={n.prefixo ?? undefined} suffix={spaced(n.sufixo)} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
