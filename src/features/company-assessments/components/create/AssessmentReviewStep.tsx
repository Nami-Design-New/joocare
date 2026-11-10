'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import { Button } from '@/shared/components/ui/button';
import {
  QUESTION_REVIEW_PAGE_SIZE,
  QUESTION_TYPES,
} from '../../constants/assessment-builder';
import type {
  AssessmentConfiguration,
  BuilderQuestion,
} from '../../types/assessment-builder.types';

type AssessmentReviewStepProps = {
  configuration: AssessmentConfiguration;
  questions: BuilderQuestion[];
  onPreview: (question: BuilderQuestion) => void;
};

export default function AssessmentReviewStep({
  configuration,
  questions,
  onPreview,
}: AssessmentReviewStepProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(questions.length / QUESTION_REVIEW_PAGE_SIZE)),
  );
  const start = (currentPage - 1) * QUESTION_REVIEW_PAGE_SIZE;
  const metrics = [
    { label: t('questions'), value: questions.length },
    { label: t('passing-score'), value: `${configuration.passScore}%` },
    {
      label: t('assessment-duration'),
      value: t('minutes', { count: Number(configuration.durationMinutes) }),
    },
    { label: t('permitted-attempts'), value: 1 },
  ];
  const columns: DataTableColumn<BuilderQuestion>[] = [
    {
      id: 'number',
      header: '#',
      headerClassName: 'w-12 px-3 py-3 text-start text-xs font-normal',
      cellClassName: 'px-3 py-4 text-start text-xs text-primary font-semibold',
      renderCell: (_question, index) =>
        t('question-number', { number: start + index + 1 }),
    },
    {
      id: 'question',
      header: t('question-text'),
      headerClassName: 'px-3 py-3 text-start text-xs font-normal',
      cellClassName: 'max-w-100 truncate px-3 py-4 text-start text-xs',
      renderCell: (question) => question.questionText,
    },
    {
      id: 'type',
      header: t('question-type'),
      headerClassName: 'px-3 py-3 text-start text-xs font-normal',
      cellClassName: 'px-3 py-4 text-start text-xs',
      renderCell: (question) => t(question.type),
    },
    {
      id: 'score',
      header: t('score-percent'),
      headerClassName: 'px-3 py-3 text-start text-xs font-normal',
      cellClassName: 'px-3 py-4 text-start text-xs text-primary font-semibold',
      renderCell: (question) => `${question.score}%`,
    },
    {
      id: 'preview',
      header: '',
      headerClassName: 'w-12 px-3',
      cellClassName: 'px-3 py-4',
      renderCell: (question, index) => (
        <Button
          type="button"
          size="icon-sm"
          className="rounded-full"
          aria-label={t('view-question', { number: start + index + 1 })}
          onClick={() => onPreview(question)}
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <section className="bg-card space-y-5 rounded-2xl p-5 md:p-6">
        <h2 className="border-border border-b pb-2 text-base font-semibold">
          {t('summary')}
        </h2>
        <div>
          <h3 className="font-semibold">{configuration.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {configuration.description}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-muted rounded-xl px-3 py-2">
              <dt className="text-muted-foreground text-xs">{metric.label}</dt>
              <dd className="mt-1 text-sm font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="text-muted-foreground mb-2 text-xs">
            {t('allowed-question-types')}
          </p>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((type) => {
              const count = questions.filter(
                (question) => question.type === type,
              ).length;
              return count > 0 ? (
                <span
                  key={type}
                  className="bg-primary-bg text-primary rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {count} {t(type)}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </section>
      <section
        id="assessment-review-questions"
        className="bg-card scroll-mt-24 space-y-5 rounded-2xl p-5 md:p-6"
      >
        <h2 className="border-border border-b pb-2 text-base font-semibold">
          {t('questions-overview')}
        </h2>
        <DataTable
          columns={columns}
          data={questions.slice(start, start + QUESTION_REVIEW_PAGE_SIZE)}
          getRowKey={(question) => question.id}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          ariaLabel={t('questions-overview')}
          containerClassName="rounded-lg border border-border"
          headerRowClassName="bg-muted hover:bg-muted"
          rowClassName="bg-card hover:bg-muted/50"
          className="min-w-160"
        />
        <CustomPagination
          currentPage={currentPage}
          totalItems={questions.length}
          pageSize={QUESTION_REVIEW_PAGE_SIZE}
          onPageChange={setPage}
          getHref={() => '#assessment-review-questions'}
          statusPosition="start"
          className="justify-start"
        />
      </section>
    </div>
  );
}
