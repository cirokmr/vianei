import type { StaticImageData } from "next/image";
import caminhada from "../../public/fotos/caminhada.webp";
import catador from "../../public/fotos/catador-tronco.webp";
import mudas from "../../public/fotos/mudas.webp";
import oficina from "../../public/fotos/oficina.webp";

export type Area = {
  slug: string;
  titulo: string;
  texto: string;
  foto: StaticImageData;
  alt: string;
  /** Where the card leads until /atuacao/[area] ships (phase 6). */
  href: string;
  cta: string;
};

// The four lines of work, summarised from the list on vianei.org.br/quem-somos.
export const areas: Area[] = [
  {
    slug: "educacao-popular",
    titulo: "Educação popular",
    texto:
      "Cursos de Educação Popular, pedagogia da alternância nas Casas Familiares Rurais e formação de lideranças: aprender junto, a partir da vida de quem trabalha a terra.",
    foto: oficina,
    alt: "Agricultores e agricultoras em uma oficina sobre políticas públicas, em Urupema",
    href: "/quem-somos#atuacao",
    cta: "Como atuamos",
  },
  {
    slug: "agroecologia",
    titulo: "Agroecologia",
    texto:
      "Produção agroecológica, cooperativismo, comercialização direta e grupos de consumo consciente, aproximando o campo e a cidade.",
    foto: caminhada,
    alt: "Grupo caminha por um campo com araucárias ao fundo durante o Seminário SAT Pinhão",
    href: "/projetos/projeto-misereor-em-rede",
    cta: "Ver o projeto em rede",
  },
  {
    slug: "restauracao-florestal",
    titulo: "Restauração florestal",
    texto:
      "Mudas nativas da Mata Atlântica e conservação das espécies pelo seu uso sustentável, nas reservas legais de assentamentos do Planalto.",
    foto: mudas,
    alt: "Mudas nativas sendo carregadas em um caminhão no viveiro do Centro Vianei",
    href: "/projetos/projeto-restaurar",
    cta: "Ver o Projeto Restaurar",
  },
  {
    slug: "sat-pinhao",
    titulo: "Cultura e SAT Pinhão",
    texto:
      "Reconhecer e valorizar o Sistema Agrícola Tradicional do pinhão da Serra Catarinense: alimento, renda e patrimônio imaterial.",
    foto: catador,
    alt: "Extrativista sobe o tronco de uma araucária para colher pinhas",
    href: "/projetos/programa-saberes-e-fazeres-do-pinhao",
    cta: "Ver Saberes e Fazeres do Pinhão",
  },
];
