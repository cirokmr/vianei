"use client";

import { useEffect, useState } from "react";

const SRC = "/marca/centro-vianei-cabecalho.webp"; // 288×102, made for this spot (2x)

/**
 * The header logo, requested only after the page loads: on every page it would
 * otherwise share the first round trips with the title's font and push the LCP
 * past budget. The box is reserved up front (no layout shift) and the logo
 * fades in; without JavaScript the <noscript> copy shows it right away.
 */
export function LogoCabecalho({ className = "" }: { className?: string }) {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const show = () => setPronto(true);
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);

  return (
    <span className={`block aspect-[288/102] ${className}`}>
      {pronto ? (
        // eslint-disable-next-line @next/next/no-img-element -- deliberately outside next/image (see above)
        <img src={SRC} width={288} height={102} alt="" decoding="async" className="logo-entra h-full w-auto" />
      ) : (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SRC} width={288} height={102} alt="" className="h-full w-auto" />
        </noscript>
      )}
    </span>
  );
}
