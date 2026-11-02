'use client';

import { FileDown, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import type { ProjectCandidate } from '../../types/company-projects.types';
import { getProjectCandidateCv } from '../../utils/candidate-preview';
import CandidateCvDocument from '../candidate-cv/CandidateCvDocument';

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
  const cv = getProjectCandidateCv(candidate);

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        showCloseButton={false}
        className="bg-card flex max-h-[92dvh] w-[calc(100%-2rem)] max-w-[1024px] flex-col gap-0 overflow-hidden rounded-[24px] p-0 sm:max-w-[1024px]"
      >
        <div className="bg-body-bg flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
          <ModalHeader className="flex-row items-center justify-between gap-4 text-start">
            <ModalTitle className="text-foreground text-[28px] leading-[35px] font-semibold">
              {t('title')}
            </ModalTitle>
            <ModalDescription className="sr-only">{cv.name}</ModalDescription>
            <div className="flex items-center gap-4">
              <Image
                src="/assets/company-projects/cv-watermark.svg"
                alt=""
                width={46}
                height={48}
                className="pointer-events-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="text-foreground hover:text-primary rounded-full transition-colors"
              >
                <X className="size-7" strokeWidth={1.5} />
              </button>
            </div>
          </ModalHeader>

          <CandidateCvDocument cv={cv} />

          <div className="flex justify-center">
            <Button
              type="button"
              size="sm"
              onClick={() => onDownload(candidate)}
              className="h-8 gap-1 rounded-full px-3 text-xs font-normal"
            >
              <FileDown className="size-4" strokeWidth={1.5} />
              {t('download')}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
