'use client';

import { Files, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { MIN_ASSESSMENT_QUESTIONS } from '../../constants/assessment-builder';
import type { BuilderQuestion } from '../../types/assessment-builder.types';
import AssessmentQuestionCard from './AssessmentQuestionCard';

type AssessmentQuestionsStepProps = {
  questions: BuilderQuestion[];
  onAdd: () => void;
  onEdit: (question: BuilderQuestion) => void;
  onDelete: (question: BuilderQuestion) => void;
};

export default function AssessmentQuestionsStep({
  questions,
  onAdd,
  onEdit,
  onDelete,
}: AssessmentQuestionsStepProps) {
  const t = useTranslations('companyPage.assessments.builder');
  return (
    <section
      className="bg-card space-y-6 rounded-2xl p-5 md:p-8"
      aria-label={t('questions')}
    >
      {!questions.length ? (
        <div className="flex flex-col items-center py-10 text-center">
          <Files
            aria-hidden="true"
            className="text-secondary mb-5 size-20 stroke-1"
          />
          <h2 className="text-xl font-semibold">{t('empty-title')}</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {t('empty-description')}
            <br />
            {t('minimum-questions', { count: MIN_ASSESSMENT_QUESTIONS })}
          </p>
        </div>
      ) : (
        questions.map((question, index) => (
          <AssessmentQuestionCard
            key={question.id}
            question={question}
            number={index + 1}
            onEdit={() => onEdit(question)}
            onDelete={() => onDelete(question)}
          />
        ))
      )}
      <Button
        type="button"
        variant="outline"
        className="border-primary text-primary h-15 w-full gap-2 rounded-full border-dashed"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        {t('add-question')}
      </Button>
    </section>
  );
}
