'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AssessmentPausedNotice({
  date,
  candidateCount,
}: {
  date: string;
  candidateCount: number;
}) {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <div className="border-warning/30 bg-warning-bg text-warning-foreground flex gap-3 rounded-xl border px-4 py-3 text-xs leading-5">
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="font-semibold">{t('paused-title', { date })}</p>
        <p>{t('paused-description', { count: candidateCount })}</p>
      </div>
    </div>
  );
}
