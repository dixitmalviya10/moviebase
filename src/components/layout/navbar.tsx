import * as React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Clapperboard,
  ChevronDown,
  Menu,
  Film,
  Tv,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';

type NavItem = { label: string; category: string };
type NavGroup = {
  label: string;
  base: '/movie' | '/tv' | '/person';
  icon: LucideIcon;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Movies',
    base: '/movie',
    icon: Film,
    items: [
      { label: 'Popular', category: 'popular' },
      { label: 'Now Playing', category: 'now_playing' },
      { label: 'Upcoming', category: 'upcoming' },
      { label: 'Top Rated', category: 'top_rated' },
    ],
  },
  {
    label: 'TV Shows',
    base: '/tv',
    icon: Tv,
    items: [
      { label: 'Popular', category: 'popular' },
      { label: 'Airing Today', category: 'airing_today' },
      { label: 'On TV', category: 'on_the_air' },
      { label: 'Top Rated', category: 'top_rated' },
    ],
  },
  {
    label: 'People',
    base: '/person',
    icon: Users,
    items: [{ label: 'Popular People', category: 'popular' }],
  },
];

function NavDropdown({ group }: { group: NavGroup }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm font-medium text-foreground/80 data-[state=open]:text-primary"
        >
          {group.label}
          <ChevronDown className="size-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44 z-99">
        {group.items.map((item) => (
          <DropdownMenuItem key={item.category} asChild>
            <Link to={group.base} search={{ category: item.category }}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Nav on small screens. The links are grouped by section rather than flattened
 * into one list — nine sibling entries reading "Movies / Popular", "TV Shows /
 * Popular", … forces the reader to parse a breadcrumb on every row to work out
 * where they'd land.
 */
function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="glass" size="icon" className="rounded-full">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="gap-0 p-0">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse movies, TV shows and people.
          </SheetDescription>

          <SheetClose asChild>
            <Link to="/" className="flex w-fit items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--primary)]">
                <Clapperboard className="size-4.5" />
              </span>
              <span className="font-display text-base font-extrabold tracking-tight">
                Movie<span className="text-gradient-gold">Base</span>
              </span>
            </Link>
          </SheetClose>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="flex items-center gap-2 px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <group.icon className="size-3.5" />
                {group.label}
              </p>

              <ul>
                {group.items.map((item) => (
                  <li key={item.category}>
                    <SheetClose asChild>
                      <Link
                        to={group.base}
                        search={{ category: item.category }}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                        activeProps={{
                          className:
                            'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
                        }}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 12);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-60 w-full transition-all duration-300',
        scrolled
          ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-350 items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="group mr-2 flex items-center gap-2">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--primary)] transition-transform group-hover:scale-105">
            <Clapperboard className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Movie<span className="text-gradient-gold">Base</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_GROUPS.map((group) => (
            <NavDropdown key={group.label} group={group} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
