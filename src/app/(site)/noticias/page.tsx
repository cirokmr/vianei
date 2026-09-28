import type { Metadata } from "next";
import { NoticiasIndex } from "@/components/noticias/NoticiasIndex";

export const metadata: Metadata = {
  title: "Notícias",
  description: "O que está acontecendo no território: oficinas, projetos e encontros do Centro Vianei.",
  alternates: { canonical: "/noticias" },
};

export default function NoticiasPage() {
  return <NoticiasIndex pagina={1} />;
}
