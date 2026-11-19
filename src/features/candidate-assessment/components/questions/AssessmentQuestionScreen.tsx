import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ChoiceOptionCard from '@/shared/components/questions/ChoiceOptionCard';
import QuestionHeading from '@/shared/components/questions/QuestionHeading';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { ASSESSMENT_OPTION_MARKERS } from '../../constants';
import type { CandidateAssessmentQuestion } from '../../types/candidate-assessment.types';
import AssessmentCard from '../AssessmentCard';
import AssessmentProgressBar from './AssessmentProgressBar';
import AssessmentTimer from './AssessmentTimer';

type AssessmentQuestionScreenProps = {
  question: CandidateAssessmentQuestion;
  questionNumber: number;
  total: number;
  progress: number;
  remainingSeconds: number | null;
  timeLimitMinutes?: number;
  selectedOptionIds: string[];
  isLastQuestion: boolean;
  onToggleOption: (optionId: string) => void;
  onNext: () => void;
  isPending?: boolean;
  attachments?: { id: number; file: string }[];
};

// One question at a time (yes/no, single-select or multi-select) with progress and the countdown.
export default function AssessmentQuestionScreen({
  question,
  questionNumber,
  total,
  progress,
  remainingSeconds,
  timeLimitMinutes,
  selectedOptionIds,
  isLastQuestion,
  onToggleOption,
  onNext,
  isPending = false,
  attachments = [],
}: AssessmentQuestionScreenProps) {
  const t = useTranslations('candidatePage.assessment.question');
  const api = useTranslations('candidatePage.assessment.api');
  const headingId = `assessment-question-${question.id}`;
  const isMulti = question.type === 'multi';
  const isYesNo = question.type === 'yes-no';

  return (
    <div className="flex flex-col gap-6">
      <AssessmentProgressBar
        questionNumber={questionNumber}
        total={total}
        progress={progress}
      />
      {remainingSeconds !== null ? (
        <AssessmentTimer remainingSeconds={remainingSeconds} />
      ) : timeLimitMinutes ? (
        <div className="flex justify-center rounded-xl border border-border bg-card p-5">
          <p className="rounded-full bg-muted px-4 py-2 text-center text-base font-semibold text-assessment-primary">
            {api('server-timer', { minutes: timeLimitMinutes })}
          </p>
        </div>
      ) : null}

      <AssessmentCard className="flex flex-col gap-6 lg:p-8">
        <QuestionHeading
          id={headingId}
          badge={t('badge', { number: questionNumber })}
          title={question.text}
          titleClassName="text-lg leading-6"
        />
        {attachments.map((attachment, index) => (
          <a
            key={attachment.id}
            href={attachment.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {api('attachment', { number: index + 1 })}
          </a>
        ))}
        <div
          role="group"
          aria-labelledby={headingId}
          className={cn('grid gap-3', isYesNo && 'sm:grid-cols-2')}
        >
          {question.options.map((option, index) => (
            <ChoiceOptionCard
              key={option.id}
              type={isMulti ? 'checkbox' : 'radio'}
              name={question.id}
              value={option.id}
              checked={selectedOptionIds.includes(option.id)}
              disabled={isPending}
              onChange={() => onToggleOption(option.id)}
              marker={
                isYesNo
                  ? undefined
                  : `${ASSESSMENT_OPTION_MARKERS[index] ?? index + 1}.`
              }
              label={<bdi>{option.text}</bdi>}
            />
          ))}
        </div>
        <Button
          type="button"
          size="pill"
          onClick={onNext}
          disabled={!selectedOptionIds.length || isPending}
          aria-busy={isPending}
          className="gap-3 self-end bg-assessment-primary hover:bg-assessment-primary/90"
        >
          {isPending ? api('saving') : isLastQuestion ? t('submit') : t('next')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </AssessmentCard>
    </div>
  );
}
