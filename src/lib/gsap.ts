import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Single registration point. This module is only ever loaded through
// useMotion()/SmoothScroll via dynamic import, so GSAP stays off the critical
// rendering path: pages paint and hydrate first, motion arrives right after.
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Signature easings, kept in sync with --ease-vianei / --ease-out-soft.
CustomEase.create("vianei", "0.65, 0.05, 0, 1");
CustomEase.create("soft", "0.22, 1, 0.36, 1");

gsap.defaults({ ease: "soft", duration: 1 });

export { gsap, ScrollTrigger, SplitText };
