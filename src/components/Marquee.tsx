type Props = { items: string[]; className?: string };

export function Marquee({ items, className = "" }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="marquee-track flex whitespace-nowrap">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="font-display text-[14vw] md:text-[10vw] leading-none px-8 text-foreground"
          >
            {t}
            <span className="text-primary px-8">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
