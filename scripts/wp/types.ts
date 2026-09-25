// Normalized snapshot of the WordPress site (data/wp-export/*.json).
// Everything the importer needs, nothing Elementor-specific.

export type WpImage = {
  url: string;
  /** URL actually referenced by the page, used if `url` (the original) is gone. */
  fallbackUrl?: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export type WpEntry = {
  wpId: number;
  type: "noticias" | "projetos" | "publicacoes" | "paginas";
  slug: string;
  url: string;
  title: string;
  subtitle: string;
  publishedAt: string; // ISO, UTC
  modifiedAt: string;
  bodyHtml: string; // cleaned semantic HTML
  featured: WpImage | null;
  inlineImages: WpImage[];
  terms: string[];
  // publicacoes
  pdfUrl?: string;
  // paginas
  parentWpId?: number;
  path?: string; // e.g. projetos1/projeto-restaurar/galeria-de-especies
};

export type WpSnapshot = {
  exportedAt: string;
  source: string;
  entries: WpEntry[];
  warnings: string[];
};
