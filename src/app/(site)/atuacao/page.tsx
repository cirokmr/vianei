import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ClipImage } from "@/components/motion/ClipImage";
import { PageHeader } from "@/components/ui/PageHeader";
import { areaHref, areas } from "@/config/areas";

export const metadata: Metadata = {
  title: "Atuação",
  description:
    "Educação popular, agroecologia, restauração florestal e o Sistema Agrícola Tradicional do pinhão: as frentes de trabalho do Centro Vianei.",
  alternates: { canonical: "/atuacao" },
};

export default function AtuacaoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Atuação"
        title="Quatro caminhos, um território"
        lead="O trabalho do Centro Vianei está voltado para o campo e suas questões: produção, formação para a cidadania e cultura, sobretudo no Planalto Catarinense."
      />
      <ul className="grid gap-x-[var(--gutter)] gap-y-16 px-[var(--gutter)] py-[clamp(4rem,10vh,7rem)] md:grid-cols-2">
        {areas.map((area, i) => (
          <li key={area.slug} className={i % 2 ? "md:mt-[18vh]" : ""}>
            <article className="group relative">
              <ClipImage className="aspect-[4/5]" from={i % 2 ? "right" : "bottom"}>
                <Image src={area.foto} alt={area.alt} sizes="(min-width: 768px) 46vw, 100vw" />
              </ClipImage>
              <p className="mt-6 font-display text-sm text-musgo tabular-nums">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,1.4rem+2.4vw,3.8rem)] leading-[0.98] tracking-[-0.02em] text-mata">
                <Link
                  href={areaHref(area)}
                  data-cursor="Ver"
                  className="group-hover:text-pinhao after:absolute after:inset-0"
                >
                  {area.titulo}
                </Link>
              </h2>
              <p className="mt-4 max-w-md text-lead leading-snug text-tinta/80">{area.texto}</p>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
