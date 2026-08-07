import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function Loader() {
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 60, damping: 20 });
  const rounded = useTransform(smoothProgress, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    progress.set(100);
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70">
            <div className="gradient-blob b1 absolute top-1/4 left-1/4 h-[40vw] w-[40vw]" />
            <div className="gradient-blob b2 absolute bottom-1/4 right-1/4 h-[35vw] w-[35vw]" />
          </div>

          <div className="flex items-end gap-3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-display text-4xl md:text-6xl text-foreground"
            >
              Gairy Studio
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              loading
            </motion.span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-px w-[40vw] max-w-xs overflow-hidden bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, delay: 0.2, ease: [0.7, 0, 0.2, 1] }}
              />
            </div>
            <span className="font-display text-sm tabular-nums text-primary w-10">{display}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
