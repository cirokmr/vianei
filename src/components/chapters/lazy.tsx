"use client";

import dynamic from "next/dynamic";

// Desktop-only enhancements with nothing worth server-rendering: kept out of
// the page's initial chunk and loaded after hydration.
export const LazyChapterRail = dynamic(() => import("./ChapterRail").then((m) => m.ChapterRail), { ssr: false });
export const LazyFog = dynamic(() => import("@/components/motion/Fog").then((m) => m.Fog), { ssr: false });
