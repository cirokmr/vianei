import { YouTube } from "@/components/ui/YouTube";
import { youtubeTitle } from "@/lib/youtube";

/** Server wrapper: resolves the video's real title for the facade and screen readers. */
export async function YouTubeEmbed({ id, className }: { id: string; className?: string }) {
  const titulo = (await youtubeTitle(id)) ?? "Vídeo no YouTube";
  return <YouTube id={id} titulo={titulo} className={className} />;
}
