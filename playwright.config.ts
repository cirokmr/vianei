import { defineConfig, devices } from "@playwright/test";

// Tests read PREVIEW_SECRET / SEED_ADMIN_* from the environment or .env.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env (CI): variables come from the environment.
}

const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // Local sandboxes may ship a pinned Chromium; CI installs its own.
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // CMS specs mutate shared data; running them once (desktop) avoids races.
    { name: "mobile", use: { ...devices["Pixel 7"] }, testIgnore: /cms\.spec/ },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
