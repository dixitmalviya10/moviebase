/** Shared types + helpers behind the movie/TV discovery filter bars. */

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterCategory<C extends string> {
  value: C;
  label: string;
  title: string;
  eyebrow: string;
}

export interface FilterState<C extends string> {
  category: C;
  genres: number[];
  sort?: string;
}

/** `YYYY-MM-DD`, the shape TMDB's `*_date.gte` / `*_date.lte` params expect. */
export function ymd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function shiftDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
