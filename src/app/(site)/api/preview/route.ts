import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/**
 * Enables draft mode and redirects to the page being previewed. Called by the
 * admin's Preview / Live Preview with a shared secret.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") ?? "/";

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response("Preview não autorizado.", { status: 401 });
  }
  // Only same-site paths: blocks open redirects like "//evil.com".
  if (!path.startsWith("/") || path.startsWith("//")) {
    return new Response("Caminho inválido.", { status: 400 });
  }

  (await draftMode()).enable();
  redirect(path);
}
