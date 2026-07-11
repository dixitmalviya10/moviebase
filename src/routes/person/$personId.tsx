import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Cake, MapPin, Globe, ExternalLink, User } from 'lucide-react';

import { img } from '@/lib/config';
import { calculateAge, formatDate } from '@/lib/format';
import { usePersonDetails } from '@/hooks/use-tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow } from '@/components/media/poster-row';
import { Fact, FactGrid } from '@/components/media/detail-facts';
import {
  DetailErrorState,
  DetailSkeleton,
} from '@/components/media/detail-states';
import { CreditList } from '@/components/person/credit-list';
import { SocialLinks } from '@/components/person/social-links';
import type { PersonCredit, PersonDetails } from '@/types/tmdb';

export const Route = createFileRoute('/person/$personId')({
  component: PersonDetailPage,
});

function PersonDetailPage() {
  const { personId } = Route.useParams();
  const id = Number.parseInt(personId, 10);
  const { data, isPending, isError, refetch } = usePersonDetails(id);

  if (isPending) return <DetailSkeleton />;
  if (isError || !data) {
    return (
      <DetailErrorState
        title="Couldn't load this person"
        onRetry={() => refetch()}
      />
    );
  }

  return <PersonDetail person={data} />;
}

const GENDERS: Record<number, string> = {
  1: 'Female',
  2: 'Male',
  3: 'Non-binary',
};

/** Bios shorter than this fit comfortably, so they skip the expand toggle. */
const BIO_CLAMP_THRESHOLD = 600;

function PersonDetail({ person }: { person: PersonDetails }) {
  const [bioExpanded, setBioExpanded] = React.useState(false);

  const profile = img.profile(person.profile_path, 'h632');
  const age = calculateAge(person.birthday, person.deathday);

  const credits = person.combined_credits;
  const cast = React.useMemo(() => credits?.cast ?? [], [credits]);
  const crew = React.useMemo(() => credits?.crew ?? [], [credits]);

  // Best-known work: most popular credits, most of which the person is only
  // briefly in — so rank by the title's popularity, not by billing order.
  const knownFor = React.useMemo(() => {
    const seen = new Set<string>();
    return [...cast, ...crew]
      .filter((c) => {
        const key = `${c.media_type}-${c.id}`;
        if (!c.poster_path || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 14);
  }, [cast, crew]);

  // A person's biggest credit stands in for the backdrop they don't have.
  const backdrop = img.backdrop(
    knownFor.find((c) => c.backdrop_path)?.backdrop_path,
    'original',
  );

  const imdbId = person.imdb_id ?? person.external_ids?.imdb_id;
  const bio = person.biography?.trim();
  const clampBio = Boolean(bio && bio.length > BIO_CLAMP_THRESHOLD);

  return (
    <div className="-mt-16">
      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          {backdrop && (
            <img
              src={backdrop}
              alt=""
              className="size-full object-cover object-top opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="mx-auto max-w-350 px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
          <div className="flex flex-col gap-8 md:flex-row md:gap-10">
            {/* Headshot */}
            <div className="mx-auto w-52 shrink-0 sm:w-60 md:mx-0 md:w-72">
              <div className="aspect-2/3 overflow-hidden rounded-2xl border border-white/10 bg-muted shadow-2xl">
                {profile ? (
                  <img
                    src={profile}
                    alt={person.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <User className="size-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {person.name}
              </h1>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {person.birthday && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Cake className="size-4" />
                    {formatDate(person.birthday)}
                    {age != null && (
                      <span>
                        {person.deathday
                          ? `(died aged ${age})`
                          : `(age ${age})`}
                      </span>
                    )}
                  </span>
                )}
                {person.place_of_birth && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-4" />
                    {person.place_of_birth}
                  </span>
                )}
              </div>

              {person.known_for_department && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="gold">{person.known_for_department}</Badge>
                </div>
              )}

              {/* Biography */}
              <div className="mt-6">
                <h2 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-primary/80">
                  Biography
                </h2>
                {bio ? (
                  <>
                    <p
                      className={`max-w-3xl whitespace-pre-line leading-relaxed text-foreground/90 ${
                        clampBio && !bioExpanded ? 'line-clamp-6' : ''
                      }`}
                    >
                      {bio}
                    </p>
                    {clampBio && (
                      <button
                        onClick={() => setBioExpanded((open) => !open)}
                        className="mt-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80 cursor-pointer"
                      >
                        {bioExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    We don't have a biography for {person.name} yet.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                {person.homepage && (
                  <Button asChild size="lg" variant="glass">
                    <a
                      href={person.homepage}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Globe />
                      Website
                    </a>
                  </Button>
                )}
                {imdbId && (
                  <Button asChild size="lg" variant="glass">
                    <a
                      href={`https://www.imdb.com/name/${imdbId}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <ExternalLink />
                      IMDb
                    </a>
                  </Button>
                )}
                <SocialLinks externalIds={person.external_ids} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="mx-auto max-w-350 space-y-14 px-4 py-12 sm:px-6">
        {/* Facts */}
        <FactGrid>
          <Fact label="Known For" value={person.known_for_department || '—'} />
          <Fact
            label="Known Credits"
            value={String(cast.length + crew.length)}
          />
          <Fact
            label="Gender"
            value={GENDERS[person.gender ?? 0] ?? 'Not specified'}
          />
          <Fact
            label={person.deathday ? 'Born' : 'Birthday'}
            value={formatDate(person.birthday) || '—'}
          />
          {person.deathday && (
            <Fact label="Died" value={formatDate(person.deathday) || '—'} />
          )}
          <Fact label="Place of Birth" value={person.place_of_birth || '—'} />
        </FactGrid>

        {/* Known for */}
        {knownFor.length > 0 && (
          <section>
            <SectionHeader eyebrow="Best known for" title="Known For" />
            <PosterRow items={knownFor} />
          </section>
        )}

        {/* Filmography */}
        {(cast.length > 0 || crew.length > 0) && (
          <section>
            <SectionHeader eyebrow="Every credit" title="Filmography" />
            <Filmography acting={cast} crew={crew} />
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Acting and crew credits, tabbed when the person has both — which is common,
 * since actors pick up producer credits and directors take cameos.
 */
function Filmography({
  acting,
  crew,
}: {
  acting: PersonCredit[];
  crew: PersonCredit[];
}) {
  if (acting.length === 0) return <CreditList credits={crew} />;
  if (crew.length === 0) return <CreditList credits={acting} />;

  return (
    <Tabs defaultValue={acting.length >= crew.length ? 'acting' : 'crew'}>
      <TabsList>
        <TabsTrigger value="acting">Acting ({acting.length})</TabsTrigger>
        <TabsTrigger value="crew">Crew ({crew.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="acting">
        <CreditList credits={acting} />
      </TabsContent>
      <TabsContent value="crew">
        <CreditList credits={crew} />
      </TabsContent>
    </Tabs>
  );
}
