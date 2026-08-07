import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
};

export function RevealText({ children, className = "", delay = 0, as = "h2" }: Props) {
  const text = typeof children === "string" ? children : "";
  const lines = text.split("\n");
  const Comp = motion[as];

  // `background-clip: text` / gradient-fill utilities only work when applied
  // directly to the element that owns the literal text glyphs. Here the real
  // text sits two levels deep inside per-line "block overflow-hidden" wrapper
  // spans (used for the wipe-reveal animation), so the outer heading element
  // has no text of its own to clip a background to. Fill-related classes are
  // routed to the inner span that actually contains the characters; layout /
  // typographic classes (size, spacing, tracking, etc.) stay on the outer
  // block-level element, since properties like font-size and letter-spacing
  // are inherited down to the inner span regardless.
  const classList = className.split(/\s+/).filter(Boolean);
  const isFillClass = (c: string) => /^(bg-|from-|via-|to-)/.test(c) || c === "text-gradient" || c === "text-transparent";
  const fillClasses = classList.filter(isFillClass).join(" ");
  const layoutClasses = classList.filter((c) => !isFillClass(c)).join(" ");

  return (
    <Comp
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay }}
      className={layoutClasses}
    >
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          <motion.span variants={word} className={`inline-block ${fillClasses}`}>
            {line || "\u00A0"}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
