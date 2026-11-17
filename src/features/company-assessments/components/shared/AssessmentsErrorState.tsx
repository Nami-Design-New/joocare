'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type AssessmentsErrorStateProps = {
  onRetry: () => void;
  className?: string;
};

export default function AssessmentsErrorState({
  onRetry,
  className,
}: AssessmentsErrorStateProps) {
  const t = useTranslations('companyPage.assessments');
  return (
    <div
      role="alert"
      className={cn(
        'col-span-full flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center',
        className,
      )}
    >
      <h3 className="text-base font-semibold text-secondary">
        {t('error-title')}
      </h3>
      <p className="text-sm text-muted-foreground">{t('error-description')}</p>
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 rounded-full px-5"
        onClick={onRetry}
      >
        <RefreshCw aria-hidden="true" className="size-4" />
        {t('retry')}
      </Button>
    </div>
  );
}
