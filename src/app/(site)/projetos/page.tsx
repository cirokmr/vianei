import type { Metadata } from "next";
import Link from "next/link";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { getProjetos } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos do Centro Vianei em agroecologia, educação popular e restauração florestal.",
};

// Layout refined in phase 6.
export default async function ProjetosPage() {
  const projetos = await getProjetos();

  return (
    <>
      <section className="bg-neblina px-[var(--gutter)] pt-40 pb-16">
        <p className="mb-6 text-eyebrow tracking-[0.18em] text-musgo uppercase">O que fazemos</p>
        <HeroTitle
          className="font-display text-h1 leading-[0.92] font-light tracking-[-0.035em] text-mata"
          text="Projetos"
        />
      </section>
      <ul className="divide-y divide-tinta/15 border-y border-tinta/15 px-[var(--gutter)]">
        {projetos.map((projeto) => (
          <li key={projeto.id}>
            <Link href={`/projetos/${projeto.slug}`} className="group block py-8">
              <span className="block font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] leading-tight group-hover:text-pinhao">
                {projeto.titulo}
              </span>
              {projeto.resumo ? <span className="mt-2 block max-w-2xl text-tinta/75">{projeto.resumo}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
