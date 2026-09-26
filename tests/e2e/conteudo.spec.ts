import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { collectErrors } from "./errors";

// Phase 6: content pages. CI runs on a seeded database (no migrated news,
// projects or publications), so content-dependent checks skip themselves
// when there is nothing to check.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGINAS = [
  "/noticias",
  "/noticias/busca?q=agroecologia",
  "/atuacao",
  "/atuacao/agroecologia",
  "/projetos",
  "/publicacoes",
  "/videos",
  "/parceiros",
  "/contato",
];

for (const path of PAGINAS) {
  test(`${path}: um h1, sem erros e sem violações WCAG 2.2 AA`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.waitForTimeout(1500);
    expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test.describe("rotas", () => {
  for (const path of [
    "/noticias/pagina/1",
    "/noticias/pagina/abc",
    "/noticias/categoria/nao-existe",
    "/atuacao/nao-existe",
  ]) {
    test(`${path} responde 404`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(404);
    });
  }

  test("as quatro áreas de atuação existem e se ligam entre si", async ({ page }) => {
    await page.goto("/atuacao");
    const links = page.getByRole("main").getByRole("heading", { level: 2 }).getByRole("link");
    await expect(links).toHaveCount(4);
    await page.goto("/atuacao/restauracao-florestal");
    await expect(page.getByRole("navigation", { name: "Outras áreas" }).getByRole("link")).toHaveCount(3);
  });

  test("o rodapé leva a todas as seções, inclusive vídeos e parceiros", async ({ page }) => {
    await page.goto("/");
    const mapa = page.getByRole("navigation", { name: "Mapa do site" });
    for (const nome of ["Atuação", "Notícias", "Publicações", "Vídeos", "Parceiros", "Contato"]) {
      await expect(mapa.getByRole("link", { name: nome })).toBeVisible();
    }
  });
});

test.describe("notícias", () => {
  test("busca: termo curto e termo sem resultado", async ({ page }) => {
    await page.goto("/noticias/busca?q=a");
    await expect(page.getByRole("status")).toHaveText("Digite ao menos duas letras.");
    await page.goto("/noticias/busca?q=zzqqxx");
    await expect(page.getByRole("status")).toContainText("Nenhuma notícia encontrada");
  });

  test("o formulário de busca funciona sem JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/noticias");
    await page.getByRole("searchbox", { name: "Buscar notícias" }).fill("zzqqxx");
    await page.getByRole("button", { name: "Buscar" }).click();
    await expect(page).toHaveURL(/\/noticias\/busca\?q=zzqqxx/);
    await expect(page.getByRole("status")).toContainText("Nenhuma notícia encontrada");
    await ctx.close();
  });

  test("a notícia tem dados estruturados NewsArticle e BreadcrumbList", async ({ page }) => {
    await page.goto("/noticias");
    const primeira = page
      .getByRole("region", { name: "Lista de notícias" })
      .locator('article a[href^="/noticias/"]')
      .first();
    test.skip((await primeira.count()) === 0, "sem notícias publicadas neste banco");
    await page.goto((await primeira.getAttribute("href"))!);
    const tipos = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.flatMap((el) => [JSON.parse(el.textContent ?? "[]")].flat().map((d) => d["@type"])));
    expect(tipos).toEqual(expect.arrayContaining(["NewsArticle", "BreadcrumbList"]));
  });

  test("paginação: página 2 existe quando há mais de uma página", async ({ page }) => {
    await page.goto("/noticias");
    const proxima = page.getByRole("navigation", { name: "Paginação" }).getByRole("link", { name: "Página 2" });
    test.skip((await proxima.count()) === 0, "uma página só neste banco");
    await proxima.click();
    await expect(page).toHaveURL(/\/noticias\/pagina\/2$/);
    await expect(page.getByRole("navigation", { name: "Paginação" }).locator('[aria-current="page"]')).toHaveText("2");
  });
});

test.describe("vídeos", () => {
  test("a miniatura só vira player (youtube-nocookie) no clique", async ({ page }) => {
    await page.goto("/videos");
    const play = page.getByRole("link", { name: /^Assistir:/ }).first();
    test.skip((await play.count()) === 0, "canal indisponível e nenhum vídeo no painel");
    await expect(page.locator("iframe")).toHaveCount(0);
    await play.click();
    await expect(page.locator('iframe[src*="youtube-nocookie.com/embed/"]')).toHaveCount(1);
  });
});

// Contact form writes to the database: desktop only, cleaned up afterwards.
test.describe("contato", () => {
  const email = process.env.SEED_ADMIN_EMAIL ?? "dev@vianei.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "dev-password-123";
  const unique = `Teste E2E ${Date.now().toString(36)}`;

  async function mensagens(request: APIRequestContext, nome: string) {
    const login = await request.post("/api/usuarios/login", { data: { email, password } });
    const headers = { Authorization: `JWT ${(await login.json()).token}` };
    const res = await request.get(`/api/mensagens?where[nome][equals]=${encodeURIComponent(nome)}&depth=0`, {
      headers,
    });
    const docs = ((await res.json()).docs ?? []) as { id: number }[];
    return { docs, apagar: () => Promise.all(docs.map((d) => request.delete(`/api/mensagens/${d.id}`, { headers }))) };
  }

  test.beforeEach(({ isMobile }) => test.skip(isMobile, "grava no banco: roda só no desktop"));

  test("campos inválidos mostram os erros e movem o foco para o aviso", async ({ page }) => {
    await page.goto("/contato");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    const aviso = page.locator("#contato-status");
    await expect(aviso).toHaveText("Confira os campos destacados.");
    await expect(aviso).toBeFocused();
    await expect(page.getByRole("textbox", { name: "Nome" })).toHaveAttribute("aria-invalid", "true");
  });

  test("uma mensagem válida é salva no painel", async ({ page, request }) => {
    await page.goto("/contato");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.getByRole("textbox", { name: "Nome" }).fill(unique);
    await page.getByRole("textbox", { name: "E-mail" }).fill("teste@example.com");
    await page.getByRole("textbox", { name: "Mensagem" }).fill("Mensagem de teste automatizado do formulário.");
    await page.waitForTimeout(2600); // the form rejects submissions faster than a person could type
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("Mensagem enviada");
    const { docs, apagar } = await mensagens(request, unique);
    expect(docs).toHaveLength(1);
    await apagar();
  });

  test("robôs que preenchem o campo oculto não geram mensagem", async ({ page, request }) => {
    const nome = `${unique} robô`;
    await page.goto("/contato");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.getByRole("textbox", { name: "Nome" }).fill(nome);
    await page.getByRole("textbox", { name: "E-mail" }).fill("robo@example.com");
    await page.getByRole("textbox", { name: "Mensagem" }).fill("Compre agora, oferta imperdível para você.");
    await page.locator('input[name="site"]').fill("https://spam.example");
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("Mensagem enviada");
    const { docs } = await mensagens(request, nome);
    expect(docs).toHaveLength(0);
  });
});
