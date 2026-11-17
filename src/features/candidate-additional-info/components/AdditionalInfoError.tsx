'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';

type AdditionalInfoErrorProps = {
  onRetry: () => void;
};

// Shown when the saved profile details can't be loaded.
export default function AdditionalInfoError({
  onRetry,
}: AdditionalInfoErrorProps) {
  const t = useTranslations('candidatePage');

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl bg-card px-6 py-5"
    >
      <p className="text-sm text-destructive">
        {t('additional-info.load-error')}
      </p>
      <Button type="button" variant="outline" onClick={onRetry}>
        {t('common.try-again')}
      </Button>
    </div>
  );
}
