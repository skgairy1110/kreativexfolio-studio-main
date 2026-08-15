// Purely decorative concentric dashed rings with an orbiting dot, positioned
// behind the "We are a team" stat blocks — a lightweight CSS stand-in for
// Textura's rotating outer/inner circle graphic.
export function OrbitRings({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className="orbit-ring outer" style={{ width: 420, height: 420, left: -210, top: -210 }}>
        <span className="orbit-dot" />
      </div>
      <div className="orbit-ring inner" style={{ width: 280, height: 280, left: -140, top: -140 }}>
        <span className="orbit-dot" />
      </div>
    </div>
  );
}
