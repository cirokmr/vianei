import type { Page } from "@playwright/test";

// cms.spec publishes and then deletes a "Teste E2E …" news item while other
// specs run in parallel. A page rendered in that window links to it, and the
// prefetch after the delete is a legitimate 404 that has nothing to do with
// the page under test.
const TEST_CONTENT = /teste-e2e/;

/**
 * Collects page errors, console errors and failed responses (4xx/5xx).
 * Chrome logs a failed resource only as "Failed to load resource", without
 * the URL, so those are tracked via responses, where the URL is known.
 */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !TEST_CONTENT.test(r.url())) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}
