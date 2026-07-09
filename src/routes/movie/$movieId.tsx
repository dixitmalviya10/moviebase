import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Star,
  Clock,
  Calendar,
  Play,
  Globe,
  ExternalLink,
  ImageOff,
  User,
  VideoOff,
  ArrowLeft,
} from 'lucide-react';

import { img } from '@/lib/config';
import {
  formatDate,
  formatRuntime,
  formatRating,
  formatCurrency,
  getYear,
} from '@/lib/format';
import { useMovieDetails } from '@/hooks/use-tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SectionHeader } from '@/components/media/section-header';
import { PosterRow } from '@/components/media/poster-row';
import type { CastMember, CrewMember, MovieDetails } from '@/types/tmdb';

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { movieId } = Route.useParams();
  const id = Number.parseInt(movieId, 10);
  const { data, isPending, isError, refetch } = useMovieDetails(id);

  if (isPending) return <DetailSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return <MovieDetail movie={data} />;
}

function MovieDetail({ movie }: { movie: MovieDetails }) {
  const [trailerOpen, setTrailerOpen] = React.useState(false);

  const backdrop = img.backdrop(movie.backdrop_path, 'original');
  const poster = img.poster(movie.poster_path, 'w500');
  const year = getYear(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const rating = movie.vote_average ?? 0;

  const trailer = React.useMemo(() => {
    const list = movie.videos?.results ?? [];
    return (
      list.find(
        (v) =>
          v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
      ) ?? list.find((v) => v.site === 'YouTube')
    );
  }, [movie.videos]);

  const cast = movie.credits?.cast?.slice(0, 20) ?? [];
  const directors = pickCrew(movie.credits?.crew, 'Director');
  const writers = pickCrew(
    movie.credits?.crew,
    'Screenplay',
    'Writer',
    'Story',
  );
  const recommendations = (movie.recommendations?.results ?? []).slice(0, 18);

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
                    alt={movie.title}
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
                {movie.title}
                {year && (
                  <span className="ml-2 font-medium text-muted-foreground">
                    ({year})
                  </span>
                )}
              </h1>

              {movie.tagline && (
                <p className="mt-2 text-lg italic text-muted-foreground">
                  {movie.tagline}
                </p>
              )}

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {rating > 0 && (
                  <span className="flex items-center gap-1.5 font-semibold text-gold-soft">
                    <Star className="size-4 fill-gold text-gold" />
                    {formatRating(rating)}
                    <span className="font-normal text-muted-foreground">
                      ({(movie.vote_count ?? 0).toLocaleString()})
                    </span>
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-4" />
                    {runtime}
                  </span>
                )}
                {movie.release_date && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="size-4" />
                    {formatDate(movie.release_date)}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <Badge key={g.id} variant="gold">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mt-6">
                  <h2 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-primary/80">
                    Overview
                  </h2>
                  <p className="max-w-3xl leading-relaxed text-foreground/90">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Crew highlights */}
              {(directors.length > 0 || writers.length > 0) && (
                <div className="mt-6 grid max-w-lg grid-cols-2 gap-4">
                  {directors.length > 0 && (
                    <CrewCredit
                      role={directors.length > 1 ? 'Directors' : 'Director'}
                      names={directors}
                    />
                  )}
                  {writers.length > 0 && (
                    <CrewCredit
                      role={writers.length > 1 ? 'Writers' : 'Writer'}
                      names={writers}
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
                {movie.homepage && (
                  <Button asChild size="lg" variant="glass">
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Globe />
                      Website
                    </a>
                  </Button>
                )}
                {movie.imdb_id && (
                  <Button asChild size="lg" variant="glass">
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
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
        <section className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-white/10 glass p-6 sm:grid-cols-4">
          <Fact label="Status" value={movie.status || '—'} />
          <Fact
            label="Original Language"
            value={
              movie.spoken_languages?.[0]?.english_name ||
              movie.original_language?.toUpperCase() ||
              '—'
            }
          />
          <Fact label="Budget" value={formatCurrency(movie.budget)} />
          <Fact label="Revenue" value={formatCurrency(movie.revenue)} />
        </section>

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <SectionHeader eyebrow="Top billed" title="Cast" />
            <Carousel
              opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
              className="group/row"
            >
              <CarouselContent className="-ml-4">
                {cast.map((person) => (
                  <CarouselItem
                    key={person.id}
                    className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                  >
                    <CastCard person={person} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0!" />
              <CarouselNext className="right-1 opacity-0 transition-opacity group-hover/row:opacity-100 disabled:opacity-0!" />
            </Carousel>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <SectionHeader eyebrow="If you liked this" title="Recommendations" />
            <PosterRow items={recommendations} media="movie" />
          </section>
        )}
      </div>

      {/* Trailer dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="max-w-3xl border-white/10 p-0 sm:max-w-4xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="pr-8">{movie.title} — Trailer</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              {trailer ? (
                <iframe
                  className="size-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title={movie.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <VideoOff className="size-8" />
                  <p className="text-sm">No trailer available</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function pickCrew(
  crew: CrewMember[] | undefined,
  ...jobs: string[]
): string[] {
  if (!crew) return [];
  const names = crew
    .filter((c) => c.job && jobs.includes(c.job))
    .map((c) => c.name);
  return [...new Set(names)].slice(0, 3);
}

function CrewCredit({ role, names }: { role: string; names: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {role}
      </p>
      <p className="mt-0.5 font-medium">{names.join(', ')}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate font-medium" title={value}>
        {value}
      </p>
    </div>
  );
}

function CastCard({ person }: { person: CastMember }) {
  const profile = img.profile(person.profile_path, 'w185');
  return (
    <div className="group/cast">
      <div className="aspect-2/3 overflow-hidden rounded-xl border border-white/10 bg-muted shadow-md transition-all duration-300 group-hover/cast:border-primary/40">
        {profile ? (
          <img
            loading="lazy"
            src={profile}
            alt={person.name}
            className="size-full object-cover transition-transform duration-500 group-hover/cast:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <User className="size-8" />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate text-sm font-semibold leading-tight">
          {person.name}
        </p>
        {person.character && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {person.character}
          </p>
        )}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="-mt-16">
      <div className="mx-auto max-w-350 px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <Skeleton className="mx-auto aspect-2/3 w-52 rounded-2xl sm:w-60 md:mx-0 md:w-72" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/5" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-24 w-full max-w-3xl" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="glass flex size-16 items-center justify-center rounded-2xl border border-white/10">
        <VideoOff className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Couldn't load this movie</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          It may not exist, or something went wrong reaching TMDB.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
        <Button asChild variant="glass">
          <Link to="/">
            <ArrowLeft /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
