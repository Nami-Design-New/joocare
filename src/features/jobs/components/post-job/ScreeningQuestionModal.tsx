'use client';

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
import type { ScreeningQuestion } from '../../types/job-steps.types';
import ScreeningQuestionForm from './ScreeningQuestionForm';

type ScreeningQuestionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (question: ScreeningQuestion) => void;
};

// "Create Screening Question" modal (Figma 10173:42822).
export default function ScreeningQuestionModal({
  open,
  onOpenChange,
  onSubmit,
}: ScreeningQuestionModalProps) {
  const t = useTranslations('companyPage.postJob.questions.builder');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-card flex max-h-[90vh] w-[calc(100%-2rem)] max-w-241 flex-col gap-6 overflow-y-auto rounded-3xl border-0 p-6 sm:min-w-0"
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-secondary text-2xl font-semibold sm:text-[28px]">
            {t('create-title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button size="icon-circle" aria-label={t('close')} className="shrink-0">
              <X aria-hidden="true" className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">{t('create-title')}</DialogDescription>
        {/* Remount on open so every new question starts empty. */}
        {open ? (
          <ScreeningQuestionForm
            idPrefix="new-screening-question"
            variant="create"
            onSubmit={(question) => {
              onSubmit(question);
              onOpenChange(false);
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
