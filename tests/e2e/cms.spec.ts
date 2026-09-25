import { expect, test, type APIRequestContext } from "@playwright/test";

// Exercises the editorial pipeline against a real Postgres: publish → page,
// edit → revalidated page, draft → never public. Requires the seed admin
// (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD) and PREVIEW_SECRET.

const email = process.env.SEED_ADMIN_EMAIL ?? "dev@vianei.local";
const password = process.env.SEED_ADMIN_PASSWORD ?? "dev-password-123";

function paragraph(text: string) {
  return {
    root: {
      type: "root",
      version: 1,
      direction: null,
      format: "",
      indent: 0,
      children: [
        {
          type: "paragraph",
          version: 1,
          direction: null,
          format: "",
          indent: 0,
          textFormat: 0,
          children: [{ type: "text", version: 1, text, format: 0, mode: "normal", style: "", detail: 0 }],
        },
      ],
    },
  };
}

async function login(request: APIRequestContext) {
  const res = await request.post("/api/usuarios/login", { data: { email, password } });
  expect(res.ok()).toBeTruthy();
  return { Authorization: `JWT ${(await res.json()).token}` };
}

test.describe.configure({ mode: "serial" });

test.describe("CMS: notícias", () => {
  const unique = Date.now().toString(36);
  const titulo = `Teste E2E ${unique}`;
  let id: number;
  let slug: string;
  let headers: Record<string, string>;

  test.beforeAll(async ({ request }) => {
    headers = await login(request);
  });

  test.afterAll(async ({ request }) => {
    if (id) await request.delete(`/api/noticias/${id}`, { headers });
  });

  test("publicar cria a página e entra na lista", async ({ page, request }) => {
    const res = await request.post("/api/noticias", {
      headers,
      data: { titulo, resumo: "Resumo de teste.", _status: "published", conteudo: paragraph("Corpo publicado.") },
    });
    expect(res.status()).toBe(201);
    ({ id, slug } = (await res.json()).doc);
    expect(slug).toBe(`teste-e2e-${unique}`);

    await page.goto(`/noticias/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(titulo);
    await expect(page.getByText("Corpo publicado.")).toBeVisible();

    await page.goto("/noticias");
    await expect(page.getByRole("link", { name: new RegExp(titulo) })).toBeVisible();
  });

  test("editar revalida a página na hora", async ({ page, request }) => {
    const novo = `${titulo} (editado)`;
    const res = await request.patch(`/api/noticias/${id}`, { headers, data: { titulo: novo } });
    expect(res.ok()).toBeTruthy();

    await page.goto(`/noticias/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(novo);
  });

  test("rascunho não aparece para o público, só na pré-visualização", async ({ page, request }) => {
    const res = await request.patch(`/api/noticias/${id}?draft=true`, {
      headers,
      data: { titulo: `Rascunho ${unique}`, _status: "draft" },
    });
    expect(res.ok()).toBeTruthy();

    await page.goto(`/noticias/${slug}`);
    await expect(page.getByText(`Rascunho ${unique}`)).toHaveCount(0);

    const anon = await request.get(`/api/noticias?draft=true&where[slug][equals]=${slug}`);
    expect(JSON.stringify(await anon.json())).not.toContain(`Rascunho ${unique}`);

    const secret = process.env.PREVIEW_SECRET;
    test.skip(!secret, "PREVIEW_SECRET não definido");
    await page.goto(`/api/preview?secret=${secret}&path=/noticias/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(`Rascunho ${unique}`);
    await expect(page.getByText("Pré-visualização de rascunho")).toBeVisible();
  });

  test("preview recusa segredo errado e redirecionamento externo", async ({ request }) => {
    const bad = await request.get(`/api/preview?secret=errado&path=/`, { maxRedirects: 0 });
    expect(bad.status()).toBe(401);
    const open = await request.get(`/api/preview?secret=${process.env.PREVIEW_SECRET}&path=//evil.com`, {
      maxRedirects: 0,
    });
    expect([400, 401]).toContain(open.status());
  });
});

test.describe("CMS: painel", () => {
  test("login do painel em português", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("PAINEL DO SITE")).toBeVisible();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Senha").fill(password);
    await page.getByRole("button", { name: /^(login|entrar)$/i }).click();
    await expect(page.getByRole("heading", { name: "Conteúdo" })).toBeVisible();
  });

  test("API pública não expõe e-mails de pessoas por padrão", async ({ request }) => {
    const res = await request.get("/api/pessoas?limit=100");
    const { docs } = await res.json();
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) if (!doc.emailPublico) expect(doc.email).toBeUndefined();
  });

  test("usuários não são listáveis sem login", async ({ request }) => {
    const res = await request.get("/api/usuarios");
    expect([401, 403]).toContain(res.status());
  });
});
