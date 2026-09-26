import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The /lab page exercises every motion primitive. CI builds with ENABLE_LAB=1.

test.describe("lab: primitivas de movimento", () => {
  test("sem violações WCAG 2.2 AA", async ({ page }) => {
    await page.goto("/lab");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.waitForTimeout(2500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("rolar a página inteira sem erros no console", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/lab");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.waitForTimeout(1500);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });

  test("capítulo fixo avança por etapas e o header escurece sobre ele", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop layout");
    await page.goto("/lab");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    const chapter = page.getByRole("region", { name: "Linha do tempo (exemplo)" });
    await expect(chapter).toHaveClass(/is-pinned/, { timeout: 5000 });

    await chapter.scrollIntoViewIfNeeded();
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1200);
    await expect(page.locator("[data-site-header]")).toHaveAttribute("data-on-dark", "");
    await expect(chapter.locator(".chapter-counter")).not.toHaveText(/^01/);
  });

  test("contador termina no valor real", async ({ page }) => {
    await page.goto("/lab");
    const counter = page.getByText("de educação popular", { exact: true }).locator("..");
    // Pins above it are set up lazily and push it down: keep bringing it into view.
    await expect(async () => {
      await counter.scrollIntoViewIfNeeded();
      await expect(counter.locator("dd [aria-hidden]")).toHaveText("43 anos", { timeout: 1500 });
    }).toPass({ timeout: 12_000 });
  });
});

test.describe("lab com movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("nada é fixado e todo o conteúdo fica visível", async ({ page }) => {
    await page.goto("/lab");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.waitForTimeout(2000);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(".is-pinned")).toHaveCount(0);
    await expect(page.locator(".marquee.is-running")).toHaveCount(0);
    // Every timeline step is readable in normal flow.
    for (const ano of ["1983", "1988", "2000", "2026"]) {
      await expect(page.getByText(ano, { exact: true })).toBeVisible();
    }
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});

test.describe("menu mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("abre como diálogo, fecha com Esc e devolve o foco", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Fechar" })).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("navegar fecha o menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "Notícias" }).click();
    await expect(page).toHaveURL(/\/noticias$/);
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
  });
});
