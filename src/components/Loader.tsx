import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
        >
          <div className="flex items-end gap-3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-5xl md:text-7xl text-foreground"
            >
              Studio
            </motion.span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.7, 0, 0.2, 1] }}
              className="mb-3 h-px bg-primary"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              loading
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
