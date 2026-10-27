'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('companyPage.assessments');
  return (
    <section
      role="alert"
      className="bg-card flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center"
    >
      <h1 className="text-secondary text-2xl font-semibold">
        {t('error-title')}
      </h1>
      <p className="text-muted-foreground">{t('error-description')}</p>
      <Button className="rounded-full px-6" onClick={reset}>
        {t('retry')}
      </Button>
    </section>
  );
}
