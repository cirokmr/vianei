import { site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-header="dark" className="bg-mata px-[var(--gutter)] pt-24 pb-10 text-papel">
      <p className="font-display text-h2 leading-none tracking-[-0.03em]">
        Quem caminha junto
        <br />
        <span className="text-salvia">faz a terra florescer.</span>
      </p>

      <div className="mt-20 grid gap-10 text-sm text-papel/75 md:grid-cols-3">
        <address className="not-italic">
          {site.name}
          <br />
          {site.address.street}
          <br />
          {site.address.city} – {site.address.region}, {site.address.postalCode}
          <br />
          CNPJ {site.cnpj}
        </address>
        <p>
          <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
            {site.email}
          </a>
        </p>
        <ul className="flex gap-6 md:justify-end">
          {site.social.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 border-t border-papel/15 pt-6 text-xs text-papel/60">
        © {year} {site.name}
      </p>
    </footer>
  );
}
