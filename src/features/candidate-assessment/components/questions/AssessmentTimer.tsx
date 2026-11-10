import { Clock3, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { ASSESSMENT_TIMER_WARNING_SECONDS } from '../../constants';
import { formatCountdown } from '../../utils/assessment-format';

type AssessmentTimerProps = {
  remainingSeconds: number;
};

// "70:12:05 remaining" pill; the last minutes switch to a warning (icon + text, not color only).
export default function AssessmentTimer({
  remainingSeconds,
}: AssessmentTimerProps) {
  const t = useTranslations('candidatePage.assessment.question');
  const isWarning = remainingSeconds <= ASSESSMENT_TIMER_WARNING_SECONDS;
  const Icon = isWarning ? TriangleAlert : Clock3;

  return (
    <div className="bg-card border-border flex justify-center rounded-xl border p-5">
      <p
        role="timer"
        aria-live={isWarning ? 'polite' : 'off'}
        className={cn(
          'flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold tabular-nums',
          isWarning
            ? 'bg-warning-bg text-warning-strong'
            : 'bg-muted text-assessment-primary',
        )}
      >
        <Icon aria-hidden className="size-4" strokeWidth={2} />
        <span dir="ltr">{formatCountdown(remainingSeconds)}</span>
        {isWarning ? t('time-running-out') : t('remaining')}
      </p>
    </div>
  );
}
