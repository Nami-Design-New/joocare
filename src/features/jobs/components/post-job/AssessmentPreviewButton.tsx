'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AssessmentPreviewDialog from '@/features/company-assessments/components/details/AssessmentPreviewDialog';
import { Button } from '@/shared/components/ui/button';

type AssessmentPreviewButtonProps = {
  assessmentId?: string;
};

export default function AssessmentPreviewButton({
  assessmentId,
}: AssessmentPreviewButtonProps) {
  const t = useTranslations('companyPage.postJob.assessment');
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <>
      <Button
        type="button"
        size="icon"
        aria-label={t('preview')}
        disabled={!assessmentId}
        onClick={() => setPreviewId(assessmentId ?? null)}
        className="size-13 rounded-full bg-secondary text-white hover:bg-secondary/90"
      >
        <Eye aria-hidden="true" className="size-5" />
      </Button>
      <AssessmentPreviewDialog
        assessmentId={previewId}
        onClose={() => setPreviewId(null)}
      />
    </>
  );
}
