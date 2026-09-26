import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { collectErrors } from "./errors";

test.describe("fundação", () => {
  test("home has no WCAG 2.2 AA violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    // Let the intro reveal finish so axe sees the settled layout.
    await page.waitForTimeout(2500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("page structure: lang, single h1, skip link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator("h1")).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  });

  test("motion layer boots without console errors", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(600);
    expect(errors).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is visible and nothing is pinned", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Ninguém nasce feito", { exact: false })).toBeVisible();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
  });
});

test.describe("no javascript", () => {
  test.use({ javaScriptEnabled: false });

  test("server-rendered content is readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});
