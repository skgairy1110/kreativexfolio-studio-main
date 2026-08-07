import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

export type GalaxyHandle = {
  setPointer: (x: number | null, y: number | null) => void;
};

type Particle = {
  rx: number; // base position, ratio of width [0..1]
  ry: number; // base position, ratio of height [0..1]
  ox: number; // eased offset from base, px
  oy: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  driftPhase: number;
  driftSpeed: number;
  driftAmp: number;
  color: string;
  interactive: boolean;
  brightness: number; // eased 0..1, how "lit" by the cursor
  // scratch fields written during the frame, read right after for constellation pass
  _x: number;
  _y: number;
};

// Existing brand glow palette (purple / violet / cyan) plus the lime accent,
// with a light dusting of pale "true" starlight so the field doesn't read as
// a flat wash of one hue.
const PALETTE = ["168,85,247", "139,92,246", "56,189,248", "159,190,0", "226,232,240"];
const PALETTE_WEIGHTS = [0.27, 0.31, 0.23, 0.07, 0.12];

function weightedColor(r: number) {
  let acc = 0;
  for (let i = 0; i < PALETTE.length; i++) {
    acc += PALETTE_WEIGHTS[i];
    if (r <= acc) return PALETTE[i];
  }
  return PALETTE[PALETTE.length - 1];
}

// Builds an organic particle field: a denser, spiral-armed "galaxy" cluster
// (interactive) layered over a soft, wide starfield (mostly ambient).
function makeParticles(count: number, spiralRatio: number): Particle[] {
  const particles: Particle[] = [];
  const arms = 3;
  const spiralCount = Math.floor(count * spiralRatio);

  for (let i = 0; i < count; i++) {
    let rx: number, ry: number, interactive: boolean, size: number, baseAlpha: number;

    if (i < spiralCount) {
      const t = Math.pow(Math.random(), 0.6); // biased denser toward the core
      const arm = i % arms;
      const angle = (arm / arms) * Math.PI * 2 + t * Math.PI * 2.6 + (Math.random() - 0.5) * 0.7;
      const radius = t * 0.46;
      rx = 0.52 + Math.cos(angle) * radius * 1.2;
      ry = 0.42 + Math.sin(angle) * radius * 0.9;
      interactive = true;
      size = 0.7 + Math.random() * 1.5;
      baseAlpha = 0.35 + Math.random() * 0.45;
    } else {
      rx = Math.random();
      ry = Math.random();
      interactive = Math.random() < 0.35;
      size = 0.35 + Math.random() * 0.85;
      baseAlpha = 0.12 + Math.random() * 0.3;
    }

    particles.push({
      rx: Math.min(1, Math.max(0, rx)),
      ry: Math.min(1, Math.max(0, ry)),
      ox: 0,
      oy: 0,
      size,
      baseAlpha,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.35 + Math.random() * 0.75,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.04 + Math.random() * 0.1,
      driftAmp: 3 + Math.random() * 9,
      color: weightedColor(Math.random()),
      interactive,
      brightness: 0,
      _x: 0,
      _y: 0,
    });
  }
  return particles;
}

/**
 * Canvas-rendered interactive galaxy for the hero background.
 * - Pointer position is fed in imperatively via `setPointer` (no React state,
 *   no re-renders) so the parent's existing mousemove handler can drive it.
 * - Scroll depth (zoom-away / fade) is applied as a CSS transform on the
 *   wrapping layer via framer-motion, independent of the canvas draw loop.
 */
