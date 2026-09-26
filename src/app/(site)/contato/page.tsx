import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSite } from "@/lib/cms/queries";
import { organization } from "@/lib/seo";
import { ContatoForm } from "./ContatoForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o Centro Vianei de Educação Popular, em Lages (SC).",
  alternates: { canonical: "/contato" },
};

const label = "mb-3 text-eyebrow tracking-[0.18em] text-musgo uppercase";

export default async function ContatoPage() {
  const site = await getSite();
  const e = site.endereco;
  const endereco = [e?.logradouro, e?.cidade && `${e.cidade} – ${e.uf}`, e?.cep].filter(Boolean).join(", ");
  const mapa = `https://www.openstreetmap.org/search?query=${encodeURIComponent(endereco)}`;
  const redes = [
    { href: site.redes?.instagram, label: "Instagram" },
    { href: site.redes?.facebook, label: "Facebook" },
    { href: site.redes?.youtube, label: "YouTube" },
  ].filter((r): r is { href: string; label: string } => Boolean(r.href));

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...organization }} />
      <PageHeader
        eyebrow="Contato"
        title="Vamos conversar"
        lead="Parcerias, projetos, imprensa ou uma visita ao viveiro: escreva para a gente."
      />
      <div className="grid gap-16 px-[var(--gutter)] py-[clamp(4rem,10vh,7rem)] lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-10">
          <div>
            <h2 className={label}>E-mail</h2>
            <a
              href={`mailto:${site.email}`}
              className="font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.6rem)] text-mata hover:text-pinhao"
            >
              {site.email}
            </a>
          </div>
          {site.telefone ? (
            <div>
              <h2 className={label}>Telefone</h2>
              <a
                href={`tel:${site.telefone.replace(/[^\d+]/g, "")}`}
                className="font-display text-2xl text-mata hover:text-pinhao"
              >
                {site.telefone}
              </a>
            </div>
          ) : null}
          <div>
            <h2 className={label}>Endereço</h2>
            <address className="text-lead leading-snug text-tinta/85 not-italic">
              {site.nome}
              <br />
              {e?.logradouro}
              <br />
              {e?.cidade} – {e?.uf}, {e?.cep}
            </address>
            <a
              href={mapa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-eyebrow tracking-[0.16em] text-pinhao uppercase underline-offset-4 hover:underline"
            >
              Ver no mapa <span aria-hidden="true">↗</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
          {redes.length ? (
            <div>
              <h2 className={label}>Redes</h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lead">
                {redes.map((r) => (
                  <li key={r.label}>
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="hover:text-pinhao">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <section aria-labelledby="escreva" className="relative">
          <h2 id="escreva" className="mb-10 font-display text-h2 leading-none tracking-[-0.02em] text-mata">
            Escreva para nós
          </h2>
          <ContatoForm />
        </section>
      </div>
    </>
  );
}
