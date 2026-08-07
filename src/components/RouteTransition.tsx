import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * A brief colour-wipe curtain that plays on every route change, on top of
 * each route's own PageWrap fade/slide. Origin flips from top to bottom
 * while fully covering the screen, so the flip itself is invisible and the
 * curtain reads as one continuous sweep down-then-up.
 */
export function RouteTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [playKey, setPlayKey] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPlayKey((k) => k + 1);
  }, [pathname]);

  return (
    <AnimatePresence>
      {playKey > 0 && (
        <motion.div
          key={playKey}
          className="route-curtain"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          style={{ transformOrigin: "bottom" }}
          transition={{ duration: 0.85, times: [0, 0.42, 0.55, 1], ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
