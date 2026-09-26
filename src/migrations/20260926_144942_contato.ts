import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "mensagens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"assunto" varchar,
  	"mensagem" varchar NOT NULL,
  	"lida" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mensagens_id" integer;
  CREATE INDEX "mensagens_updated_at_idx" ON "mensagens" USING btree ("updated_at");
  CREATE INDEX "mensagens_created_at_idx" ON "mensagens" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensagens_fk" FOREIGN KEY ("mensagens_id") REFERENCES "public"."mensagens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_mensagens_id_idx" ON "payload_locked_documents_rels" USING btree ("mensagens_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "mensagens" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "mensagens" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_mensagens_fk";
  
  DROP INDEX "payload_locked_documents_rels_mensagens_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "mensagens_id";`)
}
