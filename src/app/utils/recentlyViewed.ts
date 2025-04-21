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

    const parsed: RecentEntry[] = raw
      .map((e) => ({ ...e, date: new Date(e.date) }))
      .filter((e) => e.date.getTime() > cutoff);

    return parsed;
  } catch (e) {
    console.error("recentlyViewed: getRecent failed", e);
    return [];
  }
}

export function pushRecent(entry: RecentEntry): void {
  if (typeof window === "undefined") return;

  try {
    const list = getRecent().filter((e) => e.id !== entry.id);

    list.unshift(entry);

    const toStore: RawEntry[] = list.slice(0, MAX).map((e) => ({
      ...e,
      date:
        e.date instanceof Date
          ? e.date.toISOString()
          : new Date().toISOString(),
    }));

    window.localStorage.setItem(KEY, JSON.stringify(toStore));
  } catch (e) {
    console.error("recentlyViewed: pushRecent failed", e);
  }
}
