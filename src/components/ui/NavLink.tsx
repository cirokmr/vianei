"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * Links in the first screen prefetch on intent (pointer, touch or keyboard focus), not on
 * sight: seven route prefetches right at load competed with the home title
 * for the network (LCP) and spend mobile data on pages nobody opened.
 */
export function NavLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string }) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);
  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={prefetch}
      onTouchStart={prefetch}
      onFocus={prefetch}
      {...props}
    />
  );
}
