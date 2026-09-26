import { Counter } from "@/components/motion/Counter";
import { DrawTree } from "@/components/motion/DrawTree";
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
      <DrawTree className="pointer-events-none absolute right-[4vw] bottom-0 hidden h-[88%] w-auto text-oliva/60 md:block" />
      <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">Em números</p>
      <h2 className="max-w-3xl font-display text-h2 leading-[0.98] tracking-[-0.025em] text-mata">
        O tempo da araucária é o tempo do trabalho de base.
      </h2>
      <dl className="relative mt-[clamp(3rem,10vh,6rem)] grid gap-x-10 gap-y-14 md:max-w-[70%] md:grid-cols-2">
        {numeros.map((n) => (
          <div key={n.id ?? n.rotulo} className="flex flex-col-reverse border-t border-tinta/20 pt-6">
            <dt className="mt-3 text-lead text-tinta/80">{n.rotulo}</dt>
            <dd className="font-display text-[clamp(4rem,10vw,9rem)] leading-none font-light tracking-[-0.04em] text-mata">
              <Counter value={n.valor} prefix={n.prefixo ?? undefined} suffix={spaced(n.sufixo)} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
