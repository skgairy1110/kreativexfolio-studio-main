import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Palette, Sparkles, Camera, Layers, PenTool, Film, Code2, Megaphone, Wand2, Brush, Type, Zap } from "lucide-react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { Marquee } from "@/components/Marquee";
import { MagneticButton } from "@/components/MagneticButton";
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative -mt-28 md:-mt-32 h-[100svh] min-h-[100svh] w-full noise overflow-hidden animated-gradient-bg">
      {/* animated gradient blobs */}
      <motion.div aria-hidden style={{ y }} className="absolute inset-0 -z-10">
        <div className="gradient-blob b1 -top-[20%] left-[10%] h-[55vw] w-[55vw]" />
        <div className="gradient-blob b2 top-[30%] right-[-10%] h-[45vw] w-[45vw]" />
        <div className="gradient-blob b3 bottom-[-20%] left-[20%] h-[40vw] w-[40vw]" />
      </motion.div>

      {/* Floating agency icons */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        {AGENCY_ICONS.map((item, i) => (
          <FloatingIcon key={i} item={item} index={i} progress={scrollYProgress} />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 pb-12 pt-24 md:px-10 md:pb-20 md:pt-32">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center"
        >
          {data.eyebrow}
        </motion.span>

        <motion.div style={{ y: titleY, scale: titleScale }} className="my-12 md:my-0 text-center">
          <RevealText
            as="h1"
            delay={1.5}
            className="font-display text-gradient text-[8vw] md:text-[6vw] leading-[0.95] tracking-tight"
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
            className="flex items-center gap-4"
          >
            <MagneticButton>
              <Link
                to={data.cta.href as "/contact"}
                className="btn-shine inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-[0_20px_60px_-20px] shadow-primary/60"
              >
                {data.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </MagneticButton>
            <Link
              to={data.secondaryCta.href as "/work"}
              className="story-link text-sm uppercase tracking-[0.2em]"
            >
              {data.secondaryCta.label}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

type IconItem = {
  Icon: typeof Palette;
  top: string;
  left: string;
  size: number;
  speed: number;
  rot: number;
  tint: string;
};

const AGENCY_ICONS: IconItem[] = [
  { Icon: Palette,   top: "8%",  left: "5%",  size: 56, speed: -0.35, rot: -8,  tint: "from-pink-500/30 to-purple-500/30" },
  { Icon: PenTool,   top: "16%", left: "82%", size: 64, speed:  0.45, rot:  10, tint: "from-amber-400/30 to-rose-500/30" },
  { Icon: Camera,    top: "62%", left: "6%",  size: 72, speed:  0.6,  rot:  6,  tint: "from-cyan-400/30 to-blue-500/30" },
  { Icon: Film,      top: "70%", left: "84%", size: 60, speed: -0.5,  rot: -9,  tint: "from-violet-500/30 to-fuchsia-500/30" },
  { Icon: Layers,    top: "40%", left: "2%",  size: 48, speed:  0.3,  rot:  12, tint: "from-emerald-400/30 to-teal-500/30" },
  { Icon: Sparkles,  top: "44%", left: "90%", size: 52, speed: -0.4,  rot: -12, tint: "from-yellow-300/30 to-orange-500/30" },
  { Icon: Code2,     top: "84%", left: "44%", size: 56, speed:  0.25, rot: -3,  tint: "from-sky-400/30 to-indigo-500/30" },
  { Icon: Megaphone, top: "4%",  left: "44%", size: 52, speed: -0.25, rot:  4,  tint: "from-red-400/30 to-pink-500/30" },
  { Icon: Brush,     top: "30%", left: "30%", size: 44, speed:  0.2,  rot:  -6, tint: "from-fuchsia-400/30 to-purple-500/30" },
  { Icon: Type,      top: "78%", left: "22%", size: 48, speed: -0.3,  rot:  8,  tint: "from-lime-400/30 to-emerald-500/30" },
  { Icon: Wand2,     top: "26%", left: "62%", size: 50, speed:  0.35, rot:  -5, tint: "from-indigo-400/30 to-violet-500/30" },
  { Icon: Zap,       top: "56%", left: "70%", size: 46, speed: -0.28, rot:  9,  tint: "from-orange-400/30 to-amber-500/30" },
];

function FloatingIcon({
  item,
  index,
  progress,
}: {
  item: IconItem;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, 600 * item.speed]);
  const rotate = useTransform(progress, [0, 1], [item.rot, item.rot + item.speed * 20]);
  const { Icon } = item;
  return (
    <motion.div
      style={{ y, rotate, top: item.top, left: item.left, width: item.size, height: item.size }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6 + index * 0.06, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute pointer-events-auto float-y"
    >
      <div className={`group relative h-full w-full rounded-2xl border border-border/60 bg-gradient-to-br ${item.tint} backdrop-blur-md shadow-[0_10px_40px_-10px] shadow-primary/20 flex items-center justify-center transition-transform duration-500 hover:scale-110 hover:rotate-6`}>
        <Icon className="h-1/2 w-1/2 text-foreground/90 transition-colors group-hover:text-primary" strokeWidth={1.5} />
      </div>
    </motion.div>
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
            <Link to="/work/$slug" params={{ slug: p.slug }} className="block group lift">
              <div className="gradient-border">
                <div className="gb-inner media-hover aspect-[4/5] w-full">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
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
            className="inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm uppercase tracking-[0.25em] text-primary-foreground"
          >
            {data.cta.label} <span aria-hidden>→</span>
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}
