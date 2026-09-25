/**
 * Idempotent seed with the institutional data already public on the current
 * site (vianei.org.br). News, projects and media come from the WordPress
 * migration (phase 3), not from here.
 *
 *   npm run seed
 *
 * Creates the first admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD when set.
 */
import config from "@payload-config";
import { getPayload, type CollectionSlug, type Where } from "payload";

const ctx = { disableRevalidate: true };
const payload = await getPayload({ config });

async function upsert<T extends Record<string, unknown>>(collection: CollectionSlug, where: Where, data: T) {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 });
  if (existing.docs[0]) {
    return payload.update({ collection, id: existing.docs[0].id, data, context: ctx, depth: 0 });
  }
  return payload.create({ collection, data, context: ctx, depth: 0 } as Parameters<typeof payload.create>[0]);
}

// First admin ---------------------------------------------------------------
const { SEED_ADMIN_EMAIL: adminEmail, SEED_ADMIN_PASSWORD: adminPassword } = process.env;
if (adminEmail && adminPassword) {
  const { totalDocs } = await payload.count({ collection: "usuarios", where: { email: { equals: adminEmail } } });
  if (!totalDocs) {
    await payload.create({
      collection: "usuarios",
      data: { email: adminEmail, password: adminPassword, nome: "Administração", roles: ["admin"] },
      context: ctx,
    });
    payload.logger.info(`admin criado: ${adminEmail}`);
  }
}

// Globals ---------------------------------------------------------------------
await payload.updateGlobal({
  slug: "site",
  context: ctx,
  data: {
    nome: "Centro Vianei de Educação Popular",
    razaoSocial: "AVICITECS – Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde",
    cnpj: "78.492.261/0001-63",
    email: "contato@vianei.org.br",
    endereco: {
      logradouro: "Av. Papa João XXIII, 1565 – Área Industrial",
      cidade: "Lages",
      uf: "SC",
      cep: "88514-720",
    },
    redes: {
      instagram: "https://www.instagram.com/centrovianei/",
      facebook: "https://www.facebook.com/centrovianei",
      youtube: "https://www.youtube.com/channel/UCkEIv_GvLhWyFuYBl_y5i8w",
      youtubeChannelId: "UCkEIv_GvLhWyFuYBl_y5i8w",
    },
  },
});

// Only milestones stated on the current site; the team completes the rest.
await payload.updateGlobal({
  slug: "timeline",
  context: ctx,
  data: {
    marcos: [
      {
        ano: 1983,
        titulo: "Nasce o Projeto Vianei",
        texto: "Ligado ao Instituto São João Batista Vianei, da Diocese de Lages.",
      },
      {
        ano: 1988,
        titulo: "Formalização como AVICITECS",
        texto: "Associação Vianei de Cooperação e Intercâmbio no Trabalho, Educação, Cultura e Saúde.",
      },
    ],
  },
});

// Categories --------------------------------------------------------------------
for (const titulo of [
  "Agroecologia",
  "Educação popular",
  "Restauração florestal",
  "SAT Pinhão",
  "Políticas públicas",
]) {
  await upsert("categorias", { titulo: { equals: titulo } }, { titulo });
}

