'use client';

import { useState } from 'react';
import { CustomPagination } from '@/shared/components/CustomPagination';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  ASSESSMENT_QUESTIONS_PAGE_SIZE,
  MIN_ASSESSMENT_QUESTIONS,
} from '../../constants/assessment-builder';
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
  const [page, setPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(questions.length / ASSESSMENT_QUESTIONS_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * ASSESSMENT_QUESTIONS_PAGE_SIZE;
  const visibleQuestions = questions.slice(
    startIndex,
    startIndex + ASSESSMENT_QUESTIONS_PAGE_SIZE,
  );

  return (
    <section
      className="bg-card space-y-6 rounded-2xl p-5 md:p-8"
      aria-label={t('questions')}
    >
      {!questions.length ? (
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
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {t('empty-description')}
            <br />
            {t('minimum-questions', { count: MIN_ASSESSMENT_QUESTIONS })}
          </p>
        </div>
      ) : (
        visibleQuestions.map((question, index) => (
          <AssessmentQuestionCard
            key={question.id}
            question={question}
            number={startIndex + index + 1}
            onEdit={() => onEdit(question)}
            onDelete={() => onDelete(question)}
          />
        ))
      )}
      {questions.length > ASSESSMENT_QUESTIONS_PAGE_SIZE && (
        <CustomPagination
          currentPage={currentPage}
          totalItems={questions.length}
          pageSize={ASSESSMENT_QUESTIONS_PAGE_SIZE}
          onPageChange={setPage}
          statusPosition="start"
          className="justify-start gap-2 md:gap-4"
        />
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
