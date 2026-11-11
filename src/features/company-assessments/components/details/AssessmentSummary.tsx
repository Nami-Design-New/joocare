'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import type {
  Assessment,
  AssessmentDetail,
} from '../../types/assessment.types';

type AssessmentSummaryLabels = Partial<{
  summary: string;
  titleLabel: string;
  score: string;
  questionTypes: string;
}>;

export default function AssessmentSummary({
  assessment,
  detail,
  labels = {},
}: {
  assessment: Assessment;
  detail: AssessmentDetail;
  // Lets the job-linking preview use its own wording.
  labels?: AssessmentSummaryLabels;
}) {
  const t = useTranslations('companyPage.assessments.details');
  const metrics = [
    { label: t('questions'), value: detail.totalQuestions },
    { label: labels.score ?? t('score'), value: `${assessment.passScore}%` },
    {
      label: t('assessment-duration'),
      value: t('minutes', { count: detail.timeLimitMinutes }),
    },
    { label: t('permitted-attempts'), value: detail.maxAttempts },
  ];

  return (
    <Card className="min-w-0 gap-3 rounded-2xl border-0 px-3 py-3 shadow-none sm:px-4 sm:py-4 md:px-5">
      <h2 className="border-b border-border pb-2 text-[13px] font-semibold">
        {labels.summary ?? t('summary')}
      </h2>
      <div>
        {labels.titleLabel ? (
          <p className="text-[10px] text-muted-foreground">
            {labels.titleLabel}
          </p>
        ) : null}
        <h3 className="text-[13px] font-semibold">{detail.summaryTitle}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {detail.summary}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-muted px-3 py-2">
            <dt className="text-[10px] text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-[13px] font-bold text-secondary">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="mb-1.5 text-[10px] text-muted-foreground uppercase">
          {labels.questionTypes ?? t('allowed-question-types')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {detail.allowedQuestionTypes.map((type) => (
            <Badge
              key={type.label}
              className="rounded-full border-0 bg-primary-bg px-2.5 py-1 text-[10px] font-medium text-primary"
            >
              {type.count} {type.label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
