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
  remainingSeconds: number;
  selectedOptionIds: string[];
  isLastQuestion: boolean;
  onToggleOption: (optionId: string) => void;
  onNext: () => void;
};

// One question at a time (yes/no, single-select or multi-select) with progress and the countdown.
export default function AssessmentQuestionScreen({
  question,
  questionNumber,
  total,
  progress,
  remainingSeconds,
  selectedOptionIds,
  isLastQuestion,
  onToggleOption,
  onNext,
}: AssessmentQuestionScreenProps) {
  const t = useTranslations('candidatePage.assessment.question');
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
      <AssessmentTimer remainingSeconds={remainingSeconds} />

      <AssessmentCard className="flex flex-col gap-6 lg:p-8">
        <QuestionHeading
          id={headingId}
          badge={t('badge', { number: questionNumber })}
          title={question.text}
          titleClassName="text-lg leading-6"
        />
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
          disabled={!selectedOptionIds.length}
          className="bg-assessment-primary hover:bg-assessment-primary/90 gap-3 self-end"
        >
          {isLastQuestion ? t('submit') : t('next')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </AssessmentCard>
    </div>
  );
}
