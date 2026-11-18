'use client';

import { useState, type ReactNode } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import AssessmentPreviewDialog from '@/features/company-assessments/components/details/AssessmentPreviewDialog';
import { useGetAssessment } from '@/features/company-assessments/hooks/useGetAssessment';
import type { ScreeningQuestion } from '../types/job-steps.types';
import JobScreeningQuestionsModal from './JobScreeningQuestionsModal';

type JobAttachmentsCardProps = {
  questions?: ScreeningQuestion[];
  assessmentId?: number | string | null;
};

const LINK_CLASS =
  'text-primary ms-auto flex shrink-0 items-center gap-1 text-sm font-medium underline underline-offset-2';

// "Screening questions & assessment attached to this job" (Figma 11531:97096).
export default function JobAttachmentsCard({
  questions = [],
  assessmentId,
}: JobAttachmentsCardProps) {
  const t = useTranslations('companyPage.jobs.attachments');
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const linkedAssessmentId = assessmentId != null ? String(assessmentId) : '';
  const assessment = useGetAssessment(linkedAssessmentId || null);
  if (!questions.length && !linkedAssessmentId) return null;

  const requiredCount = questions.filter(
    (question) => question.required,
  ).length;
  const linkContent = (label: string) => (
    <>
      {label}
      <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
    </>
  );

  return (
    <>
      <section className="flex items-start gap-3.5 rounded-2xl border border-primary/20 bg-primary-bg px-4 py-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
          <FileText aria-hidden="true" className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-base font-semibold text-foreground">
            {t('title')}
          </h3>
          {questions.length ? (
            <AttachmentRow
              icon={<MessageSquare aria-hidden="true" className="size-4.5" />}
              label={t('questions')}
              meta={t('questions-count', {
                total: questions.length,
                required: requiredCount,
              })}
              link={
                <button
                  type="button"
                  onClick={() => setQuestionsOpen(true)}
                  className={LINK_CLASS}
                >
                  {linkContent(t('view-questions'))}
                </button>
              }
            />
          ) : null}
          {linkedAssessmentId ? (
            <AttachmentRow
              icon={<CheckCircle2 aria-hidden="true" className="size-4.5" />}
              label={t('assessment')}
              meta={assessment.data?.configuration.title ?? ''}
              link={
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className={LINK_CLASS}
                >
                  {linkContent(t('view-assessment'))}
                </button>
              }
            />
          ) : null}
        </div>
      </section>
      <JobScreeningQuestionsModal
        open={questionsOpen}
        onOpenChange={setQuestionsOpen}
        questions={questions}
      />
      <AssessmentPreviewDialog
        assessmentId={previewOpen ? linkedAssessmentId : null}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}

function AttachmentRow({
  icon,
  label,
  meta,
  link,
}: {
  icon: ReactNode;
  label: string;
  meta: string;
  link: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="font-semibold text-foreground">{label}</span>
      <span className="min-w-0 truncate text-muted-foreground">{meta}</span>
      {link}
    </div>
  );
}
