import { Link } from '@tanstack/react-router';
import { User } from 'lucide-react';

import { img } from '@/lib/config';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { CastMember } from '@/types/tmdb';

function CastCard({ person }: { person: CastMember }) {
  const profile = img.profile(person.profile_path, 'w185');
  return (
    <Link
      to="/person/$personId"
      params={{ personId: String(person.id) }}
      className="group/cast block focus:outline-none"
    >
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
        <p className="truncate text-sm font-semibold leading-tight transition-colors group-hover/cast:text-primary">
          {person.name}
        </p>
        {person.character && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {person.character}
          </p>
        )}
      </div>
    </Link>
  );
}

/** Horizontal, draggable carousel of cast headshots. */
export function CastCarousel({ cast }: { cast: CastMember[] }) {
  return (
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
  );
}
