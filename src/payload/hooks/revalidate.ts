import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";
import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cms/tags";

type Doc = { id: number | string; slug?: string | null; _status?: string | null };

/**
 * Expires cached pages that depend on a document. `expire: 0` makes the next
 * request fetch fresh data, so editors see a publish immediately.
 * Skipped outside a Next.js request (seed/migration scripts) via
 * `context.disableRevalidate`.
 */
function expire(tags: string[]) {
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
}

function docTags(collection: string, doc: Doc | undefined) {
  const tags = [cacheTags.collection(collection)];
  if (doc?.slug) tags.push(cacheTags.doc(collection, doc.slug));
  return tags;
}

export const revalidateCollection: CollectionAfterChangeHook<Doc> = ({ collection, doc, previousDoc, context }) => {
  if (context.disableRevalidate) return doc;
  // Drafts saved (and autosaves) don't touch the public site.
  const affectsPublic = doc._status !== "draft" || previousDoc?._status === "published";
  if (!affectsPublic) return doc;

  expire([...docTags(collection.slug, doc), ...docTags(collection.slug, previousDoc)]);
  return doc;
};

export const revalidateCollectionDelete: CollectionAfterDeleteHook<Doc> = ({ collection, doc, context }) => {
  if (context.disableRevalidate) return doc;
  expire(docTags(collection.slug, doc));
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ global, doc, context }) => {
  if (context.disableRevalidate) return doc;
  expire([cacheTags.global(global.slug)]);
  return doc;
};
