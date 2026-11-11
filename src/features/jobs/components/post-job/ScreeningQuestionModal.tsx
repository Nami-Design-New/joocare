'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import ScreeningQuestionForm from './ScreeningQuestionForm';

type ScreeningQuestionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (question: ScreeningQuestion) => void;
  // Editing an existing question (pencil button) vs adding a new one.
  question?: ScreeningQuestion | null;
};

// "Create Screening Question" / "Edit Screening Question" modal (Figma
// 10173:42822), built like AssessmentQuestionModal. Editing always opens
// this modal — the question card itself only shows a read-only preview.
export default function ScreeningQuestionModal({
  open,
  onOpenChange,
  onSubmit,
  question = null,
}: ScreeningQuestionModalProps) {
  const t = useTranslations('companyPage.postJob.questions.builder');
  const locale = useLocale();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={setPortalContainer}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        showCloseButton={false}
        aria-describedby={undefined}
        onEscapeKeyDown={(event) => {
          // Esc closes the open type menu first, not the whole modal.
          if (
            portalContainer?.querySelector(
              '[data-slot="combobox-content"][data-open]',
            )
          )
            event.preventDefault();
        }}
        className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-241 flex-col gap-6 overflow-y-auto rounded-3xl bg-card p-6 sm:min-w-0"
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-2xl font-semibold text-foreground sm:text-[28px]">
            {t(question ? 'edit-title' : 'create-title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon-circle"
              aria-label={t('close')}
              className="shrink-0"
            >
              <X aria-hidden="true" className="size-5" />
            </Button>
          </DialogClose>
        </div>
        {/* Remount on open so the form starts fresh with the right question's values. */}
        {open ? (
          <ScreeningQuestionForm
            key={question?.id ?? 'new'}
            idPrefix={
              question
                ? `edit-screening-question-${question.id}`
                : 'new-screening-question'
            }
            question={question}
            submitLabel={t(question ? 'save-changes' : 'submit')}
            portalContainer={portalContainer}
            onSubmit={(next) => {
              onSubmit(next);
              onOpenChange(false);
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
