import type { CollectionConfig } from "payload";
import { admins, adminsField, adminsOrSelf, authenticated } from "../access";

export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  labels: { singular: "Usuário", plural: "Usuários" },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "email", "roles"],
    group: "Equipe",
  },
  access: {
    admin: authenticated,
    create: admins,
    delete: admins,
    read: adminsOrSelf,
    update: adminsOrSelf,
  },
  fields: [
    { name: "nome", type: "text", required: true },
    {
      name: "roles",
      label: "Papel",
      type: "select",
      hasMany: true,
      defaultValue: ["editor"],
      required: true,
      saveToJWT: true,
      options: [
        { label: "Administrador (gerencia usuários e configurações)", value: "admin" },
        { label: "Editor (publica conteúdo)", value: "editor" },
      ],
      access: { create: adminsField, update: adminsField },
    },
  ],
};
