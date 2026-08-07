import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

type Props = {
  activeSrc: string | null;
};

/**
 * Floating image that trails the cursor, shown/hidden based on `activeSrc`.
 * Mount once near the top of a page; update `activeSrc` on item hover.
 */
export function HoverPreview({ activeSrc }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 250, damping: 30, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="hover-preview"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-60%" }}
    >
      <AnimatePresence mode="wait">
        {activeSrc && (
          <motion.img
            key={activeSrc}
            src={activeSrc}
            alt=""
            initial={{ opacity: 0, scale: 0.85, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
