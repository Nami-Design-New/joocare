'use client';

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
import { assessmentSeeds } from '../../constants/assessment-data';
import { assessmentDetailSeeds } from '../../constants/assessment-detail-data';
import AssessmentQuestionsOverview from './AssessmentQuestionsOverview';
import AssessmentSummary from './AssessmentSummary';

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
  const assessment = assessmentSeeds.find((item) => item.id === assessmentId);
  // Preview data: detail seeds exist for a few assessments only.
  const detail =
    assessmentDetailSeeds.find((item) => item.assessmentId === assessmentId) ??
    assessmentDetailSeeds[0];

  return (
    <Dialog
      open={Boolean(assessment)}
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
        {assessment && detail ? (
          <>
            <AssessmentSummary
              assessment={assessment}
              detail={{ ...detail, summaryTitle: assessment.title }}
              labels={{
                summary: t('preview-summary'),
                titleLabel: t('preview-assessment-title'),
                score: t('preview-passing-score'),
                questionTypes: t('preview-structure'),
              }}
            />
            <AssessmentQuestionsOverview questions={detail.questions} />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
