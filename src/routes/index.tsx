import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { Marquee } from "@/components/Marquee";
import { LogoCarousel } from "@/components/LogoCarousel";
import { TeamMarquee } from "@/components/TeamMarquee";
import { OrbitRings } from "@/components/OrbitRings";
import { MagneticButton } from "@/components/MagneticButton";
import { TiltCard } from "@/components/TiltCard";
import { HeroGalaxy, type GalaxyHandle } from "@/components/HeroGalaxy";
import { useCountUp, useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ————————————————————————————————————————————————————————————————
// Types — mirror the shape of /public/data/page.json exactly, so editing
// that single JSON file is the only thing needed to update this page.
// ————————————————————————————————————————————————————————————————
type Hero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  tags: string[];
};
type WorkProject = {
  slug: string;
  title: string;
  category: string;
  image: string;
  featured?: boolean;
};
type WorkData = { projects: WorkProject[] };
type Work = { eyebrow: string; title: string; viewAllLabel: string };
type Service = { number: string; title: string; description: string; deliverables: string[] };
type Services = { eyebrow: string; title: string; items: Service[] };
type Stat = { value: number; suffix: string; label: string };
type TeamMember = { name: string; role: string; group: string; image: string };
type Team = {
  eyebrow: string;
  headline: string;
  stats: Stat[];
  membersTitle: string;
  members: TeamMember[];
};
type Story = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  values: { title: string; description: string }[];
};
type Clients = { eyebrow: string; title: string; logos: string[] };
type ContactField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};
type Contact = {
  eyebrow: string;
  headline: string;
  paragraph: string;
  channels: { label: string; value: string; href: string }[];
  locations: { city: string; address: string }[];
  form: { fields: ContactField[]; submitLabel: string; successMessage: string };
};
type Page = {
  hero: Hero;
  work: Work;
  services: Services;
  team: Team;
  story: Story;
  clients: Clients;
  contact: Contact;
};

const CONTACT_EMAIL = "gairystudio@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gairy Studio — Independent Design Studio" },
      {
        name: "description",
        content:
          "Gairy Studio is an independent creative and digital agency crafting UI/UX, web design & development, branding, motion and social for ambitious brands.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useJson<Page>(dataPaths.page);
  const { data: work } = useJson<WorkData>(dataPaths.work);
  if (!data) return <div className="min-h-screen" />;

  const featuredProjects = (work?.projects ?? []).filter((p) => p.featured).slice(0, 4);

  return (
    <PageWrap>
      <Hero data={data.hero} />
      <Work data={data.work} projects={featuredProjects} />
      <Services data={data.services} />
      <Team data={data.team} />
      <Story data={data.story} />
      <Clients data={data.clients} />
      <Contact data={data.contact} />
    </PageWrap>
  );
}

/* ————————————————————————————————————————————————————————————————
   Hero — big brand name, tagline, service-tag pills and a single CTA
   that scrolls straight to the contact form at the bottom of the page.
   ———————————————————————————————————————————————————————————————— */
