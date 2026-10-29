import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { MIN_ASSESSMENT_QUESTIONS } from '../../constants/assessment-builder';

type AssessmentBuilderActionsProps = {
  step: number;
  canReview: boolean;
  pending: boolean;
  success: boolean;
  questionCount: number;
  isEditing?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export default function AssessmentBuilderActions({
  step,
  canReview,
  pending,
  success,
  questionCount,
  isEditing = false,
  onPrevious,
  onNext,
  onSubmit,
}: AssessmentBuilderActionsProps) {
  const t = useTranslations('companyPage.assessments.builder');

  return (
    <>
      <footer
        className={
          step === 0
            ? 'mt-10 flex justify-center'
            : 'mt-10 flex flex-wrap items-center justify-between gap-4'
        }
      >
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            size="pill"
            className="gap-3 px-6 md:min-w-56"
            disabled={pending}
            onClick={onPrevious}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t(step === 1 ? 'back-configuration' : 'previous')}
          </Button>
        )}
        {step === 0 ? (
          <Button type="submit" size="pill" className="min-w-56">
            {t('next')}
          </Button>
        ) : (
          <Button
            type="button"
            size="pill"
            className="disabled:bg-disabled gap-3 px-6 disabled:opacity-100 md:min-w-56"
            disabled={!canReview || pending || success}
            onClick={step === 2 ? onSubmit : onNext}
          >
            {pending && <LoaderCircle className="size-4 animate-spin" />}
            {t(step === 1 ? 'review' : isEditing ? 'save-changes' : 'next')}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        )}
      </footer>
      {step === 1 && questionCount > 0 && !canReview && (
        <p className="text-muted-foreground mt-3 text-end text-sm">
          {t('minimum-questions', { count: MIN_ASSESSMENT_QUESTIONS })}
        </p>
      )}
    </>
  );
}
