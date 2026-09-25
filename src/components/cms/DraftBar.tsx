import dynamic from "next/dynamic";
import { draftMode } from "next/headers";

// Split out so the live-preview client code is only fetched in draft mode,
// never by regular visitors (or by link prefetches).
const LivePreviewListener = dynamic(() => import("./LivePreviewListener").then((m) => m.LivePreviewListener));

/** Visible only in draft mode: signals preview and wires up Live Preview. */
export async function DraftBar({ path }: { path: string }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <>
      <LivePreviewListener />
      <div className="fixed inset-x-0 bottom-0 z-[70] flex items-center justify-between gap-4 bg-pinhao px-[var(--gutter)] py-3 text-sm text-papel">
        <span>Pré-visualização de rascunho: o público ainda não vê estas alterações.</span>
        <a href={`/api/exit-preview?path=${encodeURIComponent(path)}`} className="underline underline-offset-4">
          Sair da pré-visualização
        </a>
      </div>
    </>
  );
}
