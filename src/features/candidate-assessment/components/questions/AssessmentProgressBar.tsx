import { useTranslations } from 'next-intl';

type AssessmentProgressBarProps = {
  questionNumber: number;
  total: number;
  progress: number;
};

// "Question 5 of 37 ───── 14% Complete".
export default function AssessmentProgressBar({
  questionNumber,
  total,
  progress,
}: AssessmentProgressBarProps) {
  const t = useTranslations('candidatePage.assessment.question');

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:flex-nowrap">
      <span className="shrink-0 text-base font-semibold text-foreground">
        {t('counter', { current: questionNumber, total })}
      </span>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={t('progress-label')}
        className="order-last h-2.5 w-full overflow-hidden rounded-full bg-assessment-close sm:order-0 sm:flex-1"
      >
        <div
          className="h-full rounded-full bg-assessment-primary transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="ms-auto shrink-0 text-sm text-muted-foreground sm:ms-0">
        {t('complete', { progress })}
      </span>
    </div>
  );
}
