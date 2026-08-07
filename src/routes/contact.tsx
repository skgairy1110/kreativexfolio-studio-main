import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageWrap } from "@/components/PageWrap";
import { RevealText } from "@/components/RevealText";
import { MagneticButton } from "@/components/MagneticButton";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendContactMessage } from "@/lib/api/contact.functions";

type ContactField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

type Contact = {
  intro: { eyebrow: string; headline: string; paragraph: string };
  channels: { label: string; value: string; href: string }[];
  locations: { city: string; address: string }[];
  form: { fields: ContactField[]; submitLabel: string; successMessage: string };
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Gairy Studio" },
      { name: "description", content: "Start a project with our studio. We respond within two business days." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useJson<Contact>(dataPaths.contact);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  if (!data) return <div className="min-h-screen" />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendContactMessage({
        data: {
          name: values.name || "",
          company: values.company || "",
          email: values.email || "",
          projectType: values.projectType || "",
          budget: values.budget || "",
          timeline: values.timeline || "",
          message: values.message || "",
        },
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong sending your message.");
    } finally {
      setSubmitting(false);
    }
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
                className="relative overflow-hidden rounded-3xl border border-border bg-card/40 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 md:p-10"
              >
                {/* subtle glow accent */}
                <div className="gradient-blob b3 pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-30" />

                <div className="relative grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                  {data.form.fields.map((f) => {
                    const isRequired = f.required !== false;
                    const isFull = f.type === "textarea";
                    const fieldBaseClass =
                      "block w-full rounded-xl border border-input bg-background/40 px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:border-primary focus:bg-background/70 focus:ring-2 focus:ring-primary/25";
                    // Same box (border, padding, radius, height, focus states) as fieldBaseClass, but
                    // keeps display:flex so the trigger text and chevron sit on one line, left-aligned.
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
                            {/* invisible field so native form validation covers the select */}
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
                  <p role="alert" className="relative mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
      </section>
    </PageWrap>
  );
}
