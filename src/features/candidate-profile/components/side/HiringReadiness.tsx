import { CircleAlert, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

type HiringReadinessProps = {
  score: number;
  missingItems: string[];
};

const FULL_SCORE = 100;

// Hiring readiness bar with the hint for what's still missing.
export default function HiringReadiness({
  score,
  missingItems,
}: HiringReadinessProps) {
  const t = useTranslations('candidatePage.profile');
  const locale = useLocale();
  const hint =
    score === 0
      ? t('hiring-readiness-help')
      : score < FULL_SCORE && missingItems.length
        ? `${t('missing-score-items')}: ${new Intl.ListFormat(locale).format(missingItems)}`
        : null;

  return (
    <section className="flex flex-col gap-2 p-1">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles aria-hidden className="size-4 text-assessment-primary" />
          {t('hiring-readiness')}
        </span>
        <span className="text-sm text-assessment-primary">{score}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FULL_SCORE}
        aria-valuenow={score}
        aria-label={t('hiring-readiness')}
        className="h-1.25 overflow-hidden rounded-xl bg-secondary/8"
      >
        <div
          className="h-full rounded-xl bg-foreground"
          style={{ width: `${Math.min(score, FULL_SCORE)}%` }}
        />
      </div>
      {hint ? (
        <p className="flex items-start gap-2 py-1 text-xs leading-4 text-muted-foreground">
          <CircleAlert
            aria-hidden
            className="size-4 shrink-0 text-assessment-primary"
          />
          {hint}
        </p>
      ) : null}
    </section>
  );
}
