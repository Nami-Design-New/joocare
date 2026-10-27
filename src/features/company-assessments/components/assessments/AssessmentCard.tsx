'use client';

import { CircleEllipsis, Info, Stethoscope } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAssessmentActions } from '../../hooks/useAssessmentActions';
import type {
  Assessment,
  AssessmentSource,
} from '../../types/assessment.types';
import AssessmentStats from './AssessmentStats';
import AssessmentActions from './AssessmentActions';

type AssessmentCardProps = {
  assessment: Assessment;
  source: AssessmentSource;
  href?: string;
};

export default function AssessmentCard({
  assessment,
  source,
  href,
}: AssessmentCardProps) {
  const t = useTranslations('companyPage.assessments');
  const format = useFormatter();
  const { showComingSoon } = useAssessmentActions();
  const title = assessment.title;
  const pausedDate = assessment.pausedAt
    ? format.dateTime(new Date(assessment.pausedAt), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  return (
    <Card className="gap-4 rounded-[28px] border-none p-4 shadow-none">
      <div className="flex items-start gap-3">
        <span className="bg-primary-bg text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
          <Stethoscope
            aria-hidden="true"
            className="size-6"
            strokeWidth={1.5}
          />
        </span>
        <div className="min-w-0 flex-1 space-y-1 self-center">
          <h2 className="text-secondary text-sm font-semibold">{title}</h2>
          <p className="text-muted-foreground text-xs">
            {source === 'joocare'
              ? t('admin')
              : t('created-on', {
                  date: format.dateTime(new Date(assessment.createdAt), {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  }),
                })}
          </p>
        </div>
        {source === 'company' ? (
          <div className="flex shrink-0 items-center gap-2">
            {assessment.pausedAt ? (
              <Badge className="bg-warning-bg text-warning-foreground rounded-full border-none text-[10px]">
                {t('paused')}
              </Badge>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-7 rounded-full"
              aria-label={t('assessment-actions', { name: title })}
              onClick={showComingSoon}
            >
              <CircleEllipsis aria-hidden="true" className="size-5" />
            </Button>
          </div>
        ) : null}
      </div>
      {pausedDate ? (
        <p className="bg-warning-bg text-warning-foreground flex items-start gap-2 rounded-xl px-3 py-2 text-xs leading-5">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {t('paused-notice', { date: pausedDate })}
        </p>
      ) : (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          {assessment.description}
        </p>
      )}
      <AssessmentStats assessment={assessment} />
      <AssessmentActions
        assessment={assessment}
        source={source}
        previewHref={href}
      />
    </Card>
  );
}
