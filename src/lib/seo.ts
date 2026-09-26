import { site } from "@/config/site";

/** Absolute URL for structured data and feeds. */
export const absolute = (path: string) => new URL(path, site.url).toString();

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export const organization = {
  "@type": "NGO",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  email: site.email,
  taxID: site.cnpj,
  foundingDate: String(site.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "BR",
  },
  sameAs: site.social.map((s) => s.href),
};
