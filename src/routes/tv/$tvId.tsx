import { createFileRoute } from '@tanstack/react-router';

import { ComingSoon } from '@/components/coming-soon';

export const Route = createFileRoute('/tv/$tvId')({
  component: () => <ComingSoon title="TV show details" />,
});
