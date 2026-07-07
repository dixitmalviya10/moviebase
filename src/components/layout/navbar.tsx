import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { Clapperboard, ChevronDown, Menu } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

type NavItem = { label: string; category: string };
type NavGroup = { label: string; base: '/movie' | '/tv' | '/person'; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Movies',
    base: '/movie',
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
      <DropdownMenuContent align="start" className="min-w-44">
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
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 sm:px-6">
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

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="glass" size="icon" className="rounded-full">
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              {NAV_GROUPS.flatMap((group) =>
                group.items.map((item) => (
                  <DropdownMenuItem key={`${group.base}-${item.category}`} asChild>
                    <Link to={group.base} search={{ category: item.category }}>
                      <span className="text-muted-foreground">
                        {group.label}
                      </span>
                      <span className="mx-1 opacity-40">/</span>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
