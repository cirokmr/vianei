import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_paginas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__paginas_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "paginas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"conteudo" jsonb,
  	"caminho" varchar,
  	"projeto_id" integer,
  	"legado_wp_id" numeric,
  	"legado_wp_url" varchar,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"seo_imagem_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_paginas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_paginas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_conteudo" jsonb,
  	"version_caminho" varchar,
  	"version_projeto_id" integer,
  	"version_legado_wp_id" numeric,
  	"version_legado_wp_url" varchar,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"version_seo_imagem_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__paginas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "noticias" ADD COLUMN "legado_wp_id" numeric;
  ALTER TABLE "noticias" ADD COLUMN "legado_wp_url" varchar;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_legado_wp_id" numeric;
  ALTER TABLE "_noticias_v" ADD COLUMN "version_legado_wp_url" varchar;
  ALTER TABLE "projetos" ADD COLUMN "legado_wp_id" numeric;
  ALTER TABLE "projetos" ADD COLUMN "legado_wp_url" varchar;
  ALTER TABLE "_projetos_v" ADD COLUMN "version_legado_wp_id" numeric;
  ALTER TABLE "_projetos_v" ADD COLUMN "version_legado_wp_url" varchar;
  ALTER TABLE "publicacoes" ADD COLUMN "legado_wp_id" numeric;
  ALTER TABLE "publicacoes" ADD COLUMN "legado_wp_url" varchar;
  ALTER TABLE "_publicacoes_v" ADD COLUMN "version_legado_wp_id" numeric;
  ALTER TABLE "_publicacoes_v" ADD COLUMN "version_legado_wp_url" varchar;
  ALTER TABLE "midia" ADD COLUMN "origem" varchar;
  ALTER TABLE "documentos" ADD COLUMN "origem" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "paginas_id" integer;
  ALTER TABLE "paginas" ADD CONSTRAINT "paginas_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "paginas" ADD CONSTRAINT "paginas_seo_imagem_id_midia_id_fk" FOREIGN KEY ("seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_parent_id_paginas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paginas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_version_projeto_id_projetos_id_fk" FOREIGN KEY ("version_projeto_id") REFERENCES "public"."projetos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_version_seo_imagem_id_midia_id_fk" FOREIGN KEY ("version_seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "paginas_caminho_idx" ON "paginas" USING btree ("caminho");
  CREATE INDEX "paginas_projeto_idx" ON "paginas" USING btree ("projeto_id");
  CREATE INDEX "paginas_legado_legado_wp_id_idx" ON "paginas" USING btree ("legado_wp_id");
  CREATE INDEX "paginas_seo_seo_imagem_idx" ON "paginas" USING btree ("seo_imagem_id");
  CREATE INDEX "paginas_updated_at_idx" ON "paginas" USING btree ("updated_at");
  CREATE INDEX "paginas_created_at_idx" ON "paginas" USING btree ("created_at");
  CREATE INDEX "paginas__status_idx" ON "paginas" USING btree ("_status");
  CREATE INDEX "_paginas_v_parent_idx" ON "_paginas_v" USING btree ("parent_id");
  CREATE INDEX "_paginas_v_version_version_caminho_idx" ON "_paginas_v" USING btree ("version_caminho");
  CREATE INDEX "_paginas_v_version_version_projeto_idx" ON "_paginas_v" USING btree ("version_projeto_id");
  CREATE INDEX "_paginas_v_version_legado_version_legado_wp_id_idx" ON "_paginas_v" USING btree ("version_legado_wp_id");
  CREATE INDEX "_paginas_v_version_seo_version_seo_imagem_idx" ON "_paginas_v" USING btree ("version_seo_imagem_id");
  CREATE INDEX "_paginas_v_version_version_updated_at_idx" ON "_paginas_v" USING btree ("version_updated_at");
  CREATE INDEX "_paginas_v_version_version_created_at_idx" ON "_paginas_v" USING btree ("version_created_at");
  CREATE INDEX "_paginas_v_version_version__status_idx" ON "_paginas_v" USING btree ("version__status");
  CREATE INDEX "_paginas_v_created_at_idx" ON "_paginas_v" USING btree ("created_at");
  CREATE INDEX "_paginas_v_updated_at_idx" ON "_paginas_v" USING btree ("updated_at");
  CREATE INDEX "_paginas_v_latest_idx" ON "_paginas_v" USING btree ("latest");
  CREATE INDEX "_paginas_v_autosave_idx" ON "_paginas_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paginas_fk" FOREIGN KEY ("paginas_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "noticias_legado_legado_wp_id_idx" ON "noticias" USING btree ("legado_wp_id");
  CREATE INDEX "_noticias_v_version_legado_version_legado_wp_id_idx" ON "_noticias_v" USING btree ("version_legado_wp_id");
  CREATE INDEX "projetos_legado_legado_wp_id_idx" ON "projetos" USING btree ("legado_wp_id");
  CREATE INDEX "_projetos_v_version_legado_version_legado_wp_id_idx" ON "_projetos_v" USING btree ("version_legado_wp_id");
  CREATE INDEX "publicacoes_legado_legado_wp_id_idx" ON "publicacoes" USING btree ("legado_wp_id");
  CREATE INDEX "_publicacoes_v_version_legado_version_legado_wp_id_idx" ON "_publicacoes_v" USING btree ("version_legado_wp_id");
  CREATE INDEX "midia_origem_idx" ON "midia" USING btree ("origem");
  CREATE INDEX "documentos_origem_idx" ON "documentos" USING btree ("origem");
  CREATE INDEX "payload_locked_documents_rels_paginas_id_idx" ON "payload_locked_documents_rels" USING btree ("paginas_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "paginas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_paginas_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "paginas" CASCADE;
  DROP TABLE "_paginas_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_paginas_fk";
  
  DROP INDEX "noticias_legado_legado_wp_id_idx";
  DROP INDEX "_noticias_v_version_legado_version_legado_wp_id_idx";
  DROP INDEX "projetos_legado_legado_wp_id_idx";
  DROP INDEX "_projetos_v_version_legado_version_legado_wp_id_idx";
  DROP INDEX "publicacoes_legado_legado_wp_id_idx";
  DROP INDEX "_publicacoes_v_version_legado_version_legado_wp_id_idx";
  DROP INDEX "midia_origem_idx";
  DROP INDEX "documentos_origem_idx";
  DROP INDEX "payload_locked_documents_rels_paginas_id_idx";
  ALTER TABLE "noticias" DROP COLUMN "legado_wp_id";
  ALTER TABLE "noticias" DROP COLUMN "legado_wp_url";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_legado_wp_id";
  ALTER TABLE "_noticias_v" DROP COLUMN "version_legado_wp_url";
  ALTER TABLE "projetos" DROP COLUMN "legado_wp_id";
  ALTER TABLE "projetos" DROP COLUMN "legado_wp_url";
  ALTER TABLE "_projetos_v" DROP COLUMN "version_legado_wp_id";
  ALTER TABLE "_projetos_v" DROP COLUMN "version_legado_wp_url";
  ALTER TABLE "publicacoes" DROP COLUMN "legado_wp_id";
  ALTER TABLE "publicacoes" DROP COLUMN "legado_wp_url";
  ALTER TABLE "_publicacoes_v" DROP COLUMN "version_legado_wp_id";
  ALTER TABLE "_publicacoes_v" DROP COLUMN "version_legado_wp_url";
  ALTER TABLE "midia" DROP COLUMN "origem";
  ALTER TABLE "documentos" DROP COLUMN "origem";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "paginas_id";
  DROP TYPE "public"."enum_paginas_status";
  DROP TYPE "public"."enum__paginas_v_version_status";`)
}
