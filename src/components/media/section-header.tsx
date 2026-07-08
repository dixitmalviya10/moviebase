import type * as React from 'react';

import { cn } from '@/lib/utils';

/** Titled section header with an accent bar and optional trailing controls. */
export function SectionHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-5 flex flex-wrap items-end justify-between gap-4',
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            {eyebrow}
          </p>
        )}
        <h2 className="flex items-center gap-3 font-display text-2xl font-bold sm:text-3xl">
          <span className="h-7 w-1.5 rounded-full bg-linear-to-b from-gold-soft to-primary" />
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
