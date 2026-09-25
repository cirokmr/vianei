import type { CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
};

/**
 * Server-rendered h1 with a pure-CSS word reveal (see .hero-word in
 * globals.css). Used for the LCP headline, where waiting for GSAP to hydrate
 * would delay Largest Contentful Paint.
 */
export function HeroTitle({ text, className }: Props) {
  const words = text.split(/\s+/);

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="hero-word">
            <span style={{ "--i": i } as CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
