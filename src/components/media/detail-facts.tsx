import type * as React from 'react';

/** The glass strip of key/value facts near the top of a detail page body. */
export function FactGrid({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-white/10 glass p-6 sm:grid-cols-4">
      {children}
    </section>
  );
}

export function Fact({ label, value }: { label: string; value: string }) {
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

/** A named credit block, e.g. "Director — Denis Villeneuve". */
export function CrewCredit({ role, names }: { role: string; names: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {role}
      </p>
      <p className="mt-0.5 font-medium">{names.join(', ')}</p>
    </div>
  );
}
