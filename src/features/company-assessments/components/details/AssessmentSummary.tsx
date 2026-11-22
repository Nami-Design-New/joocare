'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import type {
  QuestionType,
  SavedAssessment,
} from '../../types/assessment-builder.types';

const QUESTION_TYPES: QuestionType[] = [
  'single-choice',
  'yes-no',
  'multiple-choice',
];

type AssessmentSummaryProps = { assessment: SavedAssessment };

export default function AssessmentSummary({
  assessment,
}: AssessmentSummaryProps) {
  const t = useTranslations('companyPage.assessments.details');
  const typeT = useTranslations('companyPage.assessments.builder');
  const format = useFormatter();
  const { configuration } = assessment;
  const metrics = [
    { label: t('questions'), value: format.number(assessment.questionCount) },
    {
      label: t('score'),
      value: `${format.number(Number(configuration.passScore))}%`,
    },
    {
      label: t('assessment-duration'),
      value: t('minutes', { count: Number(configuration.durationMinutes) }),
    },
    {
      label: t('permitted-attempts'),
      value: format.number(assessment.attemptsCount),
    },
  ];
  const questionTypes = QUESTION_TYPES.filter(
    (type) => assessment.questionTypeCounts[type] > 0,
  );

  return (
    <Card className="min-w-0 gap-3 rounded-2xl border-0 px-3 py-3 shadow-none sm:px-4 sm:py-4 md:px-5">
      <h2 className="border-b border-border pb-2 text-[13px] font-semibold">
        {t('summary')}
      </h2>
      <div>
        <h3 className="text-[13px] font-semibold">{configuration.title}</h3>
        {configuration.description ? (
          <p className="mt-1 text-xs leading-5 whitespace-pre-line text-muted-foreground">
            {configuration.description}
          </p>
        ) : null}
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
      {questionTypes.length ? (
        <div>
          <p className="mb-1.5 text-[10px] text-muted-foreground uppercase">
            {t('allowed-question-types')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {questionTypes.map((type) => (
              <Badge
                key={type}
                className="rounded-full border-0 bg-primary-bg px-2.5 py-1 text-[10px] font-medium text-primary"
              >
                {format.number(assessment.questionTypeCounts[type])}{' '}
                {typeT(type)}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
