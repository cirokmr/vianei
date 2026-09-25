import { expect, test } from "@playwright/test";
import redirects from "../../src/redirects.json" with { type: "json" };

// Old WordPress URLs must keep working (SEO + shared links). These checks
// only look at the redirect itself, so they don't need migrated content.

const cases: [from: string, to: string][] = [
  ["/fale-conosco", "/contato"],
  ["/galeria-de-videos", "/videos"],
  ["/projetos1/projeto-restaurar", "/projetos/projeto-restaurar"],
  [
    "/projetos1/projeto-restaurar/galeria-de-especies/araucaria",
    "/projetos/projeto-restaurar/galeria-de-especies/araucaria",
  ],
  ["/projetos1/qualquer/pagina-nova", "/projetos/qualquer/pagina-nova"],
  ["/publicacoes/1184-2", "/publicacoes"],
  ["/categoria-de-projetos/executando", "/projetos"],
  ["/download/arquivo-7", "/publicacoes"],
  // Emoji slugs from WordPress (percent-encoded) → clean slugs
  [
    "/noticias/%f0%9f%8c%b2-24-de-julho-hoje-e-dia-da-araucaria-%f0%9f%8c%b2",
    "/noticias/24-de-julho-hoje-e-dia-da-araucaria",
  ],
];

test.describe("redirects do site antigo", () => {
  for (const [from, to] of cases) {
    test(`${from} → ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308]).toContain(res.status());
      expect(new URL(res.headers().location, "http://x").pathname).toBe(to);
    });
  }

  test("URLs antigas com barra final chegam ao destino", async ({ request }) => {
    const res = await request.get("/fale-conosco/");
    expect(res.url()).toMatch(/\/contato$/);
  });

  test("todas as regras geradas são permanentes e têm destino", () => {
    expect(redirects.length).toBeGreaterThan(20);
    for (const r of redirects) {
      expect(r.permanent).toBe(true);
      expect(r.source.startsWith("/")).toBe(true);
      expect(r.destination).toBeTruthy();
      expect(r.destination).not.toContain("localhost");
    }
  });
});
