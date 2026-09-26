// TEMPORARY diagnostic: lists a few blob pathnames/urls. Remove after use.
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return Response.json({ token: false });
  try {
    const r = await list({ token, limit: 5 });
    return Response.json({
      storeHint: token.split("_")[3]?.toLowerCase(),
      count: r.blobs.length,
      hasMore: r.hasMore,
      blobs: r.blobs.map((b) => ({ pathname: b.pathname, url: b.url, size: b.size, uploadedAt: b.uploadedAt })),
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message });
  }
}
