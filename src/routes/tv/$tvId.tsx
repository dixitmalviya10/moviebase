import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Globe,
  ExternalLink,
  ImageOff,
  Layers,
  Tv,
} from 'lucide-react';

import { img, mediaPath } from '@/lib/config';
import { formatDate, formatRuntime, formatRating, getYear } from '@/lib/format';
import { tvDetailsQuery, useTvDetails } from '@/hooks/use-tmdb';
import {
  breadcrumbSchema,
  canonical,
  jsonLd,
  seo,
  tvDescription,
  tvSchema,
} from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow } from '@/components/media/poster-row';
import { CastCarousel } from '@/components/media/cast-carousel';
import { Fact, FactGrid, CrewCredit } from '@/components/media/detail-facts';
import {
  DetailErrorState,
  DetailSkeleton,
} from '@/components/media/detail-states';
import { TrailerDialog } from '@/components/media/trailer-dialog';
import { pickTrailer } from '@/lib/video';
import type { EpisodeBrief, Season, TvDetails } from '@/types/tmdb';

export const Route = createFileRoute('/tv/$tvId')({
  /** See the movie detail route — same loader-feeds-head arrangement. */
  loader: ({ context, params }) => {
    const id = Number.parseInt(params.tvId, 10);
    if (Number.isNaN(id)) return null;
    return context.queryClient
      .ensureQueryData(tvDetailsQuery(id))
      .catch(() => null);
  },

  /* See the movie detail route — keeps the skeleton up while the loader runs. */
  pendingMs: 0,
  pendingComponent: DetailSkeleton,

  head: ({ loaderData: tv }) => {
    if (!tv) return {};

    const year = getYear(tv.first_air_date);
    const path = mediaPath('tv', tv.id, tv.name);
    const title = `${tv.name}${year ? ` (${year})` : ''} — TV Series | MovieBase`;

    return {
      meta: [
        ...seo({
          title,
          description: tvDescription(tv),
          image:
            img.backdrop(tv.backdrop_path, 'w1280') ??
            img.poster(tv.poster_path, 'w500'),
          path,
          type: 'video.tv_show',
          keywords: [
            tv.name,
            ...(tv.genres?.map((g) => g.name) ?? []),
            'tv show',
            'series',
            'episodes',
            'cast',
          ],
        }),
        jsonLd(tvSchema(tv)),
        jsonLd(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'TV Shows', path: '/tv' },
            { name: tv.name, path },
          ]),
        ),
      ],
      links: canonical(path),
    };
  },

  component: TvDetailPage,
});

function TvDetailPage() {
  const { tvId } = Route.useParams();
  const id = Number.parseInt(tvId, 10);
  const { data, isPending, isError, refetch } = useTvDetails(id);

  if (isPending) return <DetailSkeleton />;
  if (isError || !data) {
    return (
      <DetailErrorState
        title="Couldn't load this show"
        onRetry={() => refetch()}
      />
    );
  }

  return <TvDetail show={data} />;
}