function Hero({ data }: { data: Hero }) {
  const ref = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<GalaxyHandle>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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

  const textX = useTransform(springX, (v) => v * 6);
  const textParY = useTransform(springY, (v) => v * 6);
  const textScale = useTransform(
    [springX, springY],
    ([sx, sy]) => 1 + Math.min(0.018, (Math.abs(sx as number) + Math.abs(sy as number)) * 0.01),
  );
  const combinedTitleY = useTransform(
    [titleY, textParY],
    ([a, b]) => (a as number) + (b as number),
  );
  const combinedTitleScale = useTransform(
    [titleScale, textScale],
    ([a, b]) => (a as number) * (b as number),
  );

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative -mt-28 md:-mt-32 h-[100svh] min-h-[100svh] w-full noise overflow-hidden bg-[#050308]"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(45% 40% at 18% 15%, rgba(147,51,234,0.18), transparent 70%)," +
            "radial-gradient(40% 35% at 85% 10%, rgba(56,189,248,0.12), transparent 70%)," +
            "radial-gradient(50% 45% at 75% 90%, rgba(183,255,0,0.10), transparent 70%)," +
            "linear-gradient(180deg, #050308 0%, #0a0714 45%, #050308 100%)",
        }}
      />

      {/* Ambient drifting blobs — slow, independent loops, unrelated to scroll */}
      <motion.div aria-hidden style={{ y }} className="absolute inset-0 -z-10 mix-blend-screen">
        <div className="absolute -top-[8%] -left-[8%] h-[30vw] max-h-[380px] w-[30vw] max-w-[380px] rounded-full bg-fuchsia-600/10 blur-[110px] [animation:blob-float_22s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[10%] left-[25%] h-[26vw] max-h-[340px] w-[26vw] max-w-[340px] rounded-full bg-primary/10 blur-[120px] [animation:blob-float_31s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[20%] right-[6%] h-[22vw] max-h-[300px] w-[22vw] max-w-[300px] rounded-full bg-cyan-400/10 blur-[110px] [animation:blob-float_26s_ease-in-out_infinite_2.4s]" />
      </motion.div>

      {/* Second, much slower plane of motion sitting under the galaxy canvas */}
      <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />

      <HeroGalaxy ref={galaxyRef} progress={scrollYProgress} />

      {/* Vignette so the corners stay dark and the type keeps full contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 45%, transparent 40%, rgba(5,3,8,0.55) 100%)",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 pb-14 pt-24 md:px-10 md:pb-16 md:pt-32"
      >
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="inline-flex items-center gap-2.5 self-center rounded-full border border-border/80 bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm md:self-auto"
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {data.eyebrow}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="hidden flex-wrap items-center justify-end gap-2 md:flex"
          >
            {data.tags.map((t) => (
              <span
                key={t}
                className="tag-pill rounded-full border border-border px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: combinedTitleY, scale: combinedTitleScale, x: textX }}
          className="relative my-10 md:my-0 text-center"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vw] max-h-[560px] w-[46vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[100px]"
          />
          <RevealText
            as="h1"
            delay={1.5}
            className="font-display bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-primary to-cyan-200 text-[15vw] md:text-[7.4vw] leading-[0.92] tracking-tight"
          >
            {data.title}
          </RevealText>
        </motion.div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col-reverse gap-7 md:flex-row md:items-end md:justify-between">
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
              className="flex items-center gap-6"
            >
              <a
                href="#work"
                className="story-link hidden text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground md:inline-block"
              >
                View our work
              </a>
              <MagneticCtaGlow>
                <MagneticButton>
                  <a
                    href={data.cta.href}
                    className="btn-shine inline-flex items-center gap-2 md:gap-3 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-primary-foreground shadow-[0_20px_60px_-20px] shadow-primary/60 md:px-8 md:py-4 md:text-sm md:tracking-[0.2em]"
                  >
                    {data.cta.label}
                    <span aria-hidden>→</span>
                  </a>
                </MagneticButton>
              </MagneticCtaGlow>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-2 md:hidden"
          >
            {data.tags.map((t) => (
              <span
                key={t}
                className="tag-pill rounded-full border border-border px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <ScrollCue opacity={opacity} />
    </section>
  );
}

/* Bottom-center "scroll" affordance — slow, continuous vertical drift so the
   hero always reads as alive even once the entrance timeline has settled. */
function ScrollCue({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.9, duration: 0.8 }}
      className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
    >
      <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
        Scroll
      </span>
      <span className="float-y h-9 w-px bg-gradient-to-b from-muted-foreground/60 to-transparent" />
    </motion.div>
  );
}

const CTA_PARTICLE_ANGLES = [0, 1, 2, 3, 4, 5].map((i) => (i / 6) * Math.PI * 2);

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
            style={{
              background:
                "radial-gradient(circle, rgba(183,255,0,0.35), rgba(139,92,246,0.18) 55%, transparent 75%)",
            }}
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

/* ————————————————————————————————————————————————————————————————
   Featured Work
   ———————————————————————————————————————————————————————————————— */
