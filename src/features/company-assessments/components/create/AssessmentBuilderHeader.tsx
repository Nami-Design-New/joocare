import { useTranslations } from 'next-intl';

type AssessmentBuilderHeaderProps = {
  step: number;
  totalScore: number;
  questionCount: number;
  isEditing?: boolean;
};

export default function AssessmentBuilderHeader({
  step,
  totalScore,
  questionCount,
  isEditing = false,
}: AssessmentBuilderHeaderProps) {
  const t = useTranslations('companyPage.assessments.builder');

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-secondary text-2xl font-bold md:text-[28px]">
          {t(step === 2 ? 'review-title' : isEditing ? 'edit-title' : 'title')}
        </h1>
        {step !== 1 && (
          <p className="text-muted-foreground mt-2 text-sm">
            {t(step === 2 ? 'review-description' : 'configuration-description')}
          </p>
        )}
      </div>
      {step === 1 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-muted rounded-full px-3 py-2">
            {t('total-score')}{' '}
            <span
              className={
                totalScore === 100 ? 'text-primary' : 'text-destructive'
              }
            >
              {Number(totalScore.toFixed(2))}%
            </span>
          </span>
          <span className="bg-muted rounded-full px-3 py-2">
            {t('questions-count', { count: questionCount })}
          </span>
        </div>
      )}
    </header>
  );
}
