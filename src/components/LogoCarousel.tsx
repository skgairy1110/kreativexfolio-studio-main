import { useState } from "react";

type Props = { items: string[]; className?: string };

/**
 * Infinite-scrolling logo strip for "Brands we've worked with".
 * - Continuous, seamless loop (the item list is duplicated once so the
 *   marquee-x keyframe's -50% translate always lands on an identical frame).
 * - Whole strip pauses on hover so a name can actually be read.
 * - Each chip has its own hover state — dims up from grayscale/50% opacity
 *   to full color and lifts slightly — independent of the pause behavior.
 * - Edges fade to transparent via a mask so logos never look like they're
 *   clipping mid-shape as they enter/exit the row.
 */
export function LogoCarousel({ items, className = "" }: Props) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];

  return (
    <div
      className={`edge-fade-x relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="marquee-track-slow flex w-max items-stretch gap-4 md:gap-5"
        data-paused={paused}
      >
        {doubled.map((name, i) => (
          <div
            key={i}
            className="group flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-border bg-card/30 px-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_20px_40px_-24px] hover:shadow-primary/30 md:h-24 md:w-56"
          >
            <span className="font-display text-lg tracking-tight text-muted-foreground/50 grayscale transition-all duration-500 group-hover:scale-105 group-hover:text-foreground group-hover:grayscale-0 md:text-2xl">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
