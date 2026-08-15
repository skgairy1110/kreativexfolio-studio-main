import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type NavLink = { label: string; href: string };
type Site = {
  logo: { image?: string; alt: string; text: string; accent: string };
  navigation: NavLink[];
  navCta: NavLink;
};

// Sensible defaults so the nav never flashes empty while /data/site.json loads.
const FALLBACK: Site = {
  logo: { image: "/logo.svg", alt: "Gairy Studio", text: "Gairy Studio", accent: "." },
  navigation: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Team", href: "/#team" },
    { label: "Story", href: "/#story" },
  ],
  navCta: { label: "Book a meeting", href: "/#contact" },
};

export function Navbar() {
  const { data } = useJson<Site>(dataPaths.site);
  const site = data ?? FALLBACK;

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — highlight whichever section anchor is currently in view,
  // so the underline tracks scroll position on this single long page.
  useEffect(() => {
    const ids = site.navigation.map((l) => l.href.split("#")[1]).filter(Boolean);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [site.navigation]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors duration-500 ${
          scrolled ? "bg-background/60 border-b border-border" : "bg-background/30"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10 transition-[padding] duration-500 ${
            scrolled ? "py-4" : "py-5"
          }`}
        >
          <MagneticButton strength={0.25}>
            <a href="/" className="flex items-center">
              {site.logo.image ? (
                <img src={site.logo.image} alt={site.logo.alt} className="h-7 md:h-8 w-auto" />
              ) : (
                <span className="font-display text-2xl tracking-tight">
                  {site.logo.text}
                  <span className="text-primary">{site.logo.accent}</span>
                </span>
              )}
            </a>
          </MagneticButton>

          {/* Desktop nav — minimal links with a two-line text-swap reveal
              on hover, and a thin underline marking the section in view. */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {site.navigation.map((l) => {
              const active = activeHash === `#${l.href.split("#")[1]}`;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="group relative flex items-center px-4 py-2"
                >
                  <span className="relative block h-[1.1em] overflow-hidden">
                    <span
                      className={`block uppercase tracking-[0.18em] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        active
                          ? "-translate-y-full text-muted-foreground"
                          : "text-muted-foreground group-hover:-translate-y-full"
                      }`}
                    >
                      {l.label}
                    </span>
                    <span
                      className={`absolute inset-0 block uppercase tracking-[0.18em] text-foreground transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        active ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
                      }`}
                    >
                      {l.label}
                    </span>
                  </span>

                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute bottom-0.5 left-4 right-4 h-px bg-primary"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <MagneticButton strength={0.3} className="hidden md:inline-block">
            <a
              href={site.navCta.href}
              className="group relative inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground"
            >
              {site.navCta.label}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          </MagneticButton>

          {/* Mobile / tablet hamburger — a plain, custom two-into-X mark
              instead of an icon-library glyph. */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor-text={open ? "Close" : "Menu"}
            className="flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-px w-full bg-foreground transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-foreground transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-full bg-foreground transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Mobile / tablet full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-background px-6 pb-10 pt-28 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {site.navigation.map((l, i) => {
                const active = activeHash === `#${l.href.split("#")[1]}`;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <a
                      href={l.href}
                      onClick={closeMenu}
                      className={`block border-b border-border py-4 font-display text-4xl tracking-tight transition-colors ${
                        active ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {l.label}
                    </a>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + site.navigation.length * 0.06,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              >
                <a
                  href={site.navCta.href}
                  onClick={closeMenu}
                  className="block border-b border-border py-4 font-display text-4xl tracking-tight text-primary"
                >
                  {site.navCta.label}
                </a>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + (site.navigation.length + 1) * 0.06 }}
              className="flex flex-col gap-6"
            >
              <span className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {site.logo.text}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
