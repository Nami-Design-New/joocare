'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

type AssessmentCandidateSummaryProps = {
  summary: readonly { key: string; count: number; className?: string }[];
};

export default function AssessmentCandidateSummary({
  summary,
}: AssessmentCandidateSummaryProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const format = useFormatter();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {summary.map((stat) => (
        <Card
          key={stat.key}
          className="items-center gap-2 rounded-xl border-0 p-3 text-center shadow-none sm:p-5"
        >
          <p className="text-[13px] leading-normal font-semibold text-muted-foreground uppercase">
            {t(stat.key)}
          </p>
          <p
            className={cn(
              'text-2xl leading-normal font-bold text-assessment-dark sm:text-[28px]',
              stat.className,
            )}
          >
            {format.number(stat.count)}
          </p>
        </Card>
      ))}
    </div>
  );
}
