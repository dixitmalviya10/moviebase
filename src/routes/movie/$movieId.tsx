import { createFileRoute } from '@tanstack/react-router';

import { ComingSoon } from '@/components/coming-soon';

export const Route = createFileRoute('/movie/$movieId')({
  component: () => <ComingSoon title="Movie details" />,
});
