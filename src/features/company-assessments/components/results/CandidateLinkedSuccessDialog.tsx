'use client';

import Lottie from 'lottie-react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { CandidateLinkKind } from '../../types/assessment-results.types';
import successAnimation from '../../../../../public/assets/lottie/successfully.json';

type CandidateLinkedSuccessDialogProps = {
  kind: CandidateLinkKind | null;
  onOpenChange: (open: boolean) => void;
};

export default function CandidateLinkedSuccessDialog({
  kind,
  onOpenChange,
}: CandidateLinkedSuccessDialogProps) {
  const t = useTranslations('companyPage.assessments.results');

  return (
    <Dialog open={kind !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[700px] gap-0 overflow-y-auto rounded-[24px] p-8 sm:min-w-0"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('close')}
            className="absolute start-6 top-6 z-10 size-8 rounded-full"
          >
            <X className="size-5" />
          </Button>
        </DialogClose>
        <div className="flex min-h-[463px] flex-col items-center justify-center gap-6 pt-8">
          <div className="size-[240px]">
            <Lottie
              animationData={successAnimation}
              autoplay
              loop={false}
              className="size-full"
            />
          </div>
          <DialogTitle className="text-assessment-dark text-center text-[24px] leading-9 font-bold sm:text-[28px]">
            {kind === 'job'
              ? t('candidate-linked-to-job')
              : t('candidate-linked-to-project')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t('link-success-description')}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
