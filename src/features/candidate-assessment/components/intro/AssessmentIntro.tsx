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
      <header className="border-border flex flex-col gap-2 border-b pb-4">
        <h1 className="text-foreground text-2xl leading-9 font-bold sm:text-[28px]">
          <bdi>{assessment.title}</bdi>
        </h1>
        <p className="text-muted-foreground text-base">
          {t('sent-by')}{' '}
          <bdi className="text-assessment-primary font-medium">
            {assessment.sentBy}
          </bdi>
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <h2 className="text-foreground text-lg font-semibold">{t('scope')}</h2>
        <p className="text-muted-foreground text-base leading-5">
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
          className="border-assessment-primary text-assessment-primary hover:text-assessment-primary h-12.5 px-8"
        >
          <Link href={CANDIDATE_ASSESSMENT_ROUTES.appliedJobs}>
            {t('later')}
          </Link>
        </Button>
        <Button
          type="button"
          size="pill"
          onClick={onStart}
          className="bg-assessment-primary hover:bg-assessment-primary/90 gap-3"
        >
          {t('start')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </AssessmentCard>
  );
}
