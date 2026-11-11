import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import type {
  ApplyScreeningQuestion,
  ScreeningAnswersFormValues,
} from '../../types/job-apply.types';
import ScreeningQuestionField from './ScreeningQuestionField';

type ScreeningQuestionsStepProps = {
  questions: ApplyScreeningQuestion[];
  control: Control<ScreeningAnswersFormValues>;
};

// Step 1 "Custom Questions": every employer screening question.
export default function ScreeningQuestionsStep({
  questions,
  control,
}: ScreeningQuestionsStepProps) {
  const t = useTranslations('jobDetailsPage.apply.questions');

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        {t('description', { count: questions.length })}
      </p>
      {questions.map((question, index) => (
        <ScreeningQuestionField
          key={question.id}
          question={question}
          index={index}
          control={control}
        />
      ))}
    </div>
  );
}
