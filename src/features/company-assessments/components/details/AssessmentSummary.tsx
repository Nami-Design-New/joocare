'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import type {
  Assessment,
  AssessmentDetail,
} from '../../types/assessment.types';

export default function AssessmentSummary({
  assessment,
  detail,
}: {
  assessment: Assessment;
  detail: AssessmentDetail;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const metrics = [
    { label: t('total-questions'), value: detail.totalQuestions },
    { label: t('passing-score'), value: `${assessment.passScore}%` },
    {
      label: t('time-limit'),
      value: t('minutes', { count: detail.timeLimitMinutes }),
    },
    { label: t('maximum-attempts'), value: detail.maxAttempts },
  ];

  return (
    <Card className="gap-3 rounded-2xl border-0 px-4 py-4 shadow-none md:px-5">
      <h2 className="border-border border-b pb-2 text-xs font-semibold">
        {t('summary')}
      </h2>
      <div>
        <h3 className="text-xs font-semibold">{detail.summaryTitle}</h3>
        <p className="text-muted-foreground mt-1 text-[11px] leading-4">
          {detail.summary}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div key={label} className="bg-muted rounded-lg px-3 py-2">
            <dt className="text-muted-foreground text-[9px] uppercase">
              {label}
            </dt>
            <dd className="text-secondary mt-0.5 text-xs font-bold">{value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="text-muted-foreground mb-1.5 text-[9px] uppercase">
          {t('allowed-question-types')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {detail.allowedQuestionTypes.map((type) => (
            <Badge
              key={type.label}
              className="bg-success-bg text-success rounded-full border-0 px-2 py-0.5 text-[9px]"
            >
              {type.count} {type.label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
