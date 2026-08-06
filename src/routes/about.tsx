import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { useCountUp, useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type About = {
  intro: { eyebrow: string; headline: string; paragraph: string };
  values: { title: string; description: string }[];
  stats: { value: number; suffix: string; label: string }[];
  team: { name: string; role: string; image: string }[];
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Studio — About" },
      { name: "description", content: "An independent studio of designers, engineers and motion artists." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useJson<About>(dataPaths.about);
  if (!data) return <div className="min-h-screen" />;

  return (
    <PageWrap>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{data.intro.eyebrow}</span>
        <RevealText as="h1" className="mt-6 font-display text-5xl md:text-[8vw] leading-[1] tracking-tight max-w-[14ch]">
          {data.intro.headline}
        </RevealText>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          {data.intro.paragraph}
        </motion.p>
      </section>

      {/* Stats */}
      <Stats stats={data.stats} />

      {/* Values */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Philosophy</span>
            <RevealText as="h2" className="mt-4 font-display text-5xl md:text-6xl leading-[1] tracking-tight">
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
                <h3 className="mt-4 font-display text-3xl">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{v.description}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-[1400px] px-6 pb-32 md:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <RevealText as="h2" className="font-display text-5xl md:text-7xl tracking-tight">
            Studio.
          </RevealText>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A senior team of {data.team.length}+ </span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {data.team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
            >
              <div className="media-hover aspect-[3/4] w-full bg-card">
                <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{m.name}</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageWrap>
  );
}

function Stats({ stats }: { stats: About["stats"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section ref={ref} className="border-y border-border bg-card/40 mt-24 md:mt-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-border md:grid-cols-4">
        {stats.map((s) => (
          <Stat key={s.label} start={inView} {...s} />
        ))}
      </div>
    </section>
  );
}
function Stat({ value, suffix, label, start }: About["stats"][number] & { start: boolean }) {
  const v = useCountUp(value, start);
  return (
    <div className="bg-background p-8 md:p-12">
      <div className="font-display text-5xl md:text-7xl tracking-tight">
        {v}<span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}
