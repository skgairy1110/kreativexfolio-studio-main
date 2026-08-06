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
  return (
    <Comp
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay }}
      className={className}
    >
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden">
          <motion.span variants={word} className="inline-block">
            {line || "\u00A0"}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
