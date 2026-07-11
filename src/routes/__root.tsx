import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ComingSoon } from '@/components/coming-soon';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  jsonLd,
  seo,
  websiteSchema,
} from '@/lib/seo';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  /**
   * Site-wide head defaults. Child routes emit the same `name`/`property` keys
   * to override these — the router keeps the deepest match's value for each key
   * and drops the rest, so whatever a route doesn't set falls back to here.
   */
  head: () => ({
    meta: [
      ...seo({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        type: 'website',
      }),
      jsonLd(websiteSchema()),
    ],
  }),
  component: RootLayout,
  /*
   * Renders inside RootLayout's <Outlet />, so it must NOT wrap itself in
   * RootShell — doing so nests a second shell and paints two navbars, two
   * footers, and (once HeadContent moved in) two <title> elements.
   */
  notFoundComponent: () => (
    <>
      {/*
        Soft 404 — there is no page here, so keep it out of the index. React
        hoists this into <head>, and it is the only robots tag the app emits,
        so there is no conflicting directive.
      */}
      <meta name="robots" content="noindex, follow" />
      <ComingSoon title="Page not found" />
    </>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeadContent />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function RootLayout() {
  return (
    <RootShell>
      <Outlet />
    </RootShell>
  );
}
