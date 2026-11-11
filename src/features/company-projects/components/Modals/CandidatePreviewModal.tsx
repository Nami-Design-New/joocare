'use client';

import { FileText, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import type { ProjectCandidate } from '../../types/company-projects.types';

export type CandidatePreviewType = 'profile' | 'cv' | 'result';

type CandidatePreviewModalProps = {
  type: CandidatePreviewType;
  candidate: ProjectCandidate;
  onClose: () => void;
};

export default function CandidatePreviewModal({
  type,
  candidate,
  onClose,
}: CandidatePreviewModalProps) {
  const t = useTranslations('companyPage.projects');
  const statusKey = {
    Rejected: 'rejected',
    Shortlist: 'shortlist',
    'Under review': 'under-review',
  }[candidate.status];
  const assessmentKey = {
    Passed: 'passed',
    Failed: 'failed',
    'Not assigned': 'not-assigned',
  }[candidate.assessment];
  const titleKey: Record<CandidatePreviewType, string> = {
    profile: 'candidate-profile',
    cv: 'cv-preview',
    result: 'assessment-result',
  };

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="w-[calc(100%-2rem)] max-w-lg gap-5 rounded-[24px] p-6 sm:p-8">
        <ModalHeader className="text-start">
          <ModalTitle className="flex items-center gap-2 text-xl font-bold">
            {type === 'profile' ? (
              <UserRound className="size-5 text-primary" />
            ) : (
              <FileText className="size-5 text-primary" />
            )}
            {t(titleKey[type])}
          </ModalTitle>
          <ModalDescription>{candidate.name}</ModalDescription>
        </ModalHeader>

        {type === 'profile' && (
          <div className="grid gap-3 rounded-2xl bg-body-bg p-4 text-sm">
            <p>
              <strong>{t('nationality')}:</strong> {candidate.nationality}
            </p>
            <p>
              <strong>{t('email')}:</strong> {candidate.email}
            </p>
            <p>
              <strong>{t('phone')}:</strong> {candidate.phone}
            </p>
            <p>
              <strong>{t('status')}:</strong> {t(statusKey)}
            </p>
          </div>
        )}

        {type === 'cv' && (
          <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-body-bg text-muted-foreground">
            <FileText className="size-10 text-primary" />
            <p className="font-medium">{t('sample-cv-preview')}</p>
            <p className="text-xs">{candidate.name}</p>
          </div>
        )}

        {type === 'result' && (
          <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl bg-body-bg">
            <span className="text-sm font-semibold text-success">
              {t(assessmentKey)}
            </span>
            <span className="text-3xl font-bold text-foreground sm:text-4xl">
              {candidate.score ?? 0}%
            </span>
            <span className="text-xs text-muted-foreground">
              {t('assessment-score')}
            </span>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" variant="outline" size="pill" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
