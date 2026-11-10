'use client';

import { useTranslations } from 'next-intl';
import RouteErrorFallback from '@/shared/components/RouteErrorFallback';

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('candidatePage.applications');
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      title={t('error-title')}
      description={t('error-description')}
      retryLabel={t('retry')}
    />
  );
}
