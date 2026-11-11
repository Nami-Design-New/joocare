'use client';

import { ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AlertModal from '@/shared/components/modals/AlertModal';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { APPLY_STEP_KEYS } from '../../constants';
import { useApplyCv } from '../../hooks/useApplyCv';
import { useApplyToJob } from '../../hooks/useApplyToJob';
import { useScreeningAnswersForm } from '../../hooks/useScreeningAnswersForm';
import type { ApplyScreeningQuestion } from '../../types/job-apply.types';
import ApplyCvStep from './ApplyCvStep';
import ApplyStepper from './ApplyStepper';
import ScreeningQuestionsStep from './ScreeningQuestionsStep';

type ApplyWithQuestionsModalProps = {
  jobId: number;
  jobTitle: string;
  questions: ApplyScreeningQuestion[];
  onClose: () => void;
  onApplied: () => void;
};

const footerButtonClassName = 'h-13 w-full gap-2 text-sm font-semibold sm:w-56';

// Apply flow when the job has screening questions: 1. answer the questions, 2. pick the CV.
export default function ApplyWithQuestionsModal({
  jobId,
  jobTitle,
  questions,
  onClose,
  onApplied,
}: ApplyWithQuestionsModalProps) {
  const t = useTranslations('jobDetailsPage.apply');
  const [step, setStep] = useState(0);
  const [isLeaveOpen, setLeaveOpen] = useState(false);
  const form = useScreeningAnswersForm(questions);
  const cv = useApplyCv();
  const applyMutation = useApplyToJob(jobId, onApplied);
  const isCvStep = step === 1;

  const requestClose = () => {
    if (applyMutation.isPending) return;
    if (form.formState.isDirty || isCvStep) setLeaveOpen(true);
    else onClose();
  };

  const goToCvStep = form.handleSubmit(() => setStep(1));

  const submit = () => {
    if (!cv.validate()) return;
    applyMutation.mutate({
      cvPath: cv.cvPath,
      answers: form.getValues('answers'),
    });
  };

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && requestClose()}>
        <DialogContent
          showCloseButton={false}
          className="grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-255 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-6 overflow-hidden rounded-2xl bg-card p-5 sm:max-w-255 sm:px-10 sm:pt-12.5 sm:pb-7.5"
        >
          <div className="flex items-center justify-between gap-6">
            <DialogTitle className="text-xl leading-tight font-semibold text-foreground sm:text-[28px]">
              {t('title')} <bdi>{jobTitle}</bdi>
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t('description')}
            </DialogDescription>
            <button
              type="button"
              onClick={requestClose}
              aria-label={t('close')}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-assessment-primary text-primary-foreground transition-colors hover:bg-assessment-primary/90 sm:size-12"
            >
              <X aria-hidden className="size-5" strokeWidth={2} />
            </button>
          </div>

          <ApplyStepper
            steps={APPLY_STEP_KEYS.map((key) => t(`steps.${key}`))}
            current={step}
          />

          <form
            key={step}
            id="apply-with-questions"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (isCvStep) submit();
              else void goToCvStep();
            }}
            className="-mx-1 min-h-0 overflow-y-auto overscroll-contain px-1 pb-1 [scrollbar-gutter:stable]"
          >
            {isCvStep ? (
              <ApplyCvStep cv={cv} />
            ) : (
              <ScreeningQuestionsStep
                questions={questions}
                control={form.control}
              />
            )}
          </form>

          <div className="flex flex-col-reverse justify-center gap-4 sm:flex-row">
            {isCvStep ? (
              <Button
                type="button"
                variant="outline"
                size="pill"
                onClick={() => setStep(0)}
                disabled={applyMutation.isPending}
                className={`${footerButtonClassName} border-secondary`}
              >
                {t('back')}
              </Button>
            ) : null}
            <Button
              type="submit"
              form="apply-with-questions"
              size="pill"
              disabled={applyMutation.isPending}
              className={`${footerButtonClassName} bg-assessment-primary hover:bg-assessment-primary/90`}
            >
              {isCvStep ? (
                applyMutation.isPending ? (
                  t('submitting')
                ) : (
                  t('submit')
                )
              ) : (
                <>
                  {t('next')}
                  <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertModal
        open={isLeaveOpen}
        onOpenChange={setLeaveOpen}
        title={t('leave.title')}
        description={t('leave.description', { job: jobTitle })}
        confirmLabel={t('leave.confirm')}
        cancelLabel={t('leave.cancel')}
        onConfirm={() => {
          setLeaveOpen(false);
          onClose();
        }}
      />
    </>
  );
}
