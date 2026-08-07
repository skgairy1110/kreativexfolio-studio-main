import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { useJson } from "@/hooks/use-json";
import { dataPaths } from "@/utils/dataLoader";

type NavLink = { label: string; href: string };
type Site = {
  logo: { image?: string; alt: string; text: string; accent: string };
  navigation: NavLink[];
  navCta: { label: string; href: string };
};

// Sensible defaults so the nav never flashes empty while /data/site.json loads.
const FALLBACK: Site = {
  logo: { image: "/logo.svg", alt: "Gairy Studio", text: "Gairy Studio", accent: "." },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  navCta: { label: "Start a project", href: "/contact" },
};

export function Navbar() {
  const { data } = useJson<Site>(dataPaths.site);
  const site = data ?? FALLBACK;

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
            <Link to="/" className="flex items-center">
              {site.logo.image ? (
                <img src={site.logo.image} alt={site.logo.alt} className="h-7 md:h-8 w-auto" />
              ) : (
                <span className="font-display text-2xl tracking-tight">
                  {site.logo.text}
                  <span className="text-primary">{site.logo.accent}</span>
                </span>
              )}
            </Link>
          </MagneticButton>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {site.navigation.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
                <MagneticButton key={l.href} strength={0.3} className="relative">
                  <Link
                    to={l.href}
                    className={`relative block px-4 py-2 uppercase tracking-[0.18em] transition-colors duration-300 ${
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </MagneticButton>
              );
            })}
          </nav>

          <MagneticButton strength={0.3} className="hidden md:inline-block">
            <Link
              to={site.navCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              {site.navCta.label}
              <span aria-hidden>→</span>
            </Link>
          </MagneticButton>

          {/* Mobile / tablet hamburger */}
          <MagneticButton strength={0.35} className="md:hidden">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-cursor-text={open ? "Close" : "Menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.25 }}
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Menu className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </MagneticButton>
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
                const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Link
                      to={l.href}
                      className={`block border-b border-border py-4 font-display text-4xl tracking-tight transition-colors ${
                        active ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + site.navigation.length * 0.06 }}
              className="flex flex-col gap-6"
            >
              <Link
                to={site.navCta.href}
                className="btn-shine inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground"
              >
                {site.navCta.label}
                <span aria-hidden>→</span>
              </Link>
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
