'use client';

import { useTranslations } from 'next-intl';
import HttpStatusState from '@/shared/components/HttpStatusState';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getHttpStatusCode } from '@/shared/lib/http-error';

type PostJobDataStateProps = {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

export default function PostJobDataState({
  isLoading,
  error,
  onRetry,
}: PostJobDataStateProps) {
  const t = useTranslations('companyPage.postJob');
  if (isLoading) {
    return (
      <section className="layout-content space-y-5 py-8" aria-busy="true">
        <p role="status" className="text-muted-foreground">
          {t('loadingJobData')}
        </p>
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </section>
    );
  }

  return (
    <div>
      <HttpStatusState
        statusCode={getHttpStatusCode(error) ?? 500}
        title={t('load-error-title')}
        description={t('load-error-description')}
        primaryHref="/company/job-management"
        primaryLabel={t('back-to-management')}
      />
      <div className="flex justify-center pb-8">
        <Button type="button" variant="outline" onClick={onRetry}>
          {t('questions.templates-retry')}
        </Button>
      </div>
    </div>
  );
}
