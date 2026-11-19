import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  ASSESSMENT_MAX_ATTEMPTS,
  CANDIDATE_ASSESSMENT_ROUTES,
} from '../../constants';
import type { AssessmentDetails } from '../../types/assessment-api.types';
import AssessmentCard from '../AssessmentCard';
import AssessmentFactCard from '../AssessmentFactCard';
import AssessmentRules from './AssessmentRules';

type AssessmentIntroProps = {
  assessment: AssessmentDetails;
  onStart: () => void;
  isPending: boolean;
};

// Title, scope, rules and limits before the candidate starts.
export default function AssessmentIntro({
  assessment,
  onStart,
  isPending,
}: AssessmentIntroProps) {
  const t = useTranslations('candidatePage.assessment.intro');
  const api = useTranslations('candidatePage.assessment.api');
  const questionCount = assessment.progress?.total ?? 0;

  return (
    <AssessmentCard className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-border pb-4">
        <h1 className="text-2xl leading-9 font-bold text-foreground sm:text-[28px]">
          <bdi>{assessment.assessment.name}</bdi>
        </h1>
        <p className="text-base text-muted-foreground">
          {t('sent-by')}{' '}
          <span className="font-medium text-assessment-primary">
            {api('hiring-team')}
          </span>
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t('scope')}</h2>
        <p className="text-base leading-5 text-muted-foreground">
          <bdi>{assessment.assessment.description}</bdi>
        </p>
      </div>

      <AssessmentRules
        questionCount={questionCount}
        passScore={assessment.assessment.passing_score}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AssessmentFactCard
          label={t('time-limit')}
          value={t('minutes', { count: assessment.assessment.time_limit })}
        />
        <AssessmentFactCard
          label={t('total-questions')}
          value={t('questions', { count: questionCount })}
        />
        <AssessmentFactCard
          label={t('max-attempts')}
          value={t('attempts', { count: ASSESSMENT_MAX_ATTEMPTS })}
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
          disabled={isPending || !assessment.can_start}
          aria-busy={isPending}
          className="gap-3 bg-assessment-primary hover:bg-assessment-primary/90"
        >
          {isPending
            ? api('saving')
            : assessment.status === 'in_progress'
              ? api('resume')
              : t('start')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </AssessmentCard>
  );
}
