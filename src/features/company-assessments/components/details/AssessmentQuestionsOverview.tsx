'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import type { BuilderQuestion } from '../../types/assessment-builder.types';
import type { AssessmentQuestion } from '../../types/assessment.types';
import AssessmentQuestionModal from '../create/AssessmentQuestionModal';

const QUESTION_PAGE_SIZE = 10;

function toBuilderQuestion(question: AssessmentQuestion): BuilderQuestion {
  const isYesNo = question.type === 'Yes / No';
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(
    (text, index) => ({ id: `${question.id}-option-${index + 1}`, text }),
  );

  return {
    id: question.id,
    type: isYesNo ? 'yes-no' : 'single-choice',
    score: String(question.score),
    questionText: question.questionText,
    options,
    correctAnswers: isYesNo ? ['yes'] : [options[0].id],
    attachmentEnabled: false,
    attachment: null,
  };
}

export default function AssessmentQuestionsOverview({
  questions,
}: {
  questions: AssessmentQuestion[];
}) {
  const t = useTranslations('companyPage.assessments.details');
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: AssessmentQuestion;
    number: number;
  } | null>(null);
  const pageCount = Math.max(
    1,
    Math.ceil(questions.length / QUESTION_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * QUESTION_PAGE_SIZE;
  // The Figma detail view presents five preview rows while pagination keeps
  // the assessment's ten-question page range.
  const visibleQuestions = questions.slice(pageStart, pageStart + 5);
  const columns: DataTableColumn<AssessmentQuestion>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-12 text-start text-[11px] px-2 py-2',
      cellClassName:
        'text-primary w-12 text-start text-xs font-semibold px-2 py-2',
      renderCell: (_question, index) => `Q${pageStart + index + 1}`,
    },
    {
      id: 'question',
      header: t('question-text'),
      headerClassName: 'text-start text-[11px] px-2 py-2',
      cellClassName: 'max-w-[420px] truncate text-start text-xs px-2 py-2',
      renderCell: (question) => question.questionText,
    },
    {
      id: 'type',
      header: t('question-type'),
      headerClassName: 'text-start text-[11px] px-2 py-2',
      cellClassName: 'text-start text-xs px-2 py-2',
      renderCell: (question) => question.type,
    },
    {
      id: 'score',
      header: t('question-score'),
      headerClassName: 'text-start text-[11px] px-2 py-2',
      cellClassName: 'text-success text-start text-xs font-semibold px-2 py-2',
      renderCell: (question) => `${question.score}%`,
    },
    {
      id: 'actions',
      header: '',
      headerClassName: 'w-10 px-2 py-2',
      cellClassName: 'w-10 px-2 py-2',
      renderCell: (question, index) => (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t('view-question', { number: pageStart + index + 1 })}
          className="bg-success hover:bg-success/80 rounded-full text-white hover:text-white"
          onClick={() =>
            setSelectedQuestion({
              question,
              number: pageStart + index + 1,
            })
          }
        >
          <Eye aria-hidden="true" />
        </Button>
      ),
    },
  ];

  return (
    <Card
      id="questions-overview"
      className="gap-3 rounded-2xl border-0 px-4 py-4 shadow-none md:px-5"
    >
      <h2 className="border-border border-b pb-2 text-[13px] font-semibold">
        {t('questions-overview')}
      </h2>
      <DataTable
        columns={columns}
        data={visibleQuestions}
        getRowKey={(question) => question.id}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        ariaLabel={t('questions-overview')}
        containerClassName="overflow-hidden rounded-lg border border-border"
        className="min-w-[640px]"
        headerRowClassName="bg-muted hover:bg-muted"
        rowClassName="bg-card odd:bg-muted/50 hover:bg-muted"
      />
      <CustomPagination
        currentPage={currentPage}
        totalItems={questions.length}
        pageSize={QUESTION_PAGE_SIZE}
        onPageChange={setPage}
        getHref={() => '#questions-overview'}
        statusPosition="start"
        className="justify-start"
      />
      {selectedQuestion ? (
        <AssessmentQuestionModal
          key={selectedQuestion.question.id}
          question={toBuilderQuestion(selectedQuestion.question)}
          readOnly
          onClose={() => setSelectedQuestion(null)}
          onSave={() => undefined}
        />
      ) : null}
    </Card>
  );
}
