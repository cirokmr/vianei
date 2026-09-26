import { serverUrl } from "../lib/server-url";

const PATHS: Record<string, string> = {
  noticias: "/noticias",
  projetos: "/projetos",
};

/**
 * URL that enables Next draft mode and redirects to the document's page.
 * The secret keeps random visitors from turning on draft mode.
 */
export function previewUrl(collection: keyof typeof PATHS | string, slug?: string | null): string {
  const base = serverUrl();
  const path = `${PATHS[collection] ?? ""}/${slug ?? ""}`;
  const params = new URLSearchParams({ path, secret: process.env.PREVIEW_SECRET ?? "" });
  return `${base}/api/preview?${params.toString()}`;
}
