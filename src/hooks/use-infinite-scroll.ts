import * as React from 'react';

/**
 * Returns a ref to attach to a sentinel element; invokes `onLoadMore` when it
 * scrolls into view (pre-fetching 600px early) while `enabled` is true.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>(
  onLoadMore: () => void,
  enabled: boolean,
) {
  const ref = React.useRef<T>(null);
  const cb = React.useRef(onLoadMore);

  React.useEffect(() => {
    cb.current = onLoadMore;
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) cb.current();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
