import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_noticias_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__noticias_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projetos_areas" AS ENUM('educacao-popular', 'agroecologia', 'restauracao-florestal', 'cultura-sat-pinhao');
  CREATE TYPE "public"."enum_projetos_situacao" AS ENUM('ativo', 'concluido');
  CREATE TYPE "public"."enum_projetos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projetos_v_version_areas" AS ENUM('educacao-popular', 'agroecologia', 'restauracao-florestal', 'cultura-sat-pinhao');
  CREATE TYPE "public"."enum__projetos_v_version_situacao" AS ENUM('ativo', 'concluido');
  CREATE TYPE "public"."enum__projetos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_publicacoes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publicacoes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_parceiros_tipo" AS ENUM('apoiador', 'parceiro');
  CREATE TYPE "public"."enum_pessoas_grupo" AS ENUM('diretoria', 'conselho-fiscal', 'equipe-tecnica');
  CREATE TYPE "public"."enum_usuarios_roles" AS ENUM('admin', 'editor');
  CREATE TABLE "noticias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"resumo" varchar,
  	"capa_id" integer,
  	"conteudo" jsonb,
  	"slug" varchar,
  	"publicado_em" timestamp(3) with time zone,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"seo_imagem_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_noticias_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "noticias_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categorias_id" integer,
  	"projetos_id" integer
  );
  
  CREATE TABLE "_noticias_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_resumo" varchar,
  	"version_capa_id" integer,
  	"version_conteudo" jsonb,
  	"version_slug" varchar,
  	"version_publicado_em" timestamp(3) with time zone,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"version_seo_imagem_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__noticias_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_noticias_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categorias_id" integer,
  	"projetos_id" integer
  );
  
  CREATE TABLE "projetos_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagem_id" integer
  );
  
  CREATE TABLE "projetos_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projetos_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projetos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"resumo" varchar,
  	"capa_id" integer,
  	"conteudo" jsonb,
  	"slug" varchar,
  	"situacao" "enum_projetos_situacao" DEFAULT 'ativo',
  	"inicio" timestamp(3) with time zone,
  	"fim" timestamp(3) with time zone,
  	"destaque" boolean,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"seo_imagem_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projetos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projetos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"parceiros_id" integer
  );
  
  CREATE TABLE "_projetos_v_version_galeria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"imagem_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projetos_v_version_areas" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projetos_v_version_areas",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projetos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_resumo" varchar,
  	"version_capa_id" integer,
  	"version_conteudo" jsonb,
  	"version_slug" varchar,
  	"version_situacao" "enum__projetos_v_version_situacao" DEFAULT 'ativo',
  	"version_inicio" timestamp(3) with time zone,
  	"version_fim" timestamp(3) with time zone,
  	"version_destaque" boolean,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"version_seo_imagem_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projetos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projetos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"parceiros_id" integer
  );
  
  CREATE TABLE "publicacoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descricao" varchar,
  	"autoria" varchar,
  	"capa_id" integer,
  	"arquivo_id" integer,
  	"link_externo" varchar,
  	"slug" varchar,
  	"ano" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_publicacoes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_publicacoes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_descricao" varchar,
  	"version_autoria" varchar,
  	"version_capa_id" integer,
  	"version_arquivo_id" integer,
  	"version_link_externo" varchar,
  	"version_slug" varchar,
  	"version_ano" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__publicacoes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"youtube" varchar NOT NULL,
  	"descricao" varchar,
  	"publicado_em" timestamp(3) with time zone,
  	"destaque" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "parceiros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"descricao" varchar,
  	"tipo" "enum_parceiros_tipo" DEFAULT 'parceiro' NOT NULL,
  	"logo_id" integer,
  	"site" varchar,
  	"ordem" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pessoas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"grupo" "enum_pessoas_grupo" NOT NULL,
  	"cargo" varchar,
  	"formacao" varchar,
  	"foto_id" integer,
  	"email" varchar,
  	"email_publico" boolean DEFAULT false,
  	"ordem" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "midia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"legenda" varchar,
  	"credito" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_miniatura_url" varchar,
  	"sizes_miniatura_width" numeric,
  	"sizes_miniatura_height" numeric,
  	"sizes_miniatura_mime_type" varchar,
  	"sizes_miniatura_filesize" numeric,
  	"sizes_miniatura_filename" varchar,
  	"sizes_cartao_url" varchar,
  	"sizes_cartao_width" numeric,
  	"sizes_cartao_height" numeric,
  	"sizes_cartao_mime_type" varchar,
  	"sizes_cartao_filesize" numeric,
  	"sizes_cartao_filename" varchar,
  	"sizes_destaque_url" varchar,
  	"sizes_destaque_width" numeric,
  	"sizes_destaque_height" numeric,
  	"sizes_destaque_mime_type" varchar,
  	"sizes_destaque_filesize" numeric,
  	"sizes_destaque_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "documentos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "usuarios_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_usuarios_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"noticias_id" integer,
  	"projetos_id" integer,
  	"publicacoes_id" integer,
  	"videos_id" integer,
  	"categorias_id" integer,
  	"parceiros_id" integer,
  	"pessoas_id" integer,
  	"midia_id" integer,
  	"documentos_id" integer,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar DEFAULT 'Centro Vianei de Educação Popular' NOT NULL,
  	"razao_social" varchar DEFAULT 'AVICITECS – Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde',
  	"cnpj" varchar DEFAULT '78.492.261/0001-63',
  	"email" varchar DEFAULT 'contato@vianei.org.br' NOT NULL,
  	"telefone" varchar,
  	"endereco_logradouro" varchar DEFAULT 'Av. Papa João XXIII, 1565 – Área Industrial',
  	"endereco_cidade" varchar DEFAULT 'Lages',
  	"endereco_uf" varchar DEFAULT 'SC',
  	"endereco_cep" varchar DEFAULT '88514-720',
  	"redes_instagram" varchar DEFAULT 'https://www.instagram.com/centrovianei/',
  	"redes_facebook" varchar DEFAULT 'https://www.facebook.com/centrovianei',
  	"redes_youtube" varchar DEFAULT 'https://www.youtube.com/channel/UCkEIv_GvLhWyFuYBl_y5i8w',
  	"redes_youtube_channel_id" varchar DEFAULT 'UCkEIv_GvLhWyFuYBl_y5i8w',
  	"estatuto_id" integer,
  	"mandato_diretoria" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "numeros_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valor" numeric NOT NULL,
  	"prefixo" varchar,
  	"sufixo" varchar,
  	"rotulo" varchar NOT NULL,
  	"fonte" varchar
  );
  
  CREATE TABLE "numeros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "timeline_marcos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ano" numeric NOT NULL,
  	"titulo" varchar NOT NULL,
  	"texto" varchar,
  	"imagem_id" integer
  );
  
  CREATE TABLE "timeline" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_capa_id_midia_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "noticias" ADD CONSTRAINT "noticias_seo_imagem_id_midia_id_fk" FOREIGN KEY ("seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "noticias_rels" ADD CONSTRAINT "noticias_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "noticias_rels" ADD CONSTRAINT "noticias_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "noticias_rels" ADD CONSTRAINT "noticias_rels_projetos_fk" FOREIGN KEY ("projetos_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_parent_id_noticias_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."noticias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_capa_id_midia_id_fk" FOREIGN KEY ("version_capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v" ADD CONSTRAINT "_noticias_v_version_seo_imagem_id_midia_id_fk" FOREIGN KEY ("version_seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_noticias_v_rels" ADD CONSTRAINT "_noticias_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_noticias_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_noticias_v_rels" ADD CONSTRAINT "_noticias_v_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_noticias_v_rels" ADD CONSTRAINT "_noticias_v_rels_projetos_fk" FOREIGN KEY ("projetos_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_galeria" ADD CONSTRAINT "projetos_galeria_imagem_id_midia_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos_galeria" ADD CONSTRAINT "projetos_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_areas" ADD CONSTRAINT "projetos_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos" ADD CONSTRAINT "projetos_capa_id_midia_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos" ADD CONSTRAINT "projetos_seo_imagem_id_midia_id_fk" FOREIGN KEY ("seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projetos_rels" ADD CONSTRAINT "projetos_rels_parceiros_fk" FOREIGN KEY ("parceiros_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v_version_galeria" ADD CONSTRAINT "_projetos_v_version_galeria_imagem_id_midia_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v_version_galeria" ADD CONSTRAINT "_projetos_v_version_galeria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projetos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v_version_areas" ADD CONSTRAINT "_projetos_v_version_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projetos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v" ADD CONSTRAINT "_projetos_v_parent_id_projetos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projetos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v" ADD CONSTRAINT "_projetos_v_version_capa_id_midia_id_fk" FOREIGN KEY ("version_capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v" ADD CONSTRAINT "_projetos_v_version_seo_imagem_id_midia_id_fk" FOREIGN KEY ("version_seo_imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projetos_v_rels" ADD CONSTRAINT "_projetos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projetos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projetos_v_rels" ADD CONSTRAINT "_projetos_v_rels_parceiros_fk" FOREIGN KEY ("parceiros_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publicacoes" ADD CONSTRAINT "publicacoes_capa_id_midia_id_fk" FOREIGN KEY ("capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publicacoes" ADD CONSTRAINT "publicacoes_arquivo_id_documentos_id_fk" FOREIGN KEY ("arquivo_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicacoes_v" ADD CONSTRAINT "_publicacoes_v_parent_id_publicacoes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publicacoes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicacoes_v" ADD CONSTRAINT "_publicacoes_v_version_capa_id_midia_id_fk" FOREIGN KEY ("version_capa_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publicacoes_v" ADD CONSTRAINT "_publicacoes_v_version_arquivo_id_documentos_id_fk" FOREIGN KEY ("version_arquivo_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "parceiros" ADD CONSTRAINT "parceiros_logo_id_midia_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_foto_id_midia_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "usuarios_roles" ADD CONSTRAINT "usuarios_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_noticias_fk" FOREIGN KEY ("noticias_id") REFERENCES "public"."noticias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projetos_fk" FOREIGN KEY ("projetos_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publicacoes_fk" FOREIGN KEY ("publicacoes_id") REFERENCES "public"."publicacoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parceiros_fk" FOREIGN KEY ("parceiros_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pessoas_fk" FOREIGN KEY ("pessoas_id") REFERENCES "public"."pessoas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_midia_fk" FOREIGN KEY ("midia_id") REFERENCES "public"."midia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documentos_fk" FOREIGN KEY ("documentos_id") REFERENCES "public"."documentos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_estatuto_id_documentos_id_fk" FOREIGN KEY ("estatuto_id") REFERENCES "public"."documentos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "numeros_itens" ADD CONSTRAINT "numeros_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."numeros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_marcos" ADD CONSTRAINT "timeline_marcos_imagem_id_midia_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "timeline_marcos" ADD CONSTRAINT "timeline_marcos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "noticias_capa_idx" ON "noticias" USING btree ("capa_id");
  CREATE UNIQUE INDEX "noticias_slug_idx" ON "noticias" USING btree ("slug");
  CREATE INDEX "noticias_publicado_em_idx" ON "noticias" USING btree ("publicado_em");
  CREATE INDEX "noticias_seo_seo_imagem_idx" ON "noticias" USING btree ("seo_imagem_id");
  CREATE INDEX "noticias_updated_at_idx" ON "noticias" USING btree ("updated_at");
  CREATE INDEX "noticias_created_at_idx" ON "noticias" USING btree ("created_at");
  CREATE INDEX "noticias__status_idx" ON "noticias" USING btree ("_status");
  CREATE INDEX "noticias_rels_order_idx" ON "noticias_rels" USING btree ("order");
  CREATE INDEX "noticias_rels_parent_idx" ON "noticias_rels" USING btree ("parent_id");
  CREATE INDEX "noticias_rels_path_idx" ON "noticias_rels" USING btree ("path");
  CREATE INDEX "noticias_rels_categorias_id_idx" ON "noticias_rels" USING btree ("categorias_id");
  CREATE INDEX "noticias_rels_projetos_id_idx" ON "noticias_rels" USING btree ("projetos_id");
  CREATE INDEX "_noticias_v_parent_idx" ON "_noticias_v" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_version_version_capa_idx" ON "_noticias_v" USING btree ("version_capa_id");
  CREATE INDEX "_noticias_v_version_version_slug_idx" ON "_noticias_v" USING btree ("version_slug");
  CREATE INDEX "_noticias_v_version_version_publicado_em_idx" ON "_noticias_v" USING btree ("version_publicado_em");
  CREATE INDEX "_noticias_v_version_seo_version_seo_imagem_idx" ON "_noticias_v" USING btree ("version_seo_imagem_id");
  CREATE INDEX "_noticias_v_version_version_updated_at_idx" ON "_noticias_v" USING btree ("version_updated_at");
  CREATE INDEX "_noticias_v_version_version_created_at_idx" ON "_noticias_v" USING btree ("version_created_at");
  CREATE INDEX "_noticias_v_version_version__status_idx" ON "_noticias_v" USING btree ("version__status");
  CREATE INDEX "_noticias_v_created_at_idx" ON "_noticias_v" USING btree ("created_at");
  CREATE INDEX "_noticias_v_updated_at_idx" ON "_noticias_v" USING btree ("updated_at");
  CREATE INDEX "_noticias_v_latest_idx" ON "_noticias_v" USING btree ("latest");
  CREATE INDEX "_noticias_v_autosave_idx" ON "_noticias_v" USING btree ("autosave");
  CREATE INDEX "_noticias_v_rels_order_idx" ON "_noticias_v_rels" USING btree ("order");
  CREATE INDEX "_noticias_v_rels_parent_idx" ON "_noticias_v_rels" USING btree ("parent_id");
  CREATE INDEX "_noticias_v_rels_path_idx" ON "_noticias_v_rels" USING btree ("path");
  CREATE INDEX "_noticias_v_rels_categorias_id_idx" ON "_noticias_v_rels" USING btree ("categorias_id");
  CREATE INDEX "_noticias_v_rels_projetos_id_idx" ON "_noticias_v_rels" USING btree ("projetos_id");
  CREATE INDEX "projetos_galeria_order_idx" ON "projetos_galeria" USING btree ("_order");
  CREATE INDEX "projetos_galeria_parent_id_idx" ON "projetos_galeria" USING btree ("_parent_id");
  CREATE INDEX "projetos_galeria_imagem_idx" ON "projetos_galeria" USING btree ("imagem_id");
  CREATE INDEX "projetos_areas_order_idx" ON "projetos_areas" USING btree ("order");
  CREATE INDEX "projetos_areas_parent_idx" ON "projetos_areas" USING btree ("parent_id");
  CREATE INDEX "projetos_capa_idx" ON "projetos" USING btree ("capa_id");
  CREATE UNIQUE INDEX "projetos_slug_idx" ON "projetos" USING btree ("slug");
  CREATE INDEX "projetos_seo_seo_imagem_idx" ON "projetos" USING btree ("seo_imagem_id");
  CREATE INDEX "projetos_updated_at_idx" ON "projetos" USING btree ("updated_at");
  CREATE INDEX "projetos_created_at_idx" ON "projetos" USING btree ("created_at");
  CREATE INDEX "projetos__status_idx" ON "projetos" USING btree ("_status");
  CREATE INDEX "projetos_rels_order_idx" ON "projetos_rels" USING btree ("order");
  CREATE INDEX "projetos_rels_parent_idx" ON "projetos_rels" USING btree ("parent_id");
  CREATE INDEX "projetos_rels_path_idx" ON "projetos_rels" USING btree ("path");
  CREATE INDEX "projetos_rels_parceiros_id_idx" ON "projetos_rels" USING btree ("parceiros_id");
  CREATE INDEX "_projetos_v_version_galeria_order_idx" ON "_projetos_v_version_galeria" USING btree ("_order");
  CREATE INDEX "_projetos_v_version_galeria_parent_id_idx" ON "_projetos_v_version_galeria" USING btree ("_parent_id");
  CREATE INDEX "_projetos_v_version_galeria_imagem_idx" ON "_projetos_v_version_galeria" USING btree ("imagem_id");
  CREATE INDEX "_projetos_v_version_areas_order_idx" ON "_projetos_v_version_areas" USING btree ("order");
  CREATE INDEX "_projetos_v_version_areas_parent_idx" ON "_projetos_v_version_areas" USING btree ("parent_id");
  CREATE INDEX "_projetos_v_parent_idx" ON "_projetos_v" USING btree ("parent_id");
  CREATE INDEX "_projetos_v_version_version_capa_idx" ON "_projetos_v" USING btree ("version_capa_id");
  CREATE INDEX "_projetos_v_version_version_slug_idx" ON "_projetos_v" USING btree ("version_slug");
  CREATE INDEX "_projetos_v_version_seo_version_seo_imagem_idx" ON "_projetos_v" USING btree ("version_seo_imagem_id");
  CREATE INDEX "_projetos_v_version_version_updated_at_idx" ON "_projetos_v" USING btree ("version_updated_at");
  CREATE INDEX "_projetos_v_version_version_created_at_idx" ON "_projetos_v" USING btree ("version_created_at");
  CREATE INDEX "_projetos_v_version_version__status_idx" ON "_projetos_v" USING btree ("version__status");
  CREATE INDEX "_projetos_v_created_at_idx" ON "_projetos_v" USING btree ("created_at");
  CREATE INDEX "_projetos_v_updated_at_idx" ON "_projetos_v" USING btree ("updated_at");
  CREATE INDEX "_projetos_v_latest_idx" ON "_projetos_v" USING btree ("latest");
  CREATE INDEX "_projetos_v_autosave_idx" ON "_projetos_v" USING btree ("autosave");
  CREATE INDEX "_projetos_v_rels_order_idx" ON "_projetos_v_rels" USING btree ("order");
  CREATE INDEX "_projetos_v_rels_parent_idx" ON "_projetos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projetos_v_rels_path_idx" ON "_projetos_v_rels" USING btree ("path");
  CREATE INDEX "_projetos_v_rels_parceiros_id_idx" ON "_projetos_v_rels" USING btree ("parceiros_id");
  CREATE INDEX "publicacoes_capa_idx" ON "publicacoes" USING btree ("capa_id");
  CREATE INDEX "publicacoes_arquivo_idx" ON "publicacoes" USING btree ("arquivo_id");
  CREATE UNIQUE INDEX "publicacoes_slug_idx" ON "publicacoes" USING btree ("slug");
  CREATE INDEX "publicacoes_updated_at_idx" ON "publicacoes" USING btree ("updated_at");
  CREATE INDEX "publicacoes_created_at_idx" ON "publicacoes" USING btree ("created_at");
  CREATE INDEX "publicacoes__status_idx" ON "publicacoes" USING btree ("_status");
  CREATE INDEX "_publicacoes_v_parent_idx" ON "_publicacoes_v" USING btree ("parent_id");
  CREATE INDEX "_publicacoes_v_version_version_capa_idx" ON "_publicacoes_v" USING btree ("version_capa_id");
  CREATE INDEX "_publicacoes_v_version_version_arquivo_idx" ON "_publicacoes_v" USING btree ("version_arquivo_id");
  CREATE INDEX "_publicacoes_v_version_version_slug_idx" ON "_publicacoes_v" USING btree ("version_slug");
  CREATE INDEX "_publicacoes_v_version_version_updated_at_idx" ON "_publicacoes_v" USING btree ("version_updated_at");
  CREATE INDEX "_publicacoes_v_version_version_created_at_idx" ON "_publicacoes_v" USING btree ("version_created_at");
  CREATE INDEX "_publicacoes_v_version_version__status_idx" ON "_publicacoes_v" USING btree ("version__status");
  CREATE INDEX "_publicacoes_v_created_at_idx" ON "_publicacoes_v" USING btree ("created_at");
  CREATE INDEX "_publicacoes_v_updated_at_idx" ON "_publicacoes_v" USING btree ("updated_at");
  CREATE INDEX "_publicacoes_v_latest_idx" ON "_publicacoes_v" USING btree ("latest");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");
  CREATE INDEX "categorias_updated_at_idx" ON "categorias" USING btree ("updated_at");
  CREATE INDEX "categorias_created_at_idx" ON "categorias" USING btree ("created_at");
  CREATE INDEX "parceiros_logo_idx" ON "parceiros" USING btree ("logo_id");
  CREATE INDEX "parceiros_updated_at_idx" ON "parceiros" USING btree ("updated_at");
  CREATE INDEX "parceiros_created_at_idx" ON "parceiros" USING btree ("created_at");
  CREATE INDEX "pessoas_foto_idx" ON "pessoas" USING btree ("foto_id");
  CREATE INDEX "pessoas_updated_at_idx" ON "pessoas" USING btree ("updated_at");
  CREATE INDEX "pessoas_created_at_idx" ON "pessoas" USING btree ("created_at");
  CREATE INDEX "midia_updated_at_idx" ON "midia" USING btree ("updated_at");
  CREATE INDEX "midia_created_at_idx" ON "midia" USING btree ("created_at");
  CREATE UNIQUE INDEX "midia_filename_idx" ON "midia" USING btree ("filename");
  CREATE INDEX "midia_sizes_miniatura_sizes_miniatura_filename_idx" ON "midia" USING btree ("sizes_miniatura_filename");
  CREATE INDEX "midia_sizes_cartao_sizes_cartao_filename_idx" ON "midia" USING btree ("sizes_cartao_filename");
  CREATE INDEX "midia_sizes_destaque_sizes_destaque_filename_idx" ON "midia" USING btree ("sizes_destaque_filename");
  CREATE INDEX "midia_sizes_og_sizes_og_filename_idx" ON "midia" USING btree ("sizes_og_filename");
  CREATE INDEX "documentos_updated_at_idx" ON "documentos" USING btree ("updated_at");
  CREATE INDEX "documentos_created_at_idx" ON "documentos" USING btree ("created_at");
  CREATE UNIQUE INDEX "documentos_filename_idx" ON "documentos" USING btree ("filename");
  CREATE INDEX "usuarios_roles_order_idx" ON "usuarios_roles" USING btree ("order");
  CREATE INDEX "usuarios_roles_parent_idx" ON "usuarios_roles" USING btree ("parent_id");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_noticias_id_idx" ON "payload_locked_documents_rels" USING btree ("noticias_id");
  CREATE INDEX "payload_locked_documents_rels_projetos_id_idx" ON "payload_locked_documents_rels" USING btree ("projetos_id");
  CREATE INDEX "payload_locked_documents_rels_publicacoes_id_idx" ON "payload_locked_documents_rels" USING btree ("publicacoes_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_categorias_id_idx" ON "payload_locked_documents_rels" USING btree ("categorias_id");
  CREATE INDEX "payload_locked_documents_rels_parceiros_id_idx" ON "payload_locked_documents_rels" USING btree ("parceiros_id");
  CREATE INDEX "payload_locked_documents_rels_pessoas_id_idx" ON "payload_locked_documents_rels" USING btree ("pessoas_id");
  CREATE INDEX "payload_locked_documents_rels_midia_id_idx" ON "payload_locked_documents_rels" USING btree ("midia_id");
  CREATE INDEX "payload_locked_documents_rels_documentos_id_idx" ON "payload_locked_documents_rels" USING btree ("documentos_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_estatuto_idx" ON "site" USING btree ("estatuto_id");
  CREATE INDEX "numeros_itens_order_idx" ON "numeros_itens" USING btree ("_order");
  CREATE INDEX "numeros_itens_parent_id_idx" ON "numeros_itens" USING btree ("_parent_id");
  CREATE INDEX "timeline_marcos_order_idx" ON "timeline_marcos" USING btree ("_order");
  CREATE INDEX "timeline_marcos_parent_id_idx" ON "timeline_marcos" USING btree ("_parent_id");
  CREATE INDEX "timeline_marcos_imagem_idx" ON "timeline_marcos" USING btree ("imagem_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "noticias" CASCADE;
  DROP TABLE "noticias_rels" CASCADE;
  DROP TABLE "_noticias_v" CASCADE;
  DROP TABLE "_noticias_v_rels" CASCADE;
  DROP TABLE "projetos_galeria" CASCADE;
  DROP TABLE "projetos_areas" CASCADE;
  DROP TABLE "projetos" CASCADE;
  DROP TABLE "projetos_rels" CASCADE;
  DROP TABLE "_projetos_v_version_galeria" CASCADE;
  DROP TABLE "_projetos_v_version_areas" CASCADE;
  DROP TABLE "_projetos_v" CASCADE;
  DROP TABLE "_projetos_v_rels" CASCADE;
  DROP TABLE "publicacoes" CASCADE;
  DROP TABLE "_publicacoes_v" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "categorias" CASCADE;
  DROP TABLE "parceiros" CASCADE;
  DROP TABLE "pessoas" CASCADE;
  DROP TABLE "midia" CASCADE;
  DROP TABLE "documentos" CASCADE;
  DROP TABLE "usuarios_roles" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "numeros_itens" CASCADE;
  DROP TABLE "numeros" CASCADE;
  DROP TABLE "timeline_marcos" CASCADE;
  DROP TABLE "timeline" CASCADE;
  DROP TYPE "public"."enum_noticias_status";
  DROP TYPE "public"."enum__noticias_v_version_status";
  DROP TYPE "public"."enum_projetos_areas";
  DROP TYPE "public"."enum_projetos_situacao";
  DROP TYPE "public"."enum_projetos_status";
  DROP TYPE "public"."enum__projetos_v_version_areas";
  DROP TYPE "public"."enum__projetos_v_version_situacao";
  DROP TYPE "public"."enum__projetos_v_version_status";
  DROP TYPE "public"."enum_publicacoes_status";
  DROP TYPE "public"."enum__publicacoes_v_version_status";
  DROP TYPE "public"."enum_parceiros_tipo";
  DROP TYPE "public"."enum_pessoas_grupo";
  DROP TYPE "public"."enum_usuarios_roles";`)
}
