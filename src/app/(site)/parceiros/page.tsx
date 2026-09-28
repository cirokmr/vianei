import type { Metadata } from "next";
import { PartnersChapter } from "@/components/chapters/quem-somos/PartnersChapter";
import { PageHeader } from "@/components/ui/PageHeader";
import { getParceiros } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Parceiros",
  description: "Apoiadores e parceiros do Centro Vianei: cooperação internacional, organismos públicos e privados.",
  alternates: { canonical: "/parceiros" },
};

export default async function ParceirosPage() {
  const parceiros = await getParceiros();
  return (
    <>
      <PageHeader
        dark
        eyebrow="Quem caminha junto"
        title="Parceiros"
        lead="O Centro Vianei tem sido apoiado por um amplo conjunto de parceiros da cooperação internacional e de organismos públicos e privados."
      />
      <PartnersChapter parceiros={parceiros} semTitulo />
    </>
  );
}
