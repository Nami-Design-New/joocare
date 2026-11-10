'use client';

import { useFormatter, useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { ExternalInvitation } from '../../types/assessment-invitation.types';

type CandidatePreviewDialogProps = {
  candidate: ExternalInvitation | null;
  onOpenChange: (open: boolean) => void;
};

export default function CandidatePreviewDialog({
  candidate,
  onOpenChange,
}: CandidatePreviewDialogProps) {
  const t = useTranslations('companyPage.assessments.invitations');
  const format = useFormatter();

  return (
    <Dialog open={candidate !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle>{candidate?.name}</DialogTitle>
        <DialogDescription>{candidate?.email}</DialogDescription>
        {candidate ? (
          <div className="flex justify-between text-sm">
            <span>{t(candidate.status)}</span>
            <span>
              {candidate.score === null
                ? '—'
                : `${format.number(candidate.score)}%`}
            </span>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
