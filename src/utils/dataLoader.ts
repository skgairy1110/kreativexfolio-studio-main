export async function loadData<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return (await res.json()) as T;
}

export const dataPaths = {
  home: "/data/home.json",
  about: "/data/about.json",
  work: "/data/work.json",
  services: "/data/services.json",
  contact: "/data/contact.json",
} as const;
