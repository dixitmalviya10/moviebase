import type * as React from 'react';
import { Link } from '@tanstack/react-router';
import { Clapperboard, Mail } from 'lucide-react';

// Brand marks (lucide 1.x removed brand icons for trademark reasons).
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.38 2.13.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.8-.3 1.47-.72 2.13-1.38.66-.66 1.07-1.33 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.8-.72-1.47-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

const columns: {
  title: string;
  base: '/movie' | '/tv' | '/person';
  links: { label: string; category: string }[];
}[] = [
  {
    title: 'Movies',
    base: '/movie',
    links: [
      { label: 'Popular', category: 'popular' },
      { label: 'Now Playing', category: 'now_playing' },
      { label: 'Upcoming', category: 'upcoming' },
      { label: 'Top Rated', category: 'top_rated' },
    ],
  },
  {
    title: 'TV Shows',
    base: '/tv',
    links: [
      { label: 'Popular', category: 'popular' },
      { label: 'Airing Today', category: 'airing_today' },
      { label: 'On TV', category: 'on_the_air' },
      { label: 'Top Rated', category: 'top_rated' },
    ],
  },
  {
    title: 'People',
    base: '/person',
    links: [{ label: 'Popular People', category: 'popular' }],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-card/40">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto grid max-w-350 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Clapperboard className="size-5" />
            </span>
            <span className="font-display text-lg font-extrabold">
              Movie<span className="text-gradient-gold">Base</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Millions of movies, TV shows and people to discover. Powered by the
            TMDB API.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/dixit-lohar10/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href="https://www.instagram.com/dixitmalviya10/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href="mailto:dixitmalviya10@gmail.com"
              aria-label="Email"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.category}>
                  <Link
                    to={col.base}
                    search={{ category: link.category }}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-350 flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MovieBase. Built by Dixit.</p>
          <p>
            Data provided by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-primary"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
