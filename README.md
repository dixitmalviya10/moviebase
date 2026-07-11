# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
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

### Configuration

Set the production origin so canonical URLs, `og:url` and the sitemap are
absolute and correct:

```
VITE_SITE_URL=https://your-domain.com
```

Without it, canonicals fall back to the current origin at runtime (fine for
previews) and the sitemap defaults to `https://moviebase-psi.vercel.app`.

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
link renders the same generic preview. Fixing that properly requires
server-rendering or prerendering the head; see the notes in `src/lib/seo.ts`.
