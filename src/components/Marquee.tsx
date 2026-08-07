import { useState } from "react";

type Props = { items: string[]; className?: string };

export function Marquee({ items, className = "" }: Props) {
  const doubled = [...items, ...items];
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="marquee-track flex whitespace-nowrap" data-paused={paused}>
        {doubled.map((t, i) => (
          <span
            key={i}
            className="font-display text-[14vw] md:text-[10vw] leading-none px-8 text-foreground transition-colors duration-300 hover:text-primary"
          >
            {t}
            <span className="text-primary px-8 inline-block transition-transform duration-500 hover:rotate-180">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
