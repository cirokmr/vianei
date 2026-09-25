import { getSite } from "@/lib/cms/queries";

export async function Footer() {
  const site = await getSite();
  const year = new Date().getFullYear();
  const redes = [
    { href: site.redes?.instagram, label: "Instagram" },
    { href: site.redes?.facebook, label: "Facebook" },
    { href: site.redes?.youtube, label: "YouTube" },
  ].filter((rede): rede is { href: string; label: string } => Boolean(rede.href));
  const endereco = site.endereco;

  return (
    <footer data-header="dark" className="bg-mata px-[var(--gutter)] pt-24 pb-10 text-papel">
      <p className="font-display text-h2 leading-none tracking-[-0.03em]">
        Quem caminha junto
        <br />
        <span className="text-salvia">faz a terra florescer.</span>
      </p>

      <div className="mt-20 grid gap-10 text-sm text-papel/75 md:grid-cols-3">
        <address className="not-italic">
          {site.nome}
          {endereco?.logradouro ? (
            <>
              <br />
              {endereco.logradouro}
            </>
          ) : null}
          {endereco?.cidade ? (
            <>
              <br />
              {endereco.cidade} – {endereco.uf}, {endereco.cep}
            </>
          ) : null}
          {site.cnpj ? (
            <>
              <br />
              CNPJ {site.cnpj}
            </>
          ) : null}
        </address>
        <p>
          <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
            {site.email}
          </a>
          {site.telefone ? (
            <>
              <br />
              {site.telefone}
            </>
          ) : null}
        </p>
        <ul className="flex gap-6 md:justify-end">
          {redes.map((rede) => (
            <li key={rede.label}>
              <a
                href={rede.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {rede.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 border-t border-papel/15 pt-6 text-xs text-papel/60">
        © {year} {site.nome}
      </p>
    </footer>
  );
}
