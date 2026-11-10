'use client';

import RouteErrorFallback from '@/shared/components/RouteErrorFallback';

export default function CompanyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback error={error} reset={reset} />;
}
