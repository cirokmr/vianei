import type { FieldHook, TextField } from "payload";

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const fromField =
  (source: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === "string" && value.trim()) return slugify(value);
    const title = data?.[source] ?? originalDoc?.[source];
    return typeof title === "string" ? slugify(title) : value;
  };

/**
 * URL slug derived from `source` when left empty. Kept editable so migrated
 * WordPress URLs can be preserved exactly.
 */
export function slugField(source = "titulo"): TextField {
  return {
    name: "slug",
    type: "text",
    label: "Endereço (slug)",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: "Gerado a partir do título se ficar em branco. Mudar o slug de algo já publicado quebra links.",
    },
    hooks: { beforeValidate: [fromField(source)] },
  };
}
