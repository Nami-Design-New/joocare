'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AssessmentPausedNotice({
  date,
  candidateCount,
}: {
  date: string;
  /** `#` until the API returns how many candidates completed it. */
  candidateCount: number | string;
}) {
  const t = useTranslations('companyPage.assessments.details');

  return (
    <div className="flex gap-3 rounded-xl border border-warning/50 bg-warning/20 px-4 py-3 text-xs leading-5 text-warning-foreground">
      <Info
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-warning-strong"
      />
      <div>
        <p className="font-semibold text-warning-strong">
          {t('paused-title', { date })}
        </p>
        <p>{t('paused-description', { count: candidateCount })}</p>
      </div>
    </div>
  );
}
