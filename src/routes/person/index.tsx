import { createFileRoute } from '@tanstack/react-router';

import { ComingSoon } from '@/components/coming-soon';

export const Route = createFileRoute('/person/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { category?: string } => ({
    category:
      typeof search.category === 'string' ? search.category : undefined,
  }),
  component: () => <ComingSoon title="People" />,
});
