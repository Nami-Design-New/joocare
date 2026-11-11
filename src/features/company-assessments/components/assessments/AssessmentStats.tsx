'use client';

import { Clock3, FileQuestion, Target } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import type { Assessment } from '../../types/assessment.types';

export default function AssessmentStats({
  assessment,
}: {
  assessment: Assessment;
}) {
  const t = useTranslations('companyPage.assessments');
  const format = useFormatter();
  const stats = [
    {
      key: 'questions',
      icon: FileQuestion,
      value: format.number(assessment.questionCount),
    },
    {
      key: 'time',
      icon: Clock3,
      value: t('minutes', { count: assessment.durationMinutes }),
    },
    {
      key: 'pass-score',
      icon: Target,
      value: format.number(assessment.passScore / 100, { style: 'percent' }),
    },
  ];
  return (
    <dl className="mt-auto grid grid-cols-3 gap-2">
      {stats.map(({ key, icon: Icon, value }) => (
        <div key={key} className="rounded-[20px] bg-muted px-3 py-2.5">
          <dt className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Icon aria-hidden="true" className="size-3.5 shrink-0" />
            {t(key)}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
