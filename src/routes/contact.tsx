import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type Contact = {
  intro: { eyebrow: string; headline: string; paragraph: string };
  channels: { label: string; value: string; href: string }[];
  locations: { city: string; address: string }[];
  form: { fields: { name: string; label: string; type: string }[]; submitLabel: string; successMessage: string };
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Studio" },
      { name: "description", content: "Start a project with our studio. We respond within two business days." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useJson<Contact>(dataPaths.contact);
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  if (!data) return <div className="min-h-screen" />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageWrap>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{data.intro.eyebrow}</span>
        <RevealText as="h1" className="mt-6 font-display text-6xl md:text-[12vw] leading-[0.95] tracking-tight">
          {data.intro.headline}
        </RevealText>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1400px] gap-16 px-6 pb-32 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5 space-y-12">
          <p className="text-muted-foreground md:text-lg max-w-md">{data.intro.paragraph}</p>

          <div className="space-y-6">
            {data.channels.map((c) => (
              <div key={c.label}>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.label}</div>
                <a href={c.href} className="story-link mt-2 inline-block font-display text-2xl md:text-3xl">
                  {c.value}
                </a>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-border pt-8">
            {data.locations.map((l) => (
              <div key={l.city}>
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{l.city}</div>
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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl">✓</div>
                <p className="font-display text-3xl md:text-4xl">{data.form.successMessage}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {data.form.fields.map((f) => {
                  const isFocused = focused === f.name;
                  const hasValue = !!values[f.name];
                  const float = isFocused || hasValue;
                  return (
                    <div key={f.name} className="relative border-b border-border pt-6 pb-3">
                      <label
                        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                          float ? "top-0 text-xs uppercase tracking-[0.25em] text-primary" : "top-7 text-base text-muted-foreground"
                        }`}
                      >
                        {f.label}
                      </label>
                      {f.type === "textarea" ? (
                        <textarea
                          required
                          rows={4}
                          value={values[f.name] || ""}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused(null)}
                          className="block w-full resize-none bg-transparent text-lg outline-none"
                        />
                      ) : (
                        <input
                          required
                          type={f.type}
                          value={values[f.name] || ""}
                          onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused(null)}
                          className="block w-full bg-transparent text-lg outline-none"
                        />
                      )}
                      <motion.span
                        className="absolute bottom-0 left-0 h-px bg-primary"
                        initial={false}
                        animate={{ width: isFocused ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      />
                    </div>
                  );
                })}
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.25em] text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {data.form.submitLabel} <span aria-hidden>→</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrap>
  );
}
