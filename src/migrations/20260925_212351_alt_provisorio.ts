import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "midia" ADD COLUMN "alt_provisorio" boolean DEFAULT false;
  CREATE INDEX "midia_alt_provisorio_idx" ON "midia" USING btree ("alt_provisorio");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "midia_alt_provisorio_idx";
  ALTER TABLE "midia" DROP COLUMN "alt_provisorio";`)
}
