import type { ReactNode } from "react";

type Props = { id: string; label: string; children: ReactNode };

/**
 * Anchor + bookkeeping wrapper for a scroll chapter. It sits outside any pin,
 * so its box (the pin spacer included) is where the chapter really lives on
 * the page: ChapterRail measures it and anchor links scroll to it.
 */
export function Chapter({ id, label, children }: Props) {
  return (
    <div id={id} data-chapter={label} tabIndex={-1} className="outline-none">
      {children}
    </div>
  );
}
