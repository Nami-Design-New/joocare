'use client';

import { useState, type ReactNode } from 'react';
import { CheckCircle2, ChevronRight, FileText, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AssessmentPreviewDialog from '@/features/company-assessments/components/details/AssessmentPreviewDialog';
import { Link } from '@/i18n/navigation';
import type { JobLinkedAssessment } from '../types/jobs.types';
import type { ScreeningQuestion } from '../types/job-steps.types';
import JobScreeningQuestionsModal from './JobScreeningQuestionsModal';

type JobAttachmentsCardProps = {
  questions?: ScreeningQuestion[];
  assessment?: JobLinkedAssessment | null;
  // Inside the post-job wizard, open the preview instead of leaving the page.
  previewAssessment?: boolean;
};

const LINK_CLASS =
  'text-primary ms-auto flex shrink-0 items-center gap-1 text-sm font-medium underline underline-offset-2';

// "Screening questions & assessment attached to this job" (Figma 11531:97096).
export default function JobAttachmentsCard({
  questions = [],
  assessment,
  previewAssessment = false,
}: JobAttachmentsCardProps) {
  const t = useTranslations('companyPage.jobs.attachments');
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  if (!questions.length && !assessment) return null;

  const requiredCount = questions.filter((question) => question.required).length;
  const linkContent = (label: string) => (
    <>
      {label}
      <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
    </>
  );

  return (
    <>
      <section className="bg-primary-bg border-primary/20 flex items-start gap-3.5 rounded-2xl border px-4 py-3.5">
        <span className="bg-card text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
          <FileText aria-hidden="true" className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-foreground text-base font-semibold">{t('title')}</h3>
          {questions.length ? (
            <AttachmentRow
              icon={<MessageSquare aria-hidden="true" className="size-4.5" />}
              label={t('questions')}
              meta={t('questions-count', { total: questions.length, required: requiredCount })}
              link={
                <button type="button" onClick={() => setQuestionsOpen(true)} className={LINK_CLASS}>
                  {linkContent(t('view-questions'))}
                </button>
              }
            />
          ) : null}
          {assessment ? (
            <AttachmentRow
              icon={<CheckCircle2 aria-hidden="true" className="size-4.5" />}
              label={t('assessment')}
              meta={assessment.title}
              link={
                previewAssessment ? (
                  <button type="button" onClick={() => setPreviewId(String(assessment.id))} className={LINK_CLASS}>
                    {linkContent(t('view-assessment'))}
                  </button>
                ) : (
                  <Link
                    href={`/company/assessments/${assessment.category_id}/${assessment.id}`}
                    className={LINK_CLASS}
                  >
                    {linkContent(t('view-assessment'))}
                  </Link>
                )
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
      {previewAssessment ? (
        <AssessmentPreviewDialog assessmentId={previewId} onClose={() => setPreviewId(null)} />
      ) : null}
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
      <span className="text-primary shrink-0">{icon}</span>
      <span className="text-foreground font-semibold">{label}</span>
      <span className="text-muted-foreground min-w-0 truncate">{meta}</span>
      {link}
    </div>
  );
}
