'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useGetAssessment } from '../../hooks/useGetAssessment';
import AssessmentQuestionPreviewModal from '../create/AssessmentQuestionPreviewModal';
import AssessmentReviewStep from '../create/AssessmentReviewStep';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';

type AssessmentPreviewDialogProps = {
  assessmentId: string | null;
  onClose: () => void;
};

// "Assessment Preview" sheet (Figma 11661:118968), used when linking an assessment to a job.
export default function AssessmentPreviewDialog({
  assessmentId,
  onClose,
}: AssessmentPreviewDialogProps) {
  const t = useTranslations('companyPage.assessments.details');
  const assessment = useGetAssessment(assessmentId);
  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(
    null,
  );

  function renderContent() {
    if (assessment.data) {
      return (
        <AssessmentReviewStep
          assessment={assessment.data}
          onPreview={setPreviewQuestionId}
        />
      );
    }
    if (assessment.isError) {
      return (
        <AssessmentsErrorState onRetry={() => void assessment.refetch()} />
      );
    }
    return <Skeleton aria-busy="true" className="h-96 rounded-2xl" />;
  }

  return (
    <Dialog
      open={Boolean(assessmentId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-269 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-3xl border-0 bg-white p-4 sm:min-w-0 sm:gap-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <DialogHeader className="min-w-0 gap-1 text-start sm:gap-2">
            <DialogTitle className="text-xl font-bold text-secondary sm:text-[28px]">
              {t('preview-title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t('preview-subtitle')}
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button
              size="icon-circle"
              aria-label={t('preview-close')}
              className="shrink-0"
            >
              <X aria-hidden="true" className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <div className="rounded-2xl bg-muted p-2 sm:p-4">{renderContent()}</div>
      </DialogContent>
      {previewQuestionId ? (
        <AssessmentQuestionPreviewModal
          key={previewQuestionId}
          questionId={previewQuestionId}
          onClose={() => setPreviewQuestionId(null)}
        />
      ) : null}
    </Dialog>
  );
}
