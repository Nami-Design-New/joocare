'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import { candidateCvFileUrl } from '../../constants/candidate-cv-preview-data';
import type { ProjectCandidate } from '../../types/company-projects.types';

type CandidateCvModalProps = {
  candidate: ProjectCandidate;
  onClose: () => void;
  onDownload: (candidate: ProjectCandidate) => void;
};

export default function CandidateCvModal({
  candidate,
  onClose,
  onDownload,
}: CandidateCvModalProps) {
  const t = useTranslations('companyPage.projects.cv');

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="flex h-[min(90vh,900px)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-4 rounded-[24px] p-5 sm:p-7">
        <ModalHeader className="text-start">
          <ModalTitle className="text-xl font-bold">{t('title')}</ModalTitle>
          <ModalDescription>{candidate.name}</ModalDescription>
        </ModalHeader>

        <iframe
          title={`${candidate.name} — ${t('title')}`}
          src={candidateCvFileUrl}
          className="min-h-0 w-full flex-1 rounded-xl border"
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" size="pill" onClick={onClose}>
            {t('close')}
          </Button>
          <Button
            type="button"
            size="pill"
            onClick={() => onDownload(candidate)}
          >
            {t('download')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
