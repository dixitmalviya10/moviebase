import { cn } from '@/lib/utils';
import { MEDIA_GRID } from '@/components/media/media-grid';
import { PersonCard } from '@/components/person/person-card';
import type { PersonItem } from '@/types/tmdb';

export function PersonGrid({
  people,
  className,
}: {
  people: PersonItem[];
  className?: string;
}) {
  return (
    <div className={cn(MEDIA_GRID, className)}>
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}
