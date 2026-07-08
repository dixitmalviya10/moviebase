import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted relative overflow-hidden rounded-md',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-skeleton',
        'before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
