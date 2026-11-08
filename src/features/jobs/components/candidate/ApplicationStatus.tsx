import { useLocale, useTranslations } from 'next-intl';
import type { ApplicationAssessment } from '../../types/candidate-applications.types';
import { formatApplicationDate } from '../../utils/application-format';

type ApplicationStatusProps = {
  appliedAt?: string;
  assessment?: ApplicationAssessment;
};

export default function ApplicationStatus({
  appliedAt,
  // assessment,
}: ApplicationStatusProps) {
  const t = useTranslations('candidatePage.applications');
  const locale = useLocale();
  return (
    <div className="w-full space-y-2">
      {/* {assessment && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            className={cn(
              'rounded-full px-2 py-1 font-medium',
              assessment.status === 'completed'
                ? 'bg-application-primary/8 text-application-primary'
                : assessment.status === 'expired'
                  ? 'bg-destructive/8 text-destructive'
                  : 'bg-warning/10 text-warning-strong',
            )}
          >
            {t(`assessment-${assessment.status}`)}
          </span>
          {assessment.status === 'pending' && assessment.href && (
            <Link
              href={assessment.href}
              className="text-application-primary font-semibold underline"
            >
              {t('take-assessment')}
            </Link>
          )}
        </div>
      )} */}
      <div className="bg-application-primary/8 text-application-primary flex min-h-6 flex-wrap items-center justify-between gap-1 rounded-xl px-2 py-0.75">
        <span className="flex items-center gap-1 text-sm leading-4.5">
          <span
            aria-hidden
            className="bg-application-primary size-2 rounded-full"
          />
          {t('applied')}
        </span>
        {appliedAt && (
          <time
            dateTime={
              Number.isNaN(Date.parse(appliedAt)) ? undefined : appliedAt
            }
            className="text-muted-foreground text-[10px] leading-3.25"
          >
            {formatApplicationDate(appliedAt, locale)}
          </time>
        )}
      </div>
    </div>
  );
}