export const HeroGalaxy = forwardRef<GalaxyHandle, { progress: MotionValue<number> }>(
  function HeroGalaxy({ progress }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const sizeRef = useRef({ w: 0, h: 0 });
    const pointerRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
    const rafRef = useRef<number | null>(null);
    const reducedMotionRef = useRef(false);

    useImperativeHandle(ref, () => ({
      setPointer: (x, y) => {
        pointerRef.current.x = x;
        pointerRef.current.y = y;
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 260 : 900;
      particlesRef.current = makeParticles(count, 0.45);

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeRef.current = { w: rect.width, h: rect.height };
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      let running = true;
      const onVisibility = () => {
        running = !document.hidden;
        if (running && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      const INFLUENCE = 170; // px radius of cursor influence
      const CONNECT_DIST = 108; // px, max constellation line length
      const PUSH = 20; // px, max pull toward cursor
      const EASE = 0.07; // spring-like easing factor (never snaps)
      const active: Particle[] = [];

      function tick(time: number) {
        rafRef.current = requestAnimationFrame(tick);
        if (!running) return;
        const { w, h } = sizeRef.current;
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);

        const px = pointerRef.current.x;
        const py = pointerRef.current.y;
        const t = time / 1000;
        const reduced = reducedMotionRef.current;

        active.length = 0;

        for (const p of particlesRef.current) {
          const baseX = p.rx * w;
          const baseY = p.ry * h;

          const driftX = reduced ? 0 : Math.sin(t * p.driftSpeed + p.driftPhase) * p.driftAmp;
          const driftY = reduced ? 0 : Math.cos(t * p.driftSpeed * 0.8 + p.driftPhase) * p.driftAmp * 0.6;

          let targetOx = driftX;
          let targetOy = driftY;
          let targetBrightness = 0;

          if (p.interactive && px !== null && py !== null && !reduced) {
            const dx = px - (baseX + driftX);
            const dy = py - (baseY + driftY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < INFLUENCE) {
              const pull = 1 - dist / INFLUENCE;
              targetOx = driftX + (dx / (dist || 1)) * pull * PUSH;
              targetOy = driftY + (dy / (dist || 1)) * pull * PUSH;
              targetBrightness = pull;
            }
          }

          // Spring-like ease toward the target — elegant, never a hard snap.
          p.ox += (targetOx - p.ox) * EASE;
          p.oy += (targetOy - p.oy) * EASE;
          p.brightness += (targetBrightness - p.brightness) * 0.08;

          const x = baseX + p.ox;
          const y = baseY + p.oy;

          const twinkle = 0.55 + 0.45 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
          const alpha = Math.min(1, p.baseAlpha * twinkle + p.brightness * 0.5);
          const size = p.size * (1 + p.brightness * 0.6);

          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          if (p.interactive && p.brightness > 0.05) {
            p._x = x;
            p._y = y;
            active.push(p);
          }
        }

        // Constellation lines — only among the (small) set of particles
        // currently lit by the cursor, so this stays cheap even with a large
        // total particle count, and a permanent network never appears.
        for (let i = 0; i < active.length; i++) {
          for (let j = i + 1; j < active.length; j++) {
            const a = active[i];
            const b = active[j];
            const dx = a._x - b._x;
            const dy = a._y - b._y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST) {
              const lineAlpha = (1 - dist / CONNECT_DIST) * Math.min(a.brightness, b.brightness) * 0.5;
              if (lineAlpha > 0.012) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(190,175,255,${lineAlpha})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(a._x, a._y);
                ctx.lineTo(b._x, b._y);
                ctx.stroke();
              }
            }
          }
        }

        // Soft cursor glow, blended low so it never overpowers the content.
        if (px !== null && py !== null && !reduced) {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 220);
          grad.addColorStop(0, "rgba(159,190,0,0.05)");
          grad.addColorStop(0.5, "rgba(139,92,246,0.045)");
          grad.addColorStop(1, "rgba(56,189,248,0)");
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = grad;
          ctx.fillRect(px - 220, py - 220, 440, 440);
          ctx.globalCompositeOperation = "source-over";
        }
      }

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);

    // Scroll depth: the galaxy layer drifts/zooms slightly faster than the
    // headline and slower than nothing — its own depth plane.
    const scale = useTransform(progress, [0, 1], [1, 1.16]);
    const y = useTransform(progress, [0, 1], [0, -70]);
    const opacity = useTransform(progress, [0, 0.8], [1, 0.35]);

    return (
      <motion.div
        ref={containerRef}
        style={{ scale, y, opacity }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </motion.div>
    );
  }
);
