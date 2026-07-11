import { Link } from '@tanstack/react-router';
import { User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { img } from '@/lib/config';
import type { PersonItem } from '@/types/tmdb';

/**
 * The titles TMDB says this person is best known for, as one line. The trending
 * person feeds return no `known_for` at all, so this is often empty — the
 * department badge carries the card on its own in that case.
 */
function knownForLine(person: PersonItem): string {
  return (person.known_for ?? [])
    .map((k) => k.title || k.name)
    .filter((t): t is string => Boolean(t))
    .slice(0, 3)
    .join(' · ');
}

/** Headshot tile with name and known-for credits; links to the person route. */
export function PersonCard({
  person,
  className,
}: {
  person: PersonItem;
  className?: string;
}) {
  const profile = img.profile(person.profile_path, 'h632');
  const knownFor = knownForLine(person);

  return (
    <Link
      to="/person/$personId"
      params={{ personId: String(person.id) }}
      className={cn('block focus:outline-none', className)}
    >
      <div className="group/card relative">
        <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-muted shadow-md transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:border-primary/40 group-hover/card:shadow-[0_12px_40px_-12px_var(--primary)]">
          {profile ? (
            <img
              loading="lazy"
              src={profile}
              alt={person.name}
              className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <User className="size-8" />
              <span className="px-3 text-center text-xs">{person.name}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

          {person.known_for_department && (
            <div className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-xs font-semibold text-gold-soft backdrop-blur-sm">
              {person.known_for_department}
            </div>
          )}
        </div>

        <div className="mt-2.5 px-0.5">
          <h3 className="truncate text-sm font-semibold leading-tight transition-colors group-hover/card:text-primary">
            {person.name}
          </h3>
          {knownFor && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {knownFor}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
