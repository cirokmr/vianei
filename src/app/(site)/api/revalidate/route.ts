import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { cacheTags } from "@/lib/cms/tags";

const COLLECTIONS = ["noticias", "projetos", "publicacoes", "paginas", "videos", "categorias", "parceiros", "pessoas"];
const GLOBALS = ["site", "numeros", "timeline"];

/**
 * Expires every CMS cache tag. For writes that bypass Payload hooks inside a
 * Next request, e.g. the WordPress import script: POST with the header
 * `x-revalidate-secret: $REVALIDATE_SECRET`.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "não autorizado" }, { status: 401 });
  }
  const tags = [...COLLECTIONS.map(cacheTags.collection), ...GLOBALS.map(cacheTags.global)];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
