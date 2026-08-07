import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt in degrees
};

export function TiltCard({ children, className = "", max = 10 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * max * 2;
    const rotateX = -(py - 0.5) * max * 2;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
  };

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card relative ${className}`}>
      <div ref={innerRef} className="tilt-card-inner">
        {children}
      </div>
      <span className="tilt-glare" aria-hidden />
    </div>
  );
}
