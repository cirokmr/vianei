import type { Field } from "payload";

/**
 * Provenance of content imported from the old WordPress site. Makes the
 * importer idempotent (upsert by wpId) and documents the original URL.
 */
export const legadoField: Field = {
  name: "legado",
  label: "Origem (site antigo)",
  type: "group",
  admin: {
    position: "sidebar",
    readOnly: true,
    condition: (data) => Boolean(data?.legado?.wpId),
    description: "Preenchido pela migração do WordPress.",
  },
  fields: [
    { name: "wpId", label: "ID no WordPress", type: "number", index: true },
    { name: "wpUrl", label: "Endereço antigo", type: "text" },
  ],
};

/** Source URL of a migrated file, used to avoid re-uploading it. */
export const origemField: Field = {
  name: "origem",
  type: "text",
  index: true,
  admin: { readOnly: true, position: "sidebar", condition: (data) => Boolean(data?.origem) },
};
