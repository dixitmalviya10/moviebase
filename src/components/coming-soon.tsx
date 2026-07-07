import { Link } from '@tanstack/react-router';
import { Clapperboard, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

/** Branded placeholder used by routes not yet rebuilt in v2. */
export function ComingSoon({ title = 'Coming soon' }: { title?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 animate-float rounded-full bg-primary/20 blur-3xl" />
        <div className="glass flex size-24 items-center justify-center rounded-3xl border border-white/10">
          <Clapperboard className="size-11 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          This section is being rebuilt for MovieBase v2. Check back shortly —
          it's next in line.
        </p>
      </div>
      <Button asChild variant="glass" className="rounded-full">
        <Link to="/">
          <ArrowLeft /> Back to home
        </Link>
      </Button>
    </div>
  );
}
