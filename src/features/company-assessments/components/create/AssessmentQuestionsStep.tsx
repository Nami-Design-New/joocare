'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  ASSESSMENT_QUESTIONS_PAGE_SIZE,
  MIN_ASSESSMENT_QUESTIONS,
} from '../../constants/assessment-builder';
import type { BuilderQuestion } from '../../types/assessment-builder.types';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import AssessmentQuestionCard from './AssessmentQuestionCard';

type AssessmentQuestionsStepProps = {
  questions: BuilderQuestion[];
  total: number;
  page: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (question: BuilderQuestion) => void;
  onDelete: (question: BuilderQuestion) => void;
};

export default function AssessmentQuestionsStep({
  questions,
  total,
  page,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: AssessmentQuestionsStepProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const startIndex = (page - 1) * ASSESSMENT_QUESTIONS_PAGE_SIZE;

  function renderQuestions() {
    if (isLoading) {
      return Array.from(
        { length: ASSESSMENT_QUESTIONS_PAGE_SIZE },
        (_, index) => <Skeleton key={index} className="h-40 rounded-2xl" />,
      );
    }
    if (isError) return <AssessmentsErrorState onRetry={onRetry} />;
    if (!questions.length) {
      return (
        <div className="flex flex-col items-center py-10 text-center">
          <Image
            src="/assets/icons/files.svg"
            alt=""
            height={120}
            width={120}
            aria-hidden="true"
            className="mb-5 size-25"
          />
          <h2 className="text-xl font-semibold">{t('empty-title')}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t('empty-description')}
            <br />
            {t('minimum-questions', { count: MIN_ASSESSMENT_QUESTIONS })}
          </p>
        </div>
      );
    }
    return questions.map((question, index) => (
      <AssessmentQuestionCard
        key={question.id}
        question={question}
        number={startIndex + index + 1}
        onEdit={() => onEdit(question)}
        onDelete={() => onDelete(question)}
      />
    ));
  }

  return (
    <section
      className="space-y-6 rounded-2xl bg-card p-5 md:p-8"
      aria-label={t('questions')}
      aria-busy={isLoading}
    >
      {renderQuestions()}
      {total > ASSESSMENT_QUESTIONS_PAGE_SIZE && (
        <CustomPagination
          currentPage={page}
          totalItems={total}
          pageSize={ASSESSMENT_QUESTIONS_PAGE_SIZE}
          onPageChange={onPageChange}
          statusPosition="start"
          className="justify-start gap-2 md:gap-4"
        />
      )}
      <Button
        type="button"
        variant="outline"
        className="h-15 w-full gap-2 rounded-full border-dashed border-primary text-primary"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        {t('add-question')}
      </Button>
    </section>
  );
}
