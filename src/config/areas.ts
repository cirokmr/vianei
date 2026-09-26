import type { StaticImageData } from "next/image";
import caminhada from "../../public/fotos/caminhada.webp";
import catador from "../../public/fotos/catador-tronco.webp";
import mudas from "../../public/fotos/mudas.webp";
import oficina from "../../public/fotos/oficina.webp";

export type Area = {
  /** URL segment: /atuacao/[slug]. */
  slug: string;
  /** Matching value of the `areas` field on projects. */
  area: "educacao-popular" | "agroecologia" | "restauracao-florestal" | "cultura-sat-pinhao";
  /** Matching news category slug. */
  categoria: string;
  titulo: string;
  texto: string;
  foto: StaticImageData;
  alt: string;
};

// The four lines of work, summarised from the list on vianei.org.br/quem-somos.
export const areas: Area[] = [
  {
    slug: "educacao-popular",
    area: "educacao-popular",
    categoria: "educacao-popular",
    titulo: "Educação popular",
    texto:
      "Cursos de Educação Popular, pedagogia da alternância nas Casas Familiares Rurais e formação de lideranças: aprender junto, a partir da vida de quem trabalha a terra.",
    foto: oficina,
    alt: "Agricultores e agricultoras em uma oficina sobre políticas públicas, em Urupema",
  },
  {
    slug: "agroecologia",
    area: "agroecologia",
    categoria: "agroecologia",
    titulo: "Agroecologia",
    texto:
      "Produção agroecológica, cooperativismo, comercialização direta e grupos de consumo consciente, aproximando o campo e a cidade.",
    foto: caminhada,
    alt: "Grupo caminha por um campo com araucárias ao fundo durante o Seminário SAT Pinhão",
  },
  {
    slug: "restauracao-florestal",
    area: "restauracao-florestal",
    categoria: "restauracao-florestal",
    titulo: "Restauração florestal",
    texto:
      "Mudas nativas da Mata Atlântica e conservação das espécies pelo seu uso sustentável, nas reservas legais de assentamentos do Planalto.",
    foto: mudas,
    alt: "Mudas nativas sendo carregadas em um caminhão no viveiro do Centro Vianei",
  },
  {
    slug: "sat-pinhao",
    area: "cultura-sat-pinhao",
    categoria: "sat-pinhao",
    titulo: "Cultura e SAT Pinhão",
    texto:
      "Reconhecer e valorizar o Sistema Agrícola Tradicional do pinhão da Serra Catarinense: alimento, renda e patrimônio imaterial.",
    foto: catador,
    alt: "Extrativista sobe o tronco de uma araucária para colher pinhas",
  },
];

export const areaHref = (area: Area) => `/atuacao/${area.slug}`;
export const findArea = (slug: string) => areas.find((a) => a.slug === slug);

// "Durante os 40 anos de existência, o Centro Vianei ocupou-se em:" (vianei.org.br/quem-somos),
// each line tagged with the area it belongs to.
export const frentes: { texto: string; area: Area["slug"] }[] = [
  { texto: "Criar e assessorar cooperativas de crédito com interação solidária", area: "agroecologia" },
  { texto: "Assessorar o associativismo e o cooperativismo de iniciativas agroecológicas", area: "agroecologia" },
  { texto: "Formar jovens pela pedagogia da alternância nas Casas Familiares Rurais", area: "educacao-popular" },
  {
    texto: "Capacitar lideranças, técnica e politicamente, nos Cursos de Educação Popular (CEPs) e outros cursos",
    area: "educacao-popular",
  },
  { texto: "Assessorar a produção agroecológica de alimentos", area: "agroecologia" },
  { texto: "Assessorar a comercialização direta da produção", area: "agroecologia" },
  { texto: "Assessorar a agroindustrialização artesanal", area: "agroecologia" },
  { texto: "Assessorar a certificação de produtos agroecológicos", area: "agroecologia" },
  { texto: "Promover a incidência política em soberania e segurança alimentar e nutricional", area: "agroecologia" },
  { texto: "Assessorar grupos de consumo consciente, aproximando o campo e a cidade", area: "agroecologia" },
  { texto: "Capacitar professores e gestores da educação do campo", area: "educacao-popular" },
  {
    texto:
      "Implementar projetos socioambientais de produção, processamento e comercialização de alimentos agroecológicos da agricultura familiar",
    area: "agroecologia",
  },
  {
    texto: "Implementar projetos de restauração florestal que conservam as espécies por meio do seu uso sustentável",
    area: "restauracao-florestal",
  },
  {
    texto:
      "Promover o extrativismo sustentável da biodiversidade e a bioeconomia, principalmente com sistemas agroflorestais",
    area: "restauracao-florestal",
  },
  {
    texto: "Reconhecer e valorizar o Sistema Agrícola Tradicional (SAT) do pinhão da Serra Catarinense",
    area: "sat-pinhao",
  },
];
