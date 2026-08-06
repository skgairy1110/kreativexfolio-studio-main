import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadData } from "@/utils/dataLoader";

export function useJson<T>(path: string) {
  const { data, isLoading, error } = useQuery<T>({
    queryKey: ["json", path],
    queryFn: () => loadData<T>(path),
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
}

export function useCountUp(target: number, start: boolean, duration = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return v;
}
