"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Fog color (linear-ish hex). Defaults to --color-neblina. */
  color?: string;
  /** Fade the fog out as its container scrolls up (hero "dawn" effect). */
  dissipateOnScroll?: boolean;
};

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Two layers of drifting fBm noise, denser toward the bottom of the frame.
const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uFade;
  uniform vec3 uColor;
  uniform vec2 uRes;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 2.4;
    float t = uTime * 0.035;
    float n = fbm(p + vec2(t, t * 0.4)) * 0.65 + fbm(p * 1.8 - vec2(t * 1.6, 0.0)) * 0.35;
    float height = smoothstep(1.05, 0.15, vUv.y);
    float alpha = smoothstep(0.35, 0.85, n) * height * 0.85 * uFade;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace("#", ""), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

/**
 * Drifting WebGL fog over a hero image. Loaded only after the page is idle,
 * only on desktop-class screens with motion allowed and no data-saver; it
 * pauses off-screen and in background tabs. Purely decorative: the LCP is
 * the photo underneath, never this canvas.
 */
export function Fog({ className = "", color = "#e9e6df", dissipateOnScroll = false }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ok =
      window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches &&
      !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!ok) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle } = await import("ogl");
      if (disposed) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 1.5),
        alpha: true,
        premultipliedAlpha: false,
      });
      const gl = renderer.gl;
      gl.canvas.setAttribute("aria-hidden", "true");
      gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
      el.appendChild(gl.canvas);

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uFade: { value: 1 },
          uColor: { value: hexToRgb(color) },
          uRes: { value: [1, 1] },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        renderer.setSize(el.clientWidth, el.clientHeight);
        program.uniforms.uRes.value = [el.clientWidth, el.clientHeight];
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(el);

      let frame = 0;
      const t0 = performance.now();
      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        program.uniforms.uTime.value = (now - t0) / 1000;
        if (dissipateOnScroll) {
          const rect = el.getBoundingClientRect();
          program.uniforms.uFade.value = Math.max(0, Math.min(1, 1 + rect.top / (rect.height * 0.6)));
        }
        renderer.render({ scene: mesh });
      };
      frame = requestAnimationFrame(loop);
      gl.canvas.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, easing: "ease-out" });

      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        gl.canvas.remove();
      };
    };

    // After load and idle: never competes with the LCP or hydration.
    const idle = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => start(), { timeout: 2000 })
        : setTimeout(start, 600);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", idle);
      cleanup();
    };
  }, [color, dissipateOnScroll]);

  return <div ref={host} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
}
