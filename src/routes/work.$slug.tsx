import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type Project = {
  slug: string; title: string; category: string; image: string;
  client: string; year: string; description: string;
  sections: { challenge: string; solution: string; result: string };
  gallery: string[];
};
type Work = { projects: Project[] };

export const Route = createFileRoute("/work/$slug")({
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useJson<Work>(dataPaths.work);

  if (!data) return <div className="min-h-screen" />;
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) throw notFound();

  return (
    <PageWrap>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Link to="/work" className="story-link">Work</Link>
          <span>/</span>
          <span>{project.category}</span>
        </div>
        <RevealText as="h1" className="mt-6 font-display bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-200 text-6xl md:text-[9vw] leading-[0.95] tracking-tight">
          {project.title}
        </RevealText>
        <div className="mt-10 grid gap-6 border-t border-border pt-6 md:grid-cols-4 text-sm">
          <div><div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Client</div><div className="mt-2">{project.client}</div></div>
          <div><div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Year</div><div className="mt-2">{project.year}</div></div>
          <div><div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Discipline</div><div className="mt-2">{project.category}</div></div>
          <div className="md:text-right"><Link to="/contact" className="story-link uppercase tracking-[0.25em]">Start a project →</Link></div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto mt-16 max-w-[1600px] px-6 md:px-10"
      >
        <div className="media-hover aspect-[16/9] w-full bg-card">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        </div>
      </motion.div>

      {/* Story sections */}
      <section className="mx-auto max-w-[1100px] px-6 py-24 md:py-40 md:px-10">
        <RevealText as="p" className="font-display text-3xl md:text-5xl leading-[1.1] tracking-tight">
          {project.description}
        </RevealText>

        <div className="mt-24 space-y-20">
          {(["challenge", "solution", "result"] as const).map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8 }}
              className="grid gap-6 md:grid-cols-12"
            >
              <h3 className="md:col-span-3 text-xs uppercase tracking-[0.3em] text-primary">
                {key}
              </h3>
              <p className="md:col-span-9 text-xl md:text-2xl leading-relaxed text-foreground/90">
                {project.sections[key]}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-10 space-y-8">
        {project.gallery.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className={`media-hover bg-card ${i % 2 === 0 ? "aspect-[16/9]" : "aspect-[4/3] md:w-3/4 md:ml-auto"}`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </motion.div>
        ))}
      </section>

      {/* Next */}
      <section className="border-t border-border">
        <Link to="/work" className="block py-20 text-center group" data-cursor-text="Browse">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Browse</span>
          <div className="mt-4 font-display text-5xl md:text-7xl tracking-tight group-hover:text-primary transition-colors">
            All projects →
          </div>
        </Link>
      </section>
    </PageWrap>
  );
}
