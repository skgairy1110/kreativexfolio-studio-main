import { useState } from "react";

type Member = { name: string; role: string; image: string };
type Props = { members: Member[]; className?: string };

// A slow, pausable row of circular team photos that scrolls horizontally —
// the same "wall of faces" treatment agencies like Textura use to introduce
// the people behind the work before drilling into named roles.
export function TeamMarquee({ members, className = "" }: Props) {
  const doubled = [...members, ...members];
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="marquee-track-slow flex w-max items-center gap-6 md:gap-8"
        data-paused={paused}
      >
        {doubled.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className="group flex flex-shrink-0 flex-col items-center gap-3"
          >
            <div className="media-hover h-20 w-20 overflow-hidden rounded-full border border-border md:h-28 md:w-28">
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {m.name}
            </span>
          </div>
        ))}
      </div>
      {/* edge fade so the loop point never looks like a hard cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent md:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent md:w-32"
      />
    </div>
  );
}
