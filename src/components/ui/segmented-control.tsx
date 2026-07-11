import { Check, ListFilter } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SegmentedControlProps<V extends string> {
  options: readonly { value: V; label: string }[];
  /** `null` renders no selection — used when something else overrides the preset. */
  value: V | null;
  onChange: (value: V) => void;
  /** Names the group for screen readers, e.g. "Category". */
  label: string;
  /** Dims the whole group without disabling it. */
  dimmed?: boolean;
  className?: string;
}

/**
 * Pill segmented control, with a bottom drawer as its small-screen form.
 *
 * The options don't fit on one row below `md`, and a wrapped `rounded-full`
 * container reads as a lozenge blob with an orphaned option on a second line.
 * So below `md` the control collapses to a single icon button that opens a
 * drawer listing the options in a stack. The active option is not lost from
 * view — both browse pages put it in the page heading ("Popular Movies").
 */
export function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  label,
  dimmed,
  className,
}: SegmentedControlProps<V>) {
  const activeLabel = options.find((o) => o.value === value)?.label;

  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="glass"
            size="icon"
            aria-label={
              activeLabel ? `${label}: ${activeLabel}` : `Choose a ${label}`
            }
            className={cn('rounded-full', dimmed && 'opacity-60', className)}
          >
            <ListFilter className="size-4.5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0">
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
            <SheetDescription className="sr-only">
              Choose a {label.toLowerCase()} to browse.
            </SheetDescription>
          </SheetHeader>

          {/* Pad past the home indicator on phones that have one. */}
          <div className="flex flex-col gap-1 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <SheetClose asChild key={option.value}>
                  <button
                    type="button"
                    onClick={() => onChange(option.value)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground shadow-[0_0_18px_-6px_var(--primary)]'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {option.label}
                    {active && <Check className="size-4" />}
                  </button>
                </SheetClose>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <div
        role="group"
        aria-label={label}
        className={cn(
          'glass hidden gap-1 rounded-full border border-white/10 p-1 transition-opacity md:inline-flex',
          dimmed && 'opacity-60',
          className,
        )}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-[0_0_18px_-6px_var(--primary)]'
                  : 'cursor-pointer text-muted-foreground hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
