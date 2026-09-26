import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { pt } from "@payloadcms/translations/languages/pt";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Categorias } from "./payload/collections/Categorias";
import { Documentos } from "./payload/collections/Documentos";
import { Midia } from "./payload/collections/Midia";
import { Noticias } from "./payload/collections/Noticias";
import { Paginas } from "./payload/collections/Paginas";
import { Parceiros } from "./payload/collections/Parceiros";
import { Pessoas } from "./payload/collections/Pessoas";
import { Projetos } from "./payload/collections/Projetos";
import { Publicacoes } from "./payload/collections/Publicacoes";
import { Usuarios } from "./payload/collections/Usuarios";
import { Mensagens } from "./payload/collections/Mensagens";
import { Videos } from "./payload/collections/Videos";
import { Numeros } from "./payload/globals/Numeros";
import { Site } from "./payload/globals/Site";
import { Timeline } from "./payload/globals/Timeline";
import { serverUrl } from "./lib/server-url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const serverURL = serverUrl();

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: Usuarios.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · Painel Vianei" },
    avatar: "default",
    components: {
      graphics: {
        Logo: "@/payload/admin/Logo",
        Icon: "@/payload/admin/Icon",
      },
    },
    livePreview: {
      breakpoints: [
        { name: "mobile", label: "Celular", width: 390, height: 844 },
        { name: "desktop", label: "Computador", width: 1440, height: 900 },
      ],
    },
  },
  i18n: { supportedLanguages: { pt }, fallbackLanguage: "pt" },
  collections: [
    Noticias,
    Projetos,
    Publicacoes,
    Paginas,
    Videos,
    Categorias,
    Parceiros,
    Pessoas,
    Midia,
    Documentos,
    Usuarios,
    Mensagens,
  ],
  globals: [Site, Numeros, Timeline],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? "" },
    migrationDir: path.resolve(dirname, "migrations"),
    // Schema changes go through committed migrations, never auto-push.
    push: false,
  }),
  sharp,
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
  // Contact notifications. Without SMTP_HOST, Payload logs e-mails to the console.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM ?? "site@vianei.org.br",
        defaultFromName: "Site Centro Vianei",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  plugins: [
    // Production media lives in Vercel Blob; without a token (local dev, CI)
    // uploads fall back to the local disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Keep the storage fields (prefix, _objectKey) in the schema even when the
      // plugin is off, so migrations generated locally match production.
      alwaysInsertFields: true,
      collections: { midia: true, documentos: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
});
