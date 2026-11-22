'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import type { SavedAssessmentQuestion } from '../../types/assessment-builder.types';
import AssessmentQuestionPreviewModal from '../create/AssessmentQuestionPreviewModal';

const QUESTION_PAGE_SIZE = 10;

type AssessmentQuestionsOverviewProps = {
  questions: SavedAssessmentQuestion[];
};

export default function AssessmentQuestionsOverview({
  questions,
}: AssessmentQuestionsOverviewProps) {
  const t = useTranslations('companyPage.assessments.details');
  const locale = useLocale();
  const format = useFormatter();
  const [page, setPage] = useState(1);
  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(
    null,
  );
  const pageCount = Math.max(
    1,
    Math.ceil(questions.length / QUESTION_PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * QUESTION_PAGE_SIZE;
  const visibleQuestions = questions.slice(
    pageStart,
    pageStart + QUESTION_PAGE_SIZE,
  );
  const columns: DataTableColumn<SavedAssessmentQuestion>[] = [
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
      renderCell: (question) => <span dir="auto">{question.questionText}</span>,
    },
    {
      id: 'type',
      header: t('question-type'),
      headerClassName: 'text-start text-[11px] px-2 py-2',
      cellClassName: 'text-start text-xs px-2 py-2',
      renderCell: (question) => question.typeLabel,
    },
    {
      id: 'score',
      header: t('question-score'),
      headerClassName: 'text-start text-[11px] px-2 py-2',
      cellClassName: 'text-success text-start text-xs font-semibold px-2 py-2',
      renderCell: (question) => format.number(question.score),
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
          className="rounded-full bg-success text-white hover:bg-success/80 hover:text-white"
          onClick={() => setPreviewQuestionId(question.id)}
        >
          <Eye aria-hidden="true" />
        </Button>
      ),
    },
  ];

  return (
    <Card
      id="questions-overview"
      className="min-w-0 gap-3 rounded-2xl border-0 px-3 py-3 shadow-none sm:px-4 sm:py-4 md:px-5"
    >
      <h2 className="border-b border-border pb-2 text-[13px] font-semibold">
        {t('questions-overview')}
      </h2>
      {questions.length ? (
        <>
          <DataTable
            columns={columns}
            data={visibleQuestions}
            getRowKey={(question) => question.id}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            ariaLabel={t('questions-overview')}
            containerClassName="overflow-x-auto rounded-lg border border-border"
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
        </>
      ) : (
        <p className="text-xs text-muted-foreground">{t('no-questions')}</p>
      )}
      {previewQuestionId ? (
        <AssessmentQuestionPreviewModal
          key={previewQuestionId}
          questionId={previewQuestionId}
          onClose={() => setPreviewQuestionId(null)}
        />
      ) : null}
    </Card>
  );
}
