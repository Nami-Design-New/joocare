import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { CANDIDATE_ASSESSMENT_ROUTES } from '../../constants';
import type { CandidateAssessment } from '../../types/candidate-assessment.types';
import AssessmentCard from '../AssessmentCard';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentRules from './AssessmentRules';

type AssessmentIntroProps = {
  assessment: CandidateAssessment;
  onStart: () => void;
};

// Title, scope, rules and limits before the candidate starts.
export default function AssessmentIntro({
  assessment,
  onStart,
}: AssessmentIntroProps) {
  const t = useTranslations('candidatePage.assessment.intro');
  const questionCount = assessment.questions.length;

  return (
    <AssessmentCard className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-border pb-4">
        <h1 className="text-2xl leading-9 font-bold text-foreground sm:text-[28px]">
          <bdi>{assessment.title}</bdi>
        </h1>
        <p className="text-base text-muted-foreground">
          {t('sent-by')}{' '}
          <bdi className="font-medium text-assessment-primary">
            {assessment.sentBy}
          </bdi>
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t('scope')}</h2>
        <p className="text-base leading-5 text-muted-foreground">
          <bdi>{assessment.scope}</bdi>
        </p>
      </div>

      <AssessmentRules
        questionCount={questionCount}
        passScore={assessment.passScore}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AssessmentFactCard
          label={t('time-limit')}
          value={t('minutes', { count: assessment.timeLimitMinutes })}
        />
        <AssessmentFactCard
          label={t('total-questions')}
          value={t('questions', { count: questionCount })}
        />
        <AssessmentFactCard
          label={t('max-attempts')}
          value={t('attempts', { count: assessment.maxAttempts })}
        />
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:gap-6">
        <Button
          asChild
          variant="outline"
          size="pill"
          className="h-12.5 border-assessment-primary px-8 text-assessment-primary hover:text-assessment-primary"
        >
          <Link href={CANDIDATE_ASSESSMENT_ROUTES.appliedJobs}>
            {t('later')}
          </Link>
        </Button>
        <Button
          type="button"
          size="pill"
          onClick={onStart}
          className="gap-3 bg-assessment-primary hover:bg-assessment-primary/90"
        >
          {t('start')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </AssessmentCard>
  );
}
