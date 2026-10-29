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
          className="items-center gap-2 rounded-xl border-0 p-5 text-center shadow-none"
        >
          <p className="text-muted-foreground text-[13px] leading-normal font-semibold uppercase">
            {t(stat.key)}
          </p>
          <p
            className={cn(
              'text-assessment-dark text-[28px] leading-normal font-bold',
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
