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

/** Whole years lived — measured to the date of death, or to today if living. */
export function calculateAge(
  birthday?: string | null,
  deathday?: string | null,
): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) return null;

  let age = end.getFullYear() - birth.getFullYear();
  const monthsApart = end.getMonth() - birth.getMonth();
  if (monthsApart < 0 || (monthsApart === 0 && end.getDate() < birth.getDate()))
    age--;

  return age >= 0 ? age : null;
}

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Format a USD money amount; falls back to an em dash when unknown. */
export function formatCurrency(amount?: number | null): string {
  if (!amount || amount <= 0) return '—';
  return currencyFmt.format(amount);
}
