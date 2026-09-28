"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "@/lib/use-motion";

type Props = {
  text: string;
  className?: string;
  /** Attribution under the quote, in the text face. */
  cite?: string;
  /**
   * A photo beside the quote (below it on phones), never behind it: text over a
   * busy image was hard to read, especially on dim phone screens.
   */
  image?: ReactNode;
};

/**
 * Pins its section and lights words up one by one as the user scrolls.
 * This is the hijacking pattern the chapters build on: scroll advances the
 * scene instead of moving the page. Reduced motion shows the final state.
 */
export function ScrubWords({ text, className, cite, image }: Props) {
  const section = useRef<HTMLElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);

  useMotion(({ gsap, SplitText }) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const split = SplitText.create(quote.current!, { type: "words", wordsClass: "word", aria: "none" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: isMobile ? "+=80%" : "+=160%",
            pin: true,
            scrub: 0.9,
          },
        })
        .fromTo(split.words, { opacity: 0.5 }, { opacity: 1, stagger: 0.1, ease: "none" })
        .fromTo(section.current, { "--soft": 0 }, { "--soft": 100, ease: "none" }, 0);

      return () => split.revert();
    });

    return () => mm.revert();
  }, section);

  const figure = (
    <figure className="relative">
      <blockquote>
        <p
          ref={quote}
          className={`font-display leading-[1.06] tracking-[-0.02em] ${image ? "max-w-[20ch] text-[clamp(2rem,1.3rem+2.6vw,3.75rem)]" : "max-w-5xl text-h2"}`}
        >
          {text}
        </p>
      </blockquote>
      {cite ? (
        <figcaption className="mt-10 flex items-center gap-4 text-eyebrow tracking-[0.2em] text-papel/80 uppercase">
          <span aria-hidden="true" className="h-px w-10 bg-musgo" />
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );

  return (
    <section ref={section} className={className} aria-label="Manifesto" data-header="dark">
      {image ? (
        <div className="flex min-h-svh flex-col md:grid md:grid-cols-2">
          <div className="flex items-center px-[var(--gutter)] pt-28 pb-12 md:py-24">{figure}</div>
          <div className="relative min-h-[36svh] flex-1 md:min-h-0">{image}</div>
        </div>
      ) : (
        figure
      )}
    </section>
  );
}
