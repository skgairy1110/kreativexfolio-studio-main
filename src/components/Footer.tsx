import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type NavLink = { label: string; href: string };
type Site = {
  logo: { image?: string; alt: string; text: string; accent: string };
  navigation: NavLink[];
  footer: {
    description: string;
    navigateLabel: string;
    elsewhereLabel: string;
    social: NavLink[];
    copyright: string;
    locationsLine: string;
  };
};

const FALLBACK: Site = {
  logo: { image: "/logo.svg", alt: "Gairy Studio", text: "Gairy Studio", accent: "." },
  navigation: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    description:
      "An independent design studio working with founders and brand leaders on the things that matter.",
    navigateLabel: "Navigate",
    elsewhereLabel: "Elsewhere",
    social: [
      { label: "Instagram", href: "#" },
      { label: "Are.na", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Vimeo", href: "#" },
    ],
    copyright: "Gairy Studio — All rights reserved",
    locationsLine: "London · Lisbon",
  },
};

export function Footer() {
  const { data } = useJson<Site>(dataPaths.site);
  const site = data ?? FALLBACK;
  const navLinks = site.navigation.filter((l) => l.href !== "/");

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 opacity-40">
        <div className="gradient-blob b3 absolute -bottom-1/2 left-1/2 h-[45vw] w-[45vw] -translate-x-1/2" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
              {site.logo.text}
              <span className="text-primary">{site.logo.accent}</span>
            </p>
            <p className="mt-6 max-w-md text-muted-foreground">{site.footer.description}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {site.footer.navigateLabel}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="story-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {site.footer.elsewhereLabel}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {site.footer.social.map((s) => (
                <li key={s.label}>
                  <MagneticButton strength={0.4}>
                    <a href={s.href} className="story-link inline-block">
                      {s.label}
                    </a>
                  </MagneticButton>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {site.footer.copyright}
          </span>
          <span>{site.footer.locationsLine}</span>
          <MagneticButton strength={0.5}>
            <button
              onClick={scrollTop}
              aria-label="Back to top"
              data-cursor-text="Top"
              className="back-to-top flex h-11 w-11 items-center justify-center rounded-full border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
