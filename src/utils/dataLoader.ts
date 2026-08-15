export async function loadData<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return (await res.json()) as T;
}

export const dataPaths = {
  site: "/data/site.json",
  page: "/data/page.json",
  work: "/data/work.json",
} as const;
