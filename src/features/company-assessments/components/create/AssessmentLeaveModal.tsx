'use client';

import Lottie from 'lottie-react';
import { TriangleAlert, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import deleteAnimation from '../../../../../public/assets/lottie/delete.json';
import Image from 'next/image';

type AssessmentLeaveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function AssessmentLeaveModal({
  open,
  onOpenChange,
  onConfirm,
}: AssessmentLeaveModalProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const locale = useLocale();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        showCloseButton={false}
        className="w-[calc(100%_-_2rem)] max-w-175 gap-5 rounded-3xl px-5 pt-10 pb-9 [--primary:var(--assessment-primary)] sm:min-w-0 sm:px-10"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="bg-muted absolute end-6 top-6 rounded-full"
            aria-label={t('close')}
          >
            <X className="size-5" />
          </Button>
        </DialogClose>
        <div className="mx-auto size-44  sm:size-60">
          <Image
            src="/assets/icons/delete-file-icon.svg"
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="space-y-3 text-center">
          <DialogTitle className="text-2xl font-bold sm:text-[30px]">
            {t('leave-title')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base leading-7">
            {t('leave-description')}
          </DialogDescription>
        </div>
        <div className="bg-destructive/5 flex items-center gap-4 rounded-2xl p-5">
          <span className="bg-destructive/10 text-destructive rounded-full p-3">
            <TriangleAlert aria-hidden="true" className="size-6" />
          </span>
          <div className="border-destructive/20 border-s ps-4">
            <p className="text-destructive font-semibold">
              {t('leave-warning-title')}
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {t('leave-warning-description')}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="pill"
            className="flex-1 px-4"
            onClick={() => onOpenChange(false)}
          >
            {t('continue-creating')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="pill"
            className="flex-1"
            onClick={onConfirm}
          >
            {t('discard-leave')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
