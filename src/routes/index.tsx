import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { Marquee } from "@/components/Marquee";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { HeroGalaxy, type GalaxyHandle } from "@/components/HeroGalaxy";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type ScatterImg = { src: string; top: string; left: string; w: number; h: number; speed: number; rot: number };
type Home = {
  hero: { eyebrow: string; title: string; subtitle: string; cta: { label: string; href: string }; secondaryCta: { label: string; href: string }; scatter?: ScatterImg[] };
  featuredWork: { eyebrow: string; title: string; projects: { slug: string; title: string; category: string; image: string }[] };
  servicesSnapshot: { eyebrow: string; title: string; items: { title: string; description: string }[] };
  marquee: string[];
  footerCta: { title: string; cta: { label: string; href: string } };
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio — Independent Design Studio" },
      { name: "description", content: "Brand, web, motion and digital product for ambitious teams." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useJson<Home>(dataPaths.home);
  if (!data) return <div className="min-h-screen" />;

  return (
    <PageWrap>
      <Hero data={data.hero} />
      <Featured data={data.featuredWork} />
      <ServicesSnapshot data={data.servicesSnapshot} />
      <section className="py-20 md:py-32 border-y border-border">
        <Marquee items={data.marquee} />
      </section>
      <FooterCta data={data.footerCta} />
    </PageWrap>
  );
}

function Hero({ data }: { data: Home["hero"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<GalaxyHandle>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Mouse-parallax: raw pointer position normalised to [-1, 1] on each axis,
  // smoothed with a spring so the headline drifts rather than snaps. The
  // same pointer position (in pixels) is also forwarded to the galaxy canvas
  // imperatively, so it can react without triggering React re-renders.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    mouseX.set((relX / rect.width - 0.5) * 2);
    mouseY.set((relY / rect.height - 0.5) * 2);
    galaxyRef.current?.setPointer(relX, relY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    galaxyRef.current?.setPointer(null, null);
  };

  // Tiny headline parallax — a few px of drift and a hair of scale, eased
  // through the same spring as everything else so it stays smooth and never
  // competes with legibility.
  const textX = useTransform(springX, (v) => v * 6);
  const textParY = useTransform(springY, (v) => v * 6);
  const textScale = useTransform([springX, springY], ([sx, sy]) =>
    1 + Math.min(0.018, (Math.abs(sx as number) + Math.abs(sy as number)) * 0.01)
  );
  const combinedTitleY = useTransform([titleY, textParY], ([a, b]) => (a as number) + (b as number));
  const combinedTitleScale = useTransform([titleScale, textScale], ([a, b]) => (a as number) * (b as number));

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative -mt-28 md:-mt-32 h-[100svh] min-h-[100svh] w-full noise overflow-hidden bg-[#050308]"
    >
      {/* Dark creative gradient backdrop — layered, low-opacity radial glows on a
          near-black base so nothing reads as a solid pastel band. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(45% 40% at 18% 15%, rgba(147,51,234,0.22), transparent 70%)," +
            "radial-gradient(40% 35% at 85% 10%, rgba(56,189,248,0.14), transparent 70%)," +
            "radial-gradient(50% 45% at 75% 90%, rgba(217,70,239,0.16), transparent 70%)," +
            "radial-gradient(40% 35% at 10% 85%, rgba(99,102,241,0.14), transparent 70%)," +
            "linear-gradient(180deg, #050308 0%, #0a0714 45%, #050308 100%)",
        }}
      />

      {/* Layer 1 — nebula glow: subtle drifting accents, pinned to the
          corners so they never merge into a visible strip across the middle. */}
      <motion.div aria-hidden style={{ y }} className="absolute inset-0 -z-10 mix-blend-screen">
        <div className="absolute -top-[8%] -left-[8%] h-[30vw] max-h-[380px] w-[30vw] max-w-[380px] rounded-full bg-fuchsia-600/15 blur-[110px] [animation:blob-float_22s_ease-in-out_infinite]" />
        <div className="absolute top-[5%] -right-[8%] h-[26vw] max-h-[340px] w-[26vw] max-w-[340px] rounded-full bg-cyan-500/10 blur-[110px] [animation:blob-float_27s_ease-in-out_infinite_2s]" />
        <div className="absolute -bottom-[10%] left-[25%] h-[26vw] max-h-[340px] w-[26vw] max-w-[340px] rounded-full bg-violet-600/12 blur-[120px] [animation:blob-float_31s_ease-in-out_infinite_1s]" />
      </motion.div>

      {/* Layer 2 — interactive galaxy: stars, drifting particles, cursor-driven
          constellations and glow, rendered on canvas for performance. */}
      <HeroGalaxy ref={galaxyRef} progress={scrollYProgress} />

      {/* Layer 3 — headline, subtitle and CTAs */}
      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 pb-12 pt-24 md:px-10 md:pb-20 md:pt-32">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center"
        >
          {data.eyebrow}
        </motion.span>

        <motion.div style={{ y: combinedTitleY, scale: combinedTitleScale, x: textX }} className="my-12 md:my-0 text-center">
          <RevealText
            as="h1"
            delay={1.5}
            className="font-display bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-200 text-[8vw] md:text-[6vw] leading-[0.95] tracking-tight"
          >
            {data.title}
          </RevealText>
        </motion.div>

        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.7 }}
            className="max-w-md text-muted-foreground md:text-lg"
          >
            {data.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.7 }}
            className="flex items-center gap-3 md:gap-4"
          >
            <MagneticCtaGlow>
              <MagneticButton>
                <Link
                  to={data.cta.href as "/contact"}
                  className="btn-shine inline-flex items-center gap-2 md:gap-3 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-primary-foreground shadow-[0_20px_60px_-20px] shadow-primary/60 md:px-8 md:py-4 md:text-sm md:tracking-[0.2em]"
                >
                  {data.cta.label}
                  <span aria-hidden>→</span>
                </Link>
              </MagneticButton>
            </MagneticCtaGlow>
            <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Link
                to={data.secondaryCta.href as "/work"}
                className="story-link whitespace-nowrap text-xs uppercase tracking-[0.15em] md:text-sm md:tracking-[0.2em]"
              >
                {data.secondaryCta.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const CTA_PARTICLE_ANGLES = [0, 1, 2, 3, 4, 5].map((i) => (i / 6) * Math.PI * 2);

// Wraps the primary CTA with a soft brand-colour glow and a handful of tiny
// particles that drift inward on hover — enhancing the existing button
// without changing its shape, size or copy.
function MagneticCtaGlow({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-xl"
            style={{ background: "radial-gradient(circle, rgba(159,190,0,0.35), rgba(139,92,246,0.18) 55%, transparent 75%)" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1.18 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
      {hovered && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {CTA_PARTICLE_ANGLES.map((angle, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary"
              style={{ left: "50%", top: "50%" }}
              initial={{ x: Math.cos(angle) * 56, y: Math.sin(angle) * 56, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.13, ease: "easeIn" }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

function Featured({ data }: { data: Home["featuredWork"] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{data.eyebrow}</span>
          <RevealText as="h2" className="mt-4 font-display text-5xl md:text-7xl leading-[1] tracking-tight">
            {data.title}
          </RevealText>
        </div>
        <Link to="/work" className="hidden md:inline-flex story-link text-sm uppercase tracking-[0.2em]">
          All work →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
        {data.projects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className={i % 2 === 1 ? "md:translate-y-24" : ""}
          >
            <Link to="/work/$slug" params={{ slug: p.slug }} className="block group lift" data-cursor-text="View">
              <TiltCard>
                <div className="gradient-border">
                  <div className="gb-inner media-hover aspect-[4/5] w-full">
                    <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                </div>
              </TiltCard>
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display text-3xl md:text-4xl transition-colors group-hover:text-primary">{p.title}</h3>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{p.category}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ServicesSnapshot({ data }: { data: Home["servicesSnapshot"] }) {
  return (
    <section className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{data.eyebrow}</span>
            <RevealText as="h2" className="mt-4 font-display text-5xl md:text-6xl leading-[1] tracking-tight">
              {data.title}
            </RevealText>
            <Link to="/services" className="mt-8 inline-block story-link text-sm uppercase tracking-[0.2em]">
              Explore services →
            </Link>
          </div>
          <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {data.items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="bg-background p-8"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-primary">0{i + 1}</div>
                <h3 className="mt-4 font-display text-3xl">{it.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{it.description}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FooterCta({ data }: { data: Home["footerCta"] }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40 text-center">
      <RevealText as="h2" className="font-display text-5xl md:text-8xl leading-[1] tracking-tight">
        {data.title}
      </RevealText>
      <div className="mt-12 flex justify-center">
        <MagneticButton strength={0.45}>
          <Link
            to={data.cta.href as "/contact"}
            data-cursor-text="Go"
            className="btn-shine inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm uppercase tracking-[0.25em] text-primary-foreground"
          >
            {data.cta.label} <span aria-hidden>→</span>
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}