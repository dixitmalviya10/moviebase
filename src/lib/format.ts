/** Lightweight formatting helpers (no moment dependency). */

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(date?: string | null): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return dateFmt.format(parsed);
}

export function getYear(date?: string | null): string {
  if (!date) return '';
  return date.slice(0, 4);
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
}

/** Round a TMDB 0–10 vote to one decimal for display. */
export function formatRating(vote?: number | null): string {
  if (!vote || vote <= 0) return 'NR';
  return vote.toFixed(1);
}
