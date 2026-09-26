"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { serverUrl } from "@/lib/server-url";

/** Re-renders the server page whenever the editor saves in the admin. */
export function LivePreviewListener() {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverUrl()} />;
}
