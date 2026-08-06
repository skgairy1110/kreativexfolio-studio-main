import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type Services = {
  intro: { eyebrow: string; headline: string; paragraph: string };
  services: { number: string; title: string; description: string; deliverables: string[] }[];
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Studio" },
      { name: "description", content: "Brand, web, product, motion and campaign services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useJson<Services>(dataPaths.services);
  if (!data) return <div className="min-h-screen" />;
  return (
    <PageWrap>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{data.intro.eyebrow}</span>
        <RevealText as="h1" className="mt-6 font-display text-5xl md:text-[8vw] leading-[1] tracking-tight max-w-[16ch]">
          {data.intro.headline}
        </RevealText>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          {data.intro.paragraph}
        </motion.p>
      </section>

      <section className="mx-auto max-w-[1400px] mt-24 md:mt-32 border-t border-border">
        {data.services.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, delay: i * 0.04 }}
            className="group grid gap-6 border-b border-border px-6 py-10 md:grid-cols-12 md:items-baseline md:px-10 md:py-14 transition-colors hover:bg-card/30"
          >
            <div className="md:col-span-1 text-sm text-primary">{s.number}</div>
            <h3 className="md:col-span-4 font-display text-4xl md:text-6xl tracking-tight transition-transform duration-500 group-hover:translate-x-2">
              {s.title}
            </h3>
            <p className="md:col-span-4 text-muted-foreground md:text-lg">{s.description}</p>
            <ul className="md:col-span-3 flex flex-wrap gap-2">
              {s.deliverables.map((d) => (
                <li key={d} className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {d}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>
    </PageWrap>
  );
}