function TvDetail({ show }: { show: TvDetails }) {
  const [trailerOpen, setTrailerOpen] = React.useState(false);

  const backdrop = img.backdrop(show.backdrop_path, 'original');
  const poster = img.poster(show.poster_path, 'w500');
  const year = getYear(show.first_air_date);
  const rating = show.vote_average ?? 0;

  // `episode_run_time` is empty for most shows. Fall back to the latest episode,
  // but only a standard one — finales and specials run long and would misreport
  // the typical episode length.
  const lastEpisode = show.last_episode_to_air;
  const typicalRuntime =
    show.episode_run_time?.[0] ||
    (lastEpisode?.episode_type === 'standard' ? lastEpisode.runtime : null);
  const runtime = formatRuntime(typicalRuntime);

  const trailer = React.useMemo(
    () => pickTrailer(show.videos?.results),
    [show.videos],
  );

  const cast = show.credits?.cast?.slice(0, 20) ?? [];
  const creators = (show.created_by ?? []).map((c) => c.name).slice(0, 3);
  const networks = (show.networks ?? []).map((n) => n.name);
  const recommendations = (show.recommendations?.results ?? []).slice(0, 18);

  // TMDB lists Specials (season 0) first; sort it to the end instead.
  const seasons = React.useMemo(() => {
    const rank = (n: number) => (n === 0 ? Number.MAX_SAFE_INTEGER : n);
    return [...(show.seasons ?? [])].sort(
      (a, b) => rank(a.season_number) - rank(b.season_number),
    );
  }, [show.seasons]);

  const spotlight = show.next_episode_to_air ?? show.last_episode_to_air;

  const seasonCount = show.number_of_seasons ?? 0;
  const episodeCount = show.number_of_episodes ?? 0;
  const imdbId = show.external_ids?.imdb_id;

  return (
    <div className="-mt-16">
      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          {backdrop && (
            <img
              src={backdrop}
              alt=""
              className="size-full object-cover object-top opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="mx-auto max-w-350 px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
          <div className="flex flex-col gap-8 md:flex-row md:gap-10">
            {/* Poster */}
            <div className="mx-auto w-52 shrink-0 sm:w-60 md:mx-0 md:w-72">
              <div className="aspect-2/3 overflow-hidden rounded-2xl border border-white/10 bg-muted shadow-2xl">
                {poster ? (
                  <img
                    src={poster}
                    alt={show.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="size-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {show.name}
                {year && (
                  <span className="ml-2 font-medium text-muted-foreground">
                    ({year})
                  </span>
                )}
              </h1>

              {show.tagline && (
                <p className="mt-2 text-lg italic text-muted-foreground">
                  {show.tagline}
                </p>
              )}

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {rating > 0 && (
                  <span className="flex items-center gap-1.5 font-semibold text-gold-soft">
                    <Star className="size-4 fill-gold text-gold" />
                    {formatRating(rating)}
                    <span className="font-normal text-muted-foreground">
                      ({(show.vote_count ?? 0).toLocaleString()})
                    </span>
                  </span>
                )}
                {seasonCount > 0 && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Layers className="size-4" />
                    {plural(seasonCount, 'season')}
                    {episodeCount > 0 && ` · ${plural(episodeCount, 'episode')}`}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-4" />
                    {runtime} per episode
                  </span>
                )}
                {show.first_air_date && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="size-4" />
                    {formatDate(show.first_air_date)}
                  </span>
                )}
              </div>

              {/* Genres */}
              {show.genres && show.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {show.genres.map((g) => (
                    <Badge key={g.id} variant="gold">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {show.overview && (
                <div className="mt-6">
                  <h2 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-primary/80">
                    Overview
                  </h2>
                  <p className="max-w-3xl leading-relaxed text-foreground/90">
                    {show.overview}
                  </p>
                </div>
              )}

              {/* Creator / network highlights */}
              {(creators.length > 0 || networks.length > 0) && (
                <div className="mt-6 grid max-w-lg grid-cols-2 gap-4">
                  {creators.length > 0 && (
                    <CrewCredit
                      role={creators.length > 1 ? 'Creators' : 'Creator'}
                      names={creators}
                    />
                  )}
                  {networks.length > 0 && (
                    <CrewCredit
                      role={networks.length > 1 ? 'Networks' : 'Network'}
                      names={networks}
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                {trailer && (
                  <Button size="lg" onClick={() => setTrailerOpen(true)}>
                    <Play className="fill-current" />
                    Play Trailer
                  </Button>
                )}
                {show.homepage && (
                  <Button asChild size="lg" variant="glass">
                    <a
                      href={show.homepage}
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
                      href={`https://www.imdb.com/title/${imdbId}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <ExternalLink />
                      IMDb
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="mx-auto max-w-350 space-y-14 px-4 py-12 sm:px-6">
        {/* Facts */}
        <FactGrid>
          <Fact label="Status" value={show.status || '—'} />
          <Fact label="Type" value={show.type || '—'} />
          <Fact label="Network" value={networks[0] || '—'} />
          <Fact
            label="Original Language"
            value={
              show.spoken_languages?.[0]?.english_name ||
              show.original_language?.toUpperCase() ||
              '—'
            }
          />
          <Fact label="First Aired" value={formatDate(show.first_air_date) || '—'} />
          <Fact label="Last Aired" value={formatDate(show.last_air_date) || '—'} />
          <Fact
            label="Seasons"
            value={seasonCount > 0 ? String(seasonCount) : '—'}
          />
          <Fact
            label="Episodes"
            value={episodeCount > 0 ? String(episodeCount) : '—'}
          />
        </FactGrid>

        {/* Episode spotlight */}
        {spotlight && (
          <section>
            <SectionHeader
              eyebrow={show.next_episode_to_air ? 'Coming up' : 'Most recent'}
              title={show.next_episode_to_air ? 'Next episode' : 'Latest episode'}
            />
            <EpisodeCard episode={spotlight} />
          </section>
        )}

        {/* Seasons */}
        {seasons.length > 0 && (
          <section>
            <SectionHeader eyebrow="Browse the run" title="Seasons" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {seasons.map((season) => (
                <SeasonCard key={season.id} season={season} />
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <SectionHeader eyebrow="Series regulars" title="Cast" />
            <CastCarousel cast={cast} />
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <SectionHeader eyebrow="If you liked this" title="Recommendations" />
            <PosterRow items={recommendations} media="tv" />
          </section>
        )}
      </div>

      <TrailerDialog
        open={trailerOpen}
        onOpenChange={setTrailerOpen}
        title={show.name}
        trailer={trailer}
      />
    </div>
  );
}

function plural(count: number, noun: string): string {
  return `${count.toLocaleString()} ${noun}${count === 1 ? '' : 's'}`;
}

function EpisodeCard({ episode }: { episode: EpisodeBrief }) {
  const still = img.still(episode.still_path, 'w780');
  const code = `S${String(episode.season_number).padStart(2, '0')}E${String(
    episode.episode_number,
  ).padStart(2, '0')}`;

  return (
    <div className="glass flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 p-5 sm:flex-row">
      <div className="aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-muted sm:w-80">
        {still ? (
          <img
            loading="lazy"
            src={still}
            alt={episode.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Tv className="size-8" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Badge variant="gold">{code}</Badge>
          <h3 className="truncate text-lg font-semibold">{episode.name}</h3>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {episode.air_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(episode.air_date)}
            </span>
          )}
          {episode.runtime ? (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {formatRuntime(episode.runtime)}
            </span>
          ) : null}
        </div>

        {episode.overview && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-foreground/80">
            {episode.overview}
          </p>
        )}
      </div>
    </div>
  );
}

function SeasonCard({ season }: { season: Season }) {
  const poster = img.poster(season.poster_path, 'w342');
  const year = getYear(season.air_date);

  return (
    <div className="group/season flex gap-4 rounded-2xl border border-white/10 glass p-4 transition-colors hover:border-primary/40">
      <div className="aspect-2/3 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-muted">
        {poster ? (
          <img
            loading="lazy"
            src={poster}
            alt={season.name}
            className="size-full object-cover transition-transform duration-500 group-hover/season:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold leading-tight transition-colors group-hover/season:text-primary">
          {season.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {year && `${year} · `}
          {plural(season.episode_count, 'episode')}
        </p>
        {season.overview && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-foreground/70">
            {season.overview}
          </p>
        )}
      </div>
    </div>
  );
}
