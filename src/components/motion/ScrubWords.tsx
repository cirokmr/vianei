"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/use-motion";

type Props = {
  text: string;
  className?: string;
};

/**
 * Pins its section and lights words up one by one as the user scrolls.
 * This is the hijacking pattern the chapters build on: scroll advances the
 * scene instead of moving the page. Reduced motion shows the final state.
 */
export function ScrubWords({ text, className }: Props) {
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
        .fromTo(split.words, { opacity: 0.42 }, { opacity: 1, stagger: 0.1, ease: "none" })
        .fromTo(section.current, { "--soft": 0 }, { "--soft": 100, ease: "none" }, 0);

      return () => split.revert();
    });

    return () => mm.revert();
  }, section);

  return (
    <section ref={section} className={className} aria-label="Manifesto" data-header="dark">
      <p ref={quote} className="font-display text-h2 leading-[1.02] tracking-[-0.02em]">
        {text}
      </p>
    </section>
  );
}
