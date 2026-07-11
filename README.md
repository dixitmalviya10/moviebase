# MovieBase

A movie and TV discovery app built on the [TMDB](https://www.themoviedb.org/) API — browse
trending titles, filter by genre, watch trailers, and read cast and crew credits.

**Live:** https://moviebase-psi.vercel.app

## Features

- **Home** — backdrop hero carousel, trending (day/week), latest trailers, and free-to-watch rails.
- **Browse** movies, TV shows and people with genre and sort filters, backed by TMDB Discover.
- **Detail pages** for every movie, show and person: overview, ratings, cast, crew and trailers.
- **Search-as-you-type** in the hero, across movies, TV and people — results jump straight to the
  detail page (there's no separate results route).
- **Infinite scroll** on every browse page, with filters held in the URL so views are shareable.
- **Dark/light theme**, dark by default, with the choice persisted to `localStorage`.
- **Per-route SEO** — Open Graph, Twitter cards, canonical URLs and schema.org JSON-LD.

## Tech stack

| | |
| --- | --- |
| Framework | React 19, TypeScript, Vite |
| Routing | TanStack Router (file-based, typed search params) |
| Data | TanStack Query + axios against the TMDB v3 API |
| UI | Tailwind CSS v4, Radix primitives, lucide-react, Framer Motion, Embla carousel |
| Hosting | Vercel |

## Getting started

Requires Node 20+ and a TMDB account.

```bash
git clone https://github.com/dixitmalviya10/moviebase.git
cd moviebase
npm install
```

Create a `.env` in the project root:

```
VITE_API_TOKEN=<your TMDB API Read Access Token>
VITE_SITE_URL=https://your-domain.com
```

`VITE_API_TOKEN` is the **API Read Access Token** (the long v4 JWT) from your TMDB
[API settings](https://www.themoviedb.org/settings/api) — not the short v3 API key. It is sent as a
bearer token by the axios client in `src/lib/tmdb.ts`. Without it every request comes back `401`.

`VITE_SITE_URL` is the production origin, used to make canonical URLs, `og:url` and the sitemap
absolute. It is optional in development: canonicals fall back to the current origin at runtime
(fine for previews), and the sitemap defaults to `https://moviebase-psi.vercel.app`.

Then:

```bash
npm run dev
```

Both variables must also be set in the Vercel project settings — `.env` is gitignored and never
ships with the repo.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server with HMR (`--host`, so it's reachable on your LAN) |
| `npm run build` | Typecheck (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the project |
| `npm run sitemap` | Regenerate `public/sitemap.xml` (see below) |

## Project structure

```
src/
  routes/          File-based routes. __root.tsx holds the layout and 404.
                   Browse pages are /movie, /tv, /person; details are /movie/$movieId, etc.
  components/
    home/          Hero, trending, latest-trailers and free-to-watch sections
    media/         Poster cards/rows, grids, filters, cast carousel, trailer dialog
    layout/        Navbar and footer
    ui/            Radix-based primitives (button, input, dialog, …)
  hooks/
    use-tmdb.ts    Every TMDB query and infinite query, as React Query hooks
  lib/
    tmdb.ts        axios client + bearer auth
    seo.ts         Head tags, canonical URLs, JSON-LD
    config.ts      TMDB image URL helpers, route path builders
    *-filters.ts   Genre/sort filter state <-> TMDB Discover params
  types/tmdb.ts    TMDB response types
scripts/
  generate-sitemap.mjs
```

## SEO

Per-route document head (title, description, Open Graph, Twitter card, canonical
and schema.org JSON-LD) is defined in each route's `head()` and rendered by
TanStack Router's `<HeadContent />` in `src/routes/__root.tsx`. The shared
helpers live in `src/lib/seo.ts`.

Detail routes (`/movie/$movieId`, `/tv/$tvId`, `/person/$personId`) prefetch
their TMDB data in a `loader` so `head()` has a real title, overview and artwork
to build tags from. The loader and the component share one React Query cache
entry, so this is not an extra request.

Browse pages track the active category (`?category=now_playing`, …) in their title and
description. Genre and sort permutations are the same set of titles in a different order, so they
canonicalise back to the plain category URL rather than competing as separate pages.

### Sitemap

`public/sitemap.xml` is generated — it lists the browse pages plus the most
popular and top-rated movies, shows and people:

```bash
npm run sitemap
```

Re-run it periodically (and before a deploy) to refresh the list. It is
deliberately not part of `npm run build`, so a missing TMDB token or an API
outage can never break a deploy.

### Known limitation: link previews

The app is client-rendered. Googlebot executes JavaScript and sees the per-route
tags above, but social crawlers (Facebook, X, WhatsApp, Slack, LinkedIn) do not
— they only ever see the static fallback tags in `index.html`, so every shared
link renders the same generic preview: the site title, description and the
branded `og:image` card at `public/assets/images/movie-banner.jpg`.

Sharing a *specific* movie or show and getting its own poster and synopsis in the
preview requires server-rendering or prerendering the head; see the notes in
`src/lib/seo.ts`.
