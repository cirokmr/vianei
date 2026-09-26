import { ViewTransition, type ReactNode } from "react";

// A template (unlike a layout) remounts on every navigation, so wrapping the
// page here gives each route change an exit/enter pair: the old page lifts
// away while the new one is wiped in from the bottom (CSS in globals.css).
// The header is anchored via its own view-transition-name.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
