import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageWrap({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="pt-28 md:pt-32"
    >
      {children}
    </motion.main>
  );
}
