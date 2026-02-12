export interface RecentEntry {
  id: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
  date: Date;
}

const KEY = "recentlyViewed";
const MAX = 10;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface RawEntry {
  id: number;
  slug: string;
  name: string;
  image: string;
  variantId: number;
  date: string;
}
export function getRecent(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(KEY);
    if (!stored) return [];

    const raw: RawEntry[] = JSON.parse(stored);
    const cutoff = Date.now() - WEEK_MS;

    return raw
      .map((e) => ({
        id: e.id,
        slug: e.slug,
        name: e.name,
        image: e.image,
        variantId: e.variantId,
        date: new Date(e.date),
      }))
      .filter((e) => e.date.getTime() > cutoff);
  } catch {
    return [];
  }
}

export function pushRecent(entry: RecentEntry): void {
  if (typeof window === "undefined") return;
  try {
    const list = getRecent().filter(
      (e) => !(e.id === entry.id && e.variantId === entry.variantId)
    );

    list.unshift(entry);

    const toStore: RawEntry[] = list.slice(0, MAX).map((e) => {
      const iso =
        e.date instanceof Date
          ? e.date.toISOString()
          : new Date().toISOString();

      return {
        id: e.id,
        slug: e.slug,
        name: e.name,
        image: e.image,
        variantId: e.variantId,
        date: iso,
      };
    });

    window.localStorage.setItem(KEY, JSON.stringify(toStore));
  } catch (err) {
    console.error("recentlyViewed: pushRecent failed", err);
  }
}
