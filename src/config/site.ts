// Static defaults (navigation, metadata). Editable institutional data lives
// in the Payload `site` global — see getSite().
export const site = {
  name: "Centro Vianei de Educação Popular",
  shortName: "Centro Vianei",
  legalName: "AVICITECS – Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde",
  description: "Educação popular, agroecologia e restauração da Mata Atlântica no Planalto Catarinense desde 1983.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vianei.org.br",
  foundedYear: 1983,
  email: "contato@vianei.org.br",
  cnpj: "78.492.261/0001-63",
  address: {
    street: "Av. Papa João XXIII, 1565 – Área Industrial",
    city: "Lages",
    region: "SC",
    postalCode: "88514-720",
  },
  nav: [
    { href: "/quem-somos", label: "Quem somos" },
    { href: "/atuacao", label: "Atuação" },
    { href: "/projetos", label: "Projetos" },
    { href: "/noticias", label: "Notícias" },
    { href: "/publicacoes", label: "Publicações" },
    { href: "/contato", label: "Contato" },
  ],
  social: [
    { href: "https://www.facebook.com/centrovianei", label: "Facebook" },
    { href: "https://www.instagram.com/centrovianei/", label: "Instagram" },
    { href: "https://www.youtube.com/channel/UCkEIv_GvLhWyFuYBl_y5i8w", label: "YouTube" },
  ],
} as const;
