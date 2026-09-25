// Cache tag conventions shared by the data layer (tagging) and Payload hooks
// (invalidation). Keep both sides going through these helpers.
export const cacheTags = {
  collection: (slug: string) => `c:${slug}`,
  doc: (collection: string, slug: string) => `c:${collection}:${slug}`,
  global: (slug: string) => `g:${slug}`,
};
