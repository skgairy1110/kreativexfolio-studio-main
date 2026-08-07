import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { TiltCard } from "@/components/TiltCard";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type Project = {
  slug: string; title: string; category: string; image: string;
  client: string; year: string;
};
type Work = { categories: string[]; projects: Project[] };

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Gairy Studio" },
      { name: "description", content: "Selected projects across brand, web, product, motion and campaigns." },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { data } = useJson<Work>(dataPaths.work);
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (!data) return [];
    return active === "All" ? data.projects : data.projects.filter((p) => p.category === active);
  }, [data, active]);

  if (!data) return <div className="min-h-screen" />;

  return (
    <PageWrap>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Selected Work</span>
        <RevealText as="h1" className="mt-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-200 text-6xl md:text-[10vw] leading-[0.95] tracking-tight">
          Things we've{"\n"}made.
        </RevealText>

        {/* Filters */}
        <div className="mt-16 flex flex-wrap gap-2 border-b border-border pb-6">
          {data.categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`relative rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 pb-32">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                className={i % 2 === 1 ? "md:translate-y-20" : ""}
              >
                <Link to="/work/$slug" params={{ slug: p.slug }} className="group block lift" data-cursor-text="View">
                  <TiltCard>
                    <div className="gradient-border">
                      <div className="gb-inner media-hover aspect-[4/5] w-full">
                        <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </TiltCard>
                  <div className="mt-5 flex items-baseline justify-between gap-6">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl transition-colors group-hover:text-primary">{p.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        {p.client} · {p.year}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{p.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </PageWrap>
  );
}