// Partners (as listed on vianei.org.br/quem-somos) -------------------------------
const parceiros: { nome: string; descricao?: string; tipo: "apoiador" | "parceiro" }[] = [
  { nome: "MISEREOR", descricao: "Katholische Zentralstelle für Entwicklungshilfe", tipo: "apoiador" },
  { nome: "IBAMA", tipo: "apoiador" },
  { nome: "Pró-Espécies", descricao: "Instituto do Meio Ambiente de SC", tipo: "apoiador" },
  { nome: "WWF-Brasil", tipo: "apoiador" },
  { nome: "CEPAGRO", tipo: "parceiro" },
  { nome: "CETAP", descricao: "Agricultura e Ecologia", tipo: "parceiro" },
  { nome: "AS-PTA", descricao: "Agricultura Familiar e Agroecologia", tipo: "parceiro" },
  { nome: "Cooperativa Agroecológica Ecoserra", descricao: "Lages e Florianópolis, SC", tipo: "parceiro" },
  { nome: "LEAp do CCA-UFSC", descricao: "Laboratório de Ecologia Aplicada", tipo: "parceiro" },
  { nome: "LECERA", descricao: "Laboratório de Educação no Campo e Reforma Agrária", tipo: "parceiro" },
  { nome: "Centro de Ciências Agroveterinárias", tipo: "parceiro" },
  { nome: "Núcleo de Estudos em Florestas Tropicais – UFSC", tipo: "parceiro" },
  { nome: "UDESC", descricao: "Universidade do Estado de Santa Catarina", tipo: "parceiro" },
  { nome: "UFSC", descricao: "Universidade Federal de Santa Catarina – Campus Curitibanos", tipo: "parceiro" },
  { nome: "IFSC", descricao: "Instituto Federal de Santa Catarina – Campus Urupema", tipo: "parceiro" },
  { nome: "CDHC", descricao: "Centro de Direitos Humanos e Cidadania, Lages", tipo: "parceiro" },
  { nome: "Cáritas Diocesana de Lages", tipo: "parceiro" },
  { nome: "Casa Ecumênica de Lages", tipo: "parceiro" },
  { nome: "Coper Planalto Sul", descricao: "Curitibanos", tipo: "parceiro" },
  { nome: "Feira Orgânica Amigos da Terra", descricao: "UDESC, Lages", tipo: "parceiro" },
];
for (const [i, parceiro] of parceiros.entries()) {
  await upsert("parceiros", { nome: { equals: parceiro.nome } }, { ...parceiro, ordem: (i + 1) * 10 });
}

// People (as listed on vianei.org.br/quem-somos). E-mails are not seeded: the
// team decides which ones become public (see CONTENT-TODO.md).
type Grupo = "diretoria" | "conselho-fiscal" | "equipe-tecnica";
const pessoas: { nome: string; grupo: Grupo; cargo?: string; formacao?: string }[] = [
  { nome: "Ivo Severino Macagnan", grupo: "diretoria", cargo: "Presidente" },
  { nome: "Tienko Vitor da Rocha", grupo: "diretoria", cargo: "Secretário" },
  { nome: "Aquiles Munarin", grupo: "diretoria", cargo: "Tesoureiro" },
  { nome: "José Luiz Carraro", grupo: "conselho-fiscal" },
  { nome: "Matheus Nunes Silva", grupo: "conselho-fiscal" },
  { nome: "Gilmar Luiz Espanhol", grupo: "conselho-fiscal" },
  {
    nome: "Natal João Magnanti",
    grupo: "equipe-tecnica",
    cargo: "Coordenador do Centro Vianei e de projetos",
    formacao: "Pedagogo e engenheiro agrônomo, doutor em agroecossistemas",
  },
  { nome: "Rui Alvacir Netto", grupo: "equipe-tecnica", cargo: "Gestor de projetos", formacao: "Administrador" },
  { nome: "Zeferino Leite", grupo: "equipe-tecnica", cargo: "Administrativo-financeiro", formacao: "Contabilista" },
  {
    nome: "Danúsia Vieira Sartori",
    grupo: "equipe-tecnica",
    formacao: "Engenheira agrônoma, especialista em educação ambiental",
  },
  {
    nome: "Carolina Couto Waltrich",
    grupo: "equipe-tecnica",
    formacao: "Gestora ambiental, técnica em agroecologia",
  },
];
for (const [i, pessoa] of pessoas.entries()) {
  await upsert("pessoas", { nome: { equals: pessoa.nome } }, { ...pessoa, ordem: (i + 1) * 10 });
}

payload.logger.info("seed concluído");
process.exit(0);
