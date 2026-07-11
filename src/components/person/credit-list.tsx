import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { getYear } from '@/lib/format';
import type { PersonCredit } from '@/types/tmdb';

/** The date a credit is filed under — its release, or its first air date. */
function creditDate(credit: PersonCredit): string {
  return credit.release_date || credit.first_air_date || '';
}

/**
 * Newest first, with undated credits (announced or in production) last rather
 * than sorted to the top by an empty string.
 */
function sortCreditsByDate(credits: PersonCredit[]): PersonCredit[] {
  return [...credits].sort((a, b) => {
    const dateA = creditDate(a);
    const dateB = creditDate(b);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.localeCompare(dateA);
  });
}

function CreditRow({ credit }: { credit: PersonCredit }) {
  const title = credit.title || credit.name || 'Untitled';
  const year = getYear(creditDate(credit));
  const role = credit.character || credit.job;
  const episodes =
    credit.media_type === 'tv' && credit.episode_count
      ? `${credit.episode_count} ep${credit.episode_count === 1 ? '' : 's'}`
      : '';

  const inner = (
    <>
      <span className="w-12 shrink-0 tabular-nums text-sm text-muted-foreground">
        {year || '—'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-medium transition-colors group-hover/credit:text-primary">
          {title}
        </span>
        {role && (
          <span className="text-sm text-muted-foreground">
            <span className="mx-1.5 opacity-40">·</span>
            {credit.character ? `as ${role}` : role}
          </span>
        )}
      </span>
      {episodes && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {episodes}
        </span>
      )}
    </>
  );

  const className =
    'group/credit flex items-baseline gap-4 px-5 py-3 transition-colors hover:bg-white/5';

  // Credits carry their own media_type; anything else has nowhere to link to.
  if (credit.media_type === 'movie') {
    return (
      <li>
        <Link
          to="/movie/$movieId"
          params={{ movieId: String(credit.id) }}
          className={className}
        >
          {inner}
        </Link>
      </li>
    );
  }
  if (credit.media_type === 'tv') {
    return (
      <li>
        <Link
          to="/tv/$tvId"
          params={{ tvId: String(credit.id) }}
          className={className}
        >
          {inner}
        </Link>
      </li>
    );
  }
  return <li className={className}>{inner}</li>;
}

/** Chronological filmography — one row per credit, newest first. */
export function CreditList({ credits }: { credits: PersonCredit[] }) {
  const sorted = React.useMemo(() => sortCreditsByDate(credits), [credits]);

  return (
    <ul className="glass divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
      {sorted.map((credit, i) => (
        <CreditRow
          key={credit.credit_id ?? `${credit.media_type}-${credit.id}-${i}`}
          credit={credit}
        />
      ))}
    </ul>
  );
}