function Work({ data, projects }: { data: Work; projects: WorkProject[] }) {
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40 scroll-mt-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {data.eyebrow}
          </span>
          <RevealText
            as="h2"
            className="mt-4 font-display text-5xl md:text-7xl leading-[1] tracking-tight"
          >
            {data.title}
          </RevealText>
        </div>
        <Link
          to="/work"
          className="hidden md:inline-flex story-link text-sm uppercase tracking-[0.2em]"
        >
          {data.viewAllLabel} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className={i % 2 === 1 ? "md:translate-y-24" : ""}
          >
            <Link
              to="/work/$slug"
              params={{ slug: p.slug }}
              className="block group lift"
              data-cursor-text="View"
            >
              <TiltCard>
                <div className="gradient-border">
                  <div className="gb-inner media-hover aspect-[4/5] w-full">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </TiltCard>
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display text-3xl md:text-4xl transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {p.category}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center md:hidden">
        <Link to="/work" className="story-link text-sm uppercase tracking-[0.2em]">
          {data.viewAllLabel} →
        </Link>
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————————————————————————
   Services — numbered rows with deliverable chips
   ———————————————————————————————————————————————————————————————— */
function Services({ data }: { data: Services }) {
  return (
    <section id="services" className="border-t border-border bg-card/30 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10 md:pt-32">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {data.eyebrow}
        </span>
        <RevealText
          as="h2"
          className="mt-4 font-display text-5xl md:text-7xl leading-[1] tracking-tight"
        >
          {data.title}
        </RevealText>
      </div>

      <div className="mx-auto max-w-[1400px] mt-16 border-t border-border">
        {data.items.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.04 }}
            data-cursor-text=""
            className="group grid gap-6 border-b border-border px-6 py-10 md:grid-cols-12 md:items-baseline md:px-10 md:py-14 transition-colors hover:bg-card/30"
          >
            <div className="md:col-span-1 text-sm text-primary transition-transform duration-500 group-hover:scale-125">
              {s.number}
            </div>
            <h3 className="md:col-span-4 font-display text-4xl md:text-5xl tracking-tight transition-transform duration-500 group-hover:translate-x-2">
              {s.title}
            </h3>
            <p className="md:col-span-4 text-muted-foreground md:text-lg">{s.description}</p>
            <ul className="md:col-span-3 flex flex-wrap gap-2">
              {s.deliverables.map((d) => (
                <li
                  key={d}
                  className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-foreground"
                >
                  {d}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————————————————————————
   Team — "we are a team" stats w/ orbit graphic, then a scrolling
   photo marquee and a named grid of studio members.
   ———————————————————————————————————————————————————————————————— */
function Team({ data }: { data: Team }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: "-20% 0px" });

  return (
    <section id="team" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32 scroll-mt-24">
      <div className="relative grid gap-16 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {data.eyebrow}
          </span>
          <RevealText
            as="h2"
            className="mt-4 font-display text-4xl md:text-6xl leading-[1.1] tracking-tight"
          >
            {data.headline}
          </RevealText>
        </div>

        <div className="relative flex items-center justify-center md:col-span-5">
          <OrbitRings className="left-1/2 top-1/2" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur md:h-56 md:w-56">
            <span className="font-display text-2xl text-primary md:text-3xl">Gairy Studio</span>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
      >
        {data.stats.map((s) => (
          <StatBlock key={s.label} start={inView} {...s} />
        ))}
      </div>

      <div className="mt-24">
        <RevealText as="h3" className="font-display text-3xl md:text-4xl tracking-tight">
          {data.membersTitle}
        </RevealText>
        <div className="mt-10">
          <TeamMarquee members={data.members} />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {data.members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
            >
              <TiltCard max={6}>
                <div className="media-hover aspect-[3/4] w-full rounded-xl bg-card">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
              </TiltCard>
              <h4 className="mt-4 font-display text-2xl">{m.name}</h4>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, suffix, label, start }: Stat & { start: boolean }) {
  const v = useCountUp(value, start);
  return (
    <div className="bg-background p-8 md:p-12">
      <div className="font-display text-4xl md:text-6xl tracking-tight">
        {v}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}

/* ————————————————————————————————————————————————————————————————
   Story — journey narrative + "how we work" values grid
   ———————————————————————————————————————————————————————————————— */
function Story({ data }: { data: Story }) {
  return (
    <section id="story" className="border-t border-border bg-card/30 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {data.eyebrow}
        </span>
        <div className="mt-6 max-w-3xl space-y-6">
          {data.paragraphs.map((p, i) => (
            <RevealText
              key={i}
              as="p"
              delay={i * 0.1}
              className="font-display text-2xl md:text-4xl leading-[1.3] tracking-tight text-foreground/90"
            >
              {p}
            </RevealText>
          ))}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Philosophy
            </span>
            <RevealText
              as="h3"
              className="mt-4 font-display text-4xl md:text-5xl leading-[1] tracking-tight"
            >
              How we{"\n"}work.
            </RevealText>
          </div>
          <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {data.values.map((v, i) => (
              <motion.li
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.07 }}
                className="bg-background p-8"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-primary">0{i + 1}</div>
                <h4 className="mt-4 font-display text-2xl md:text-3xl">{v.title}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{v.description}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————————————————————————
   Clients & Collaborators — a text marquee of names, since the
   studio doesn't yet have a set of vector client logos on file.
   ———————————————————————————————————————————————————————————————— */
function Clients({ data }: { data: Clients }) {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {data.eyebrow}
        </span>
        <RevealText
          as="h2"
          className="mt-4 font-display text-4xl md:text-6xl leading-[1] tracking-tight"
        >
          {data.title}
        </RevealText>
      </div>
      <div className="mt-12 border-y border-border py-10">
        <LogoCarousel items={data.logos} />
      </div>
    </section>
  );
}

/* ————————————————————————————————————————————————————————————————
   Contact — "let's talk" heading + the enquiry form, last section
   on the page per spec.
   ———————————————————————————————————————————————————————————————— */
function Contact({ data }: { data: Contact }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New project enquiry from ${values.name || "website visitor"}`,
          _template: "table",
          _captcha: "false",
          _replyto: values.email || "",
          Name: values.name || "",
          "Company / Brand": values.company || "—",
          Email: values.email || "",
          "Type of project": values.projectType || "",
          "Estimated budget": values.budget || "",
          "Ideal timeline": values.timeline || "",
          "Project details": values.message || "",
        }),
      });
      if (!response.ok)
        throw new Error("Failed to send your message. Please try again in a moment.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong sending your message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-t border-border scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10 md:pt-32">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {data.eyebrow}
        </span>
        <RevealText
          as="h1"
          className="mt-6 font-display text-6xl md:text-[10vw] leading-[0.95] tracking-tight"
        >
          {data.headline}
        </RevealText>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] gap-16 px-6 pb-32 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5 space-y-12">
          <p className="text-muted-foreground md:text-lg max-w-md">{data.paragraph}</p>

          <div className="space-y-6">
            {data.channels.map((c) => (
              <div key={c.label}>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {c.label}
                </div>
                <a
                  href={c.href}
                  className="story-link mt-2 inline-block font-display text-2xl md:text-3xl"
                >
                  {c.value}
                </a>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-border pt-8">
            {data.locations.map((l) => (
              <div key={l.city}>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {l.city}
                </div>
                <div className="mt-2 text-sm">{l.address}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-border bg-card/50 p-10 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl">
                  ✓
                </div>
                <p className="font-display text-3xl md:text-4xl">{data.form.successMessage}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 md:p-10"
              >
                <div className="gradient-blob b3 pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-30" />

                <div className="relative grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                  {data.form.fields.map((f) => {
                    const isRequired = f.required !== false;
                    const isFull = f.type === "textarea";
                    const fieldBaseClass =
                      "block w-full rounded-xl border border-input bg-background/40 px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary focus:bg-background/70 focus:ring-2 focus:ring-primary/25";
                    const selectTriggerClass =
                      "flex h-auto w-full items-center justify-between rounded-xl border border-input bg-background/40 px-4 py-3.5 text-base text-foreground data-[placeholder]:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary focus:bg-background/70 focus:ring-2 focus:ring-primary/25 [&>span]:text-left";

                    return (
                      <div key={f.name} className={`space-y-2 ${isFull ? "sm:col-span-2" : ""}`}>
                        <label className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {f.label}
                          {isRequired && <span className="ml-1 text-primary">*</span>}
                        </label>

                        {f.type === "textarea" ? (
                          <textarea
                            required={isRequired}
                            rows={5}
                            value={values[f.name] || ""}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                            placeholder="Share a few details about scope, goals and inspiration…"
                            className={`${fieldBaseClass} resize-none`}
                          />
                        ) : f.type === "select" ? (
                          <>
                            <Select
                              value={values[f.name] || ""}
                              onValueChange={(val) => setValues((v) => ({ ...v, [f.name]: val }))}
                            >
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder={`Select ${f.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-border bg-popover/95 backdrop-blur-xl">
                                {f.options?.map((opt) => (
                                  <SelectItem
                                    key={opt}
                                    value={opt}
                                    className="cursor-pointer rounded-lg py-2.5 pl-3 pr-8 text-sm focus:bg-primary/15 focus:text-foreground"
                                  >
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <input
                              tabIndex={-1}
                              autoComplete="off"
                              value={values[f.name] || ""}
                              required={isRequired}
                              onChange={() => {}}
                              className="pointer-events-none absolute h-0 w-0 opacity-0"
                            />
                          </>
                        ) : (
                          <input
                            required={isRequired}
                            type={f.type}
                            value={values[f.name] || ""}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                            placeholder={f.label}
                            className={fieldBaseClass}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {error && (
                  <p
                    role="alert"
                    className="relative mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}

                <div className="relative mt-9 flex items-center justify-between gap-6 border-t border-border pt-7">
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Fields marked <span className="text-primary">*</span> are required.
                  </p>
                  <MagneticButton strength={0.35}>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-cursor-text="Send"
                      className="btn-shine inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : data.form.submitLabel} <span aria-hidden>→</span>
                    </button>
                  </MagneticButton>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}