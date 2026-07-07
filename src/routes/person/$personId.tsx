import { createFileRoute } from '@tanstack/react-router';

import { ComingSoon } from '@/components/coming-soon';

export const Route = createFileRoute('/person/$personId')({
  component: () => <ComingSoon title="Person details" />,
});
