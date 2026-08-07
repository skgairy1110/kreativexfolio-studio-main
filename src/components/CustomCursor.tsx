import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        const size = ringRef.current.dataset.label ? 88 : ringRef.current.dataset.hover === "true" ? 64 : 40;
        const half = size / 2;
        ringRef.current.style.transform = `translate3d(${rx - half}px, ${ry - half}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const setHover = (v: boolean) => {
      if (ringRef.current) ringRef.current.dataset.hover = v ? "true" : "false";
    };
    const setLabel = (text: string) => {
      if (ringRef.current) {
        if (text) ringRef.current.dataset.label = text;
        else delete ringRef.current.dataset.label;
      }
      if (labelRef.current) {
        labelRef.current.textContent = text;
        labelRef.current.style.opacity = text ? "1" : "0";
      }
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const labelEl = el.closest<HTMLElement>("[data-cursor-text]");
      if (labelEl) {
        setLabel(labelEl.dataset.cursorText || "");
        setHover(true);
        return;
      }
      setLabel("");
      if (el.closest("a, button, [data-cursor-hover], input, textarea, select")) setHover(true);
      else setHover(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
