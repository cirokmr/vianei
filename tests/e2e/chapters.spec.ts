import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Phase 5: the Home and "Quem somos" chapters. CI runs against a seeded
// database (no migrated news), so nothing here depends on imported content.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const anos = `${new Date().getFullYear() - 1983} anos`;

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(800);
}

for (const path of ["/", "/quem-somos"]) {
  test.describe(`capítulos de ${path}`, () => {
    test("sem violações WCAG 2.2 AA, no topo e depois de rolar tudo", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveClass(/motion-ready/);
      await page.waitForTimeout(2000);
      expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
      await scrollThrough(page);
      expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
    });

    test("rola do início ao fim sem erros no console e com um único h1", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveClass(/motion-ready/);
      await page.waitForTimeout(1500);
      await scrollThrough(page);
      expect(errors).toEqual([]);
    });
  });
}

test.describe("home", () => {
  test("sete capítulos, na ordem do roteiro", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("[data-chapter]").evaluateAll((els) => els.map((el) => el.id));
    // "Agora no território" only renders when there is published news.
    expect(ids.filter((id) => id !== "agora")).toEqual([
      "amanhecer",
      "manifesto",
      "desde-1983",
      "o-que-fazemos",
      "numeros",
      "juntos",
    ]);
  });

  test("a foto do hero entra depois do load, sem disputar com o título (LCP)", async ({ page, request }) => {
    // In the server HTML only as a <noscript> fallback: never in the first round of requests.
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/<noscript>.*araucaria-vertical/s);
    await page.goto("/");
    const photo = page.locator("[data-dawn-photo] img");
    await expect(photo).toHaveAttribute("alt", /araucária/);
    await expect(page.locator('[data-dawn-photo] source[media="(min-width: 768px)"]')).toHaveCount(1);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  });

  test("o hero é fixado sem ser reinserido no DOM (LCP)", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator('section[aria-label="Amanhecer"]');
    const wrapper = await hero.evaluateHandle((el) => el.parentElement!);
    await expect(page.locator(".pin-spacer").first()).toBeAttached({ timeout: 8000 });
    // GSAP reused the server-rendered wrapper as its pin spacer instead of
    // wrapping the section in a new div (which would re-insert the headline).
    expect(await wrapper.evaluate((el) => el.classList.contains("pin-spacer"))).toBe(true);
    expect(await hero.evaluate((el, w) => el.parentElement === w, wrapper)).toBe(true);
  });

  test("anos de atuação vêm do ano de fundação, nunca de um número fixo", async ({ page }) => {
    await page.goto("/");
    const numero = page.locator("#numeros dd").first();
    await expect(async () => {
      await numero.scrollIntoViewIfNeeded();
      await expect(numero.locator("[aria-hidden]")).toHaveText(anos, { timeout: 1500 });
    }).toPass({ timeout: 12_000 });
  });

  test("índice de capítulos leva ao capítulo e move o foco", async ({ page, isMobile }) => {
    test.skip(isMobile, "o índice só aparece em telas grandes");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.waitForTimeout(1500);
    const rail = page.getByRole("navigation", { name: "Capítulos desta página" });
    await rail.getByRole("link", { name: "Em números" }).click();
    await expect(page.locator("#numeros")).toBeFocused();
    await expect
      .poll(() => page.locator("#numeros").evaluate((el) => Math.abs(el.getBoundingClientRect().top)), {
        timeout: 5000,
      })
      .toBeLessThan(40);
    await expect(rail.locator('[aria-current="step"]')).toHaveText("Em números");
  });

  test("parceiros do painel aparecem na faixa", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Parceiros e apoiadores do Centro Vianei" })).toContainText(
      "MISEREOR",
    );
  });
});

test.describe("quem somos", () => {
  test("história, equipe e parceiros vêm do painel", async ({ page }) => {
    await page.goto("/quem-somos");
    await expect(page.getByRole("heading", { level: 1, name: "Quem somos" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Formalização como AVICITECS/ })).toBeAttached();
    await expect(page.getByText("Ivo Severino Macagnan")).toBeAttached();
    await expect(page.getByText("Natal João Magnanti")).toBeAttached();
    await expect(page.getByRole("region", { name: "Apoiadores" })).toContainText("MISEREOR");
  });

  test("não expõe e-mails pessoais que a equipe não liberou", async ({ page }) => {
    const response = await page.goto("/quem-somos");
    expect(await response!.text()).not.toMatch(/@gmail\.com/);
  });
});

test.describe("home e quem somos com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/", "/quem-somos"]) {
    test(`${path}: nada é fixado e todo o conteúdo fica legível`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveClass(/motion-ready/);
      await page.waitForTimeout(2000);
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      await expect(page.locator(".is-pinned")).toHaveCount(0);
      await expect(page.locator("canvas")).toHaveCount(0);
      for (const titulo of ["Nasce o Projeto Vianei", "Formalização como AVICITECS"]) {
        await expect(page.getByRole("heading", { name: titulo }).first()).toBeVisible();
      }
    });
  }
});
