'use client';

import { AlertCircle, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { assessmentBodyFont } from '../../constants/assessment-fonts';
import { useAssessmentAssignment } from '../../hooks/useAssessmentAssignment';
import AssessmentCandidatePicker from './AssessmentCandidatePicker';
import AssessmentEmailDialog from './AssessmentEmailDialog';
import AssessmentSentSuccess from './AssessmentSentSuccess';

type AssignAssessmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentTitle: string;
  statusHref?: string;
};

export default function AssignAssessmentDialog({
  open,
  onOpenChange,
  assessmentTitle,
  statusHref = '/company/assessments',
}: AssignAssessmentDialogProps) {
  const t = useTranslations('companyPage.assessments.assignment');
  const assignment = useAssessmentAssignment();
  const changeOpen = (value: boolean) => {
    onOpenChange(value);
    if (!value) assignment.reset();
  };
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent
        animated={false}
        showCloseButton={false}
        className={cn(
          'w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-[20px] border-assessment-border bg-card p-0 sm:min-w-0',
          assignment.assigned
            ? 'max-w-[700px] rounded-3xl border-0'
            : 'max-w-[1024px]',
        )}
      >
        {assignment.assigned ? (
          <AssessmentSentSuccess
            statusHref={statusHref}
            onAssignAnother={assignment.reset}
            onClose={() => changeOpen(false)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-assessment-border px-6 py-5 sm:px-8">
              <div>
                <DialogTitle className="text-xl leading-8 font-semibold text-assessment-heading sm:text-2xl">
                  {t('title')}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {assessmentTitle}
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <Button
                  size="icon"
                  aria-label={t('close')}
                  className="size-9 rounded-full bg-assessment-action shadow-sm"
                >
                  <X className="size-4" />
                </Button>
              </DialogClose>
            </div>
            <div className="grid md:grid-cols-2">
              <section className="border-b border-assessment-border p-6 md:border-e md:border-b-0 md:p-8">
                <div className="flex gap-3 pb-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-assessment-action text-sm font-semibold text-primary-foreground">
                    1
                  </span>
                  <div>
                    <h3 className="text-base leading-6 font-semibold text-assessment-heading">
                      {t('candidates')}
                    </h3>
                    <p
                      className={cn(
                        'mt-1 text-sm leading-5 text-assessment-muted',
                        assessmentBodyFont.className,
                      )}
                    >
                      {t('candidate-description')}
                    </p>
                  </div>
                </div>
                <AssessmentCandidatePicker
                  open={assignment.pickerOpen}
                  onOpenChange={assignment.setPickerOpen}
                  selectedIds={assignment.selectedIds}
                  onToggle={assignment.toggleCandidate}
                />
                <div
                  className={cn(
                    'flex items-center justify-between pt-4 text-sm leading-5',
                    assessmentBodyFont.className,
                  )}
                >
                  <span className="font-semibold text-assessment-heading">
                    {t('selected-count', {
                      count: assignment.selectedIds.length,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => assignment.setPickerOpen(true)}
                    className="font-medium text-assessment-action"
                  >
                    {t('manage')}
                  </button>
                </div>
                <div
                  className={cn(
                    'flex flex-wrap gap-2 pt-3 text-xs',
                    assessmentBodyFont.className,
                  )}
                >
                  {assignment.selectedCandidates
                    .slice(0, 2)
                    .map((candidate) => (
                      <span
                        key={candidate.id}
                        className="rounded-full border border-assessment-border bg-assessment-surface px-3 py-1.5 font-medium text-assessment-heading"
                      >
                        {candidate.shortName}
                      </span>
                    ))}
                  {assignment.selectedIds.length > 2 ? (
                    <button
                      onClick={() => assignment.setPickerOpen(true)}
                      className="rounded-full border border-assessment-action/20 bg-assessment-action/10 px-3 py-1.5 font-semibold text-assessment-action"
                    >
                      {t('more-count', {
                        count: assignment.selectedIds.length - 2,
                      })}
                    </button>
                  ) : null}
                </div>
              </section>
              <section className="p-6 md:p-8">
                <div className="flex gap-3 pb-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-assessment-action text-sm font-semibold text-primary-foreground">
                    2
                  </span>
                  <div>
                    <h3 className="text-base leading-6 font-semibold text-assessment-heading">
                      {t('email-title')}
                    </h3>
                    <p
                      className={cn(
                        'mt-1 text-sm leading-5 text-assessment-muted',
                        assessmentBodyFont.className,
                      )}
                    >
                      {t('email-description')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => assignment.setEmailOpen(true)}
                  className={cn(
                    'h-12 w-full gap-2 rounded-2xl border-dashed border-assessment-border bg-assessment-control text-sm font-medium text-assessment-action',
                    assessmentBodyFont.className,
                  )}
                >
                  <Plus className="size-4" />
                  {t('add-email')}
                </Button>
                {assignment.emails.length ? (
                  <div
                    className={cn(
                      'mt-4 flex min-h-20 flex-wrap content-start gap-2 rounded-2xl border border-assessment-border bg-assessment-surface p-3',
                      assessmentBodyFont.className,
                    )}
                  >
                    {assignment.emails.map((email) => (
                      <span
                        key={email}
                        className="flex h-[34px] items-center gap-2 rounded-full border border-assessment-border bg-card py-1.5 ps-3 pe-1.5 text-xs font-medium text-assessment-heading"
                      >
                        <span className="max-w-48 truncate">{email}</span>
                        <button
                          type="button"
                          aria-label={t('remove-email', { email })}
                          onClick={() => assignment.removeEmail(email)}
                          className="flex size-5 items-center justify-center rounded-full"
                        >
                          <X className="size-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
            <div className="border-t border-assessment-border px-6 py-6 sm:px-8">
              <div className="flex items-start gap-2 rounded-2xl bg-assessment-warning/20 p-4">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-assessment-warning" />
                <div>
                  <p className="text-sm leading-5 font-semibold text-assessment-warning">
                    {t('how-title')}
                  </p>
                  <p className="mt-1 text-sm leading-normal text-gray-45">
                    {t('how-description')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 py-5 text-sm leading-5">
                <span className="font-semibold text-assessment-heading">
                  {t('recipients')}
                </span>
                <span
                  className={cn(
                    'text-assessment-muted',
                    assessmentBodyFont.className,
                  )}
                >
                  {t('recipient-counts', {
                    registered: assignment.selectedIds.length,
                    external: assignment.emails.length,
                    total: assignment.totalRecipients,
                  })}
                </span>
              </div>
              <Button
                disabled={!assignment.totalRecipients}
                onClick={() => assignment.setAssigned(true)}
                className="h-13 w-full rounded-2xl bg-assessment-action text-base font-semibold"
              >
                {t('title')}
              </Button>
            </div>
            <AssessmentEmailDialog
              open={assignment.emailOpen}
              onOpenChange={assignment.setEmailOpen}
              onAdd={assignment.addEmail}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
