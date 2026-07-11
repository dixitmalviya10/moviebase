import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useRouterState } from '@tanstack/react-router';

/**
 * Vercel Web Analytics, wired to TanStack Router.
 *
 * Passing `route` switches off the script's own history-based tracking and lets
 * us report each pageview explicitly instead. That matters here: left to auto-
 * track, every movie would land in the dashboard as its own entry
 * (`/movie/27205-inception`, `/movie/157336-interstellar`, …) and the report
 * would be an unreadable list of a thousand one-view URLs.
 *
 * Reporting the matched route pattern (`/movie/$movieId`) as `route` and the
 * real URL as `path` gives Vercel both: traffic grouped per page type, with the
 * concrete URLs still available underneath.
 *
 * Both values are read only while the router is idle. Mid-navigation the store
 * briefly holds the new location against the old matches; reporting from that
 * snapshot would attribute a pageview to the wrong route and double-count it.
 * `null` during the transition is safe — the underlying component skips the
 * pageview until it has both values.
 */
export function Analytics() {
  const route = useRouterState({
    select: (state) =>
      state.status === 'idle'
        ? (state.matches.at(-1)?.fullPath ?? state.location.pathname)
        : null,
  });

  const path = useRouterState({
    select: (state) => (state.status === 'idle' ? state.location.pathname : null),
  });

  return <VercelAnalytics route={route} path={path} />;
}
