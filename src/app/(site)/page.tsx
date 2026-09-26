import { Chapter } from "@/components/chapters/Chapter";
import { ChapterRail } from "@/components/chapters/ChapterRail";
import { HomeHero } from "@/components/chapters/home/HomeHero";
import { NowChapter } from "@/components/chapters/home/NowChapter";
import { NumbersChapter } from "@/components/chapters/home/NumbersChapter";
import { SinceChapter } from "@/components/chapters/home/SinceChapter";
import { TogetherChapter } from "@/components/chapters/home/TogetherChapter";
import { WorkChapter } from "@/components/chapters/home/WorkChapter";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { getNoticias, getNumeros, getParceiros, getProjetos, getSite, getTimeline } from "@/lib/cms/queries";

const chapters = [
  { id: "amanhecer", label: "Amanhecer" },
  { id: "manifesto", label: "Manifesto" },
  { id: "desde-1983", label: "Desde 1983" },
  { id: "o-que-fazemos", label: "O que fazemos" },
  { id: "numeros", label: "Em números" },
  { id: "agora", label: "Agora no território" },
  { id: "juntos", label: "Quem caminha junto" },
];

/**
 * Home: a documentary watched with the scroll, in seven chapters (see
 * docs/PROMPT.md §6). A Server Component that only fetches and composes;
 * every motion lives in a small client primitive.
 */
export default async function Home() {
  const [timeline, numeros, noticias, projetos, parceiros, site] = await Promise.all([
    getTimeline(),
    getNumeros(),
    getNoticias({ limit: 3 }),
    getProjetos(),
    getParceiros(),
    getSite(),
  ]);
  const [amanhecer, manifesto, desde, fazemos, emNumeros, agora, juntos] = chapters;
  const rail = noticias.docs.length ? chapters : chapters.filter((c) => c !== agora);

  return (
    <>
      <ChapterRail items={rail} />

      <Chapter {...amanhecer}>
        <HomeHero />
      </Chapter>

      <Chapter {...manifesto}>
        <ScrubWords
          className="flex min-h-svh items-center bg-mata px-[var(--gutter)] text-papel"
          text="“Ninguém nasce feito, é experimentando-nos no mundo que nós nos fazemos.” — Paulo Freire"
        />
      </Chapter>

      <Chapter {...desde}>
        <SinceChapter marcos={timeline.marcos ?? []} projetos={projetos} />
      </Chapter>

      <Chapter {...fazemos}>
        <WorkChapter />
      </Chapter>

      <Chapter {...emNumeros}>
        <NumbersChapter itens={numeros.itens ?? []} />
      </Chapter>

      {noticias.docs.length ? (
        <Chapter {...agora}>
          <NowChapter noticias={noticias.docs} />
        </Chapter>
      ) : null}

      <Chapter {...juntos}>
        <TogetherChapter parceiros={parceiros} email={site.email} />
      </Chapter>
    </>
  );
}
