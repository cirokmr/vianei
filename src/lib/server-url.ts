/**
 * Public origin of this deployment. An explicit NEXT_PUBLIC_SERVER_URL wins
 * (local dev, custom domain); on Vercel it falls back to the deployment's own
 * host: the branch URL for previews, the production URL otherwise. Works on
 * the server (VERCEL_*) and in the browser (NEXT_PUBLIC_VERCEL_*, exposed by
 * Vercel for Next.js projects).
 */
export function serverUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SERVER_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const env = process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  const host =
    env === "production"
      ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
      : (process.env.VERCEL_BRANCH_URL ??
        process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ??
        process.env.VERCEL_URL ??
        process.env.NEXT_PUBLIC_VERCEL_URL);
  return host ? `https://${host}` : "http://localhost:3000";
}
