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
          'border-assessment-border bg-card w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-[20px] p-0 sm:min-w-0',
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
            <div className="border-assessment-border flex items-center justify-between border-b px-6 py-5 sm:px-8">
              <div>
                <DialogTitle className="text-assessment-heading text-2xl leading-8 font-semibold">
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
                  className="bg-assessment-action size-9 rounded-full shadow-sm"
                >
                  <X className="size-4" />
                </Button>
              </DialogClose>
            </div>
            <div className="grid md:grid-cols-2">
              <section className="border-assessment-border border-b p-6 md:border-e md:border-b-0 md:p-8">
                <div className="flex gap-3 pb-5">
                  <span className="bg-assessment-action text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    1
                  </span>
                  <div>
                    <h3 className="text-assessment-heading text-base leading-6 font-semibold">
                      {t('candidates')}
                    </h3>
                    <p
                      className={cn(
                        'text-assessment-muted mt-1 text-sm leading-5',
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
                  <span className="text-assessment-heading font-semibold">
                    {t('selected-count', {
                      count: assignment.selectedIds.length,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => assignment.setPickerOpen(true)}
                    className="text-assessment-action font-medium"
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
                        className="border-assessment-border bg-assessment-surface text-assessment-heading rounded-full border px-3 py-1.5 font-medium"
                      >
                        {candidate.shortName}
                      </span>
                    ))}
                  {assignment.selectedIds.length > 2 ? (
                    <button
                      onClick={() => assignment.setPickerOpen(true)}
                      className="bg-assessment-action/10 text-assessment-action border-assessment-action/20 rounded-full border px-3 py-1.5 font-semibold"
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
                  <span className="bg-assessment-action text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    2
                  </span>
                  <div>
                    <h3 className="text-assessment-heading text-base leading-6 font-semibold">
                      {t('email-title')}
                    </h3>
                    <p
                      className={cn(
                        'text-assessment-muted mt-1 text-sm leading-5',
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
                    'border-assessment-border bg-assessment-control text-assessment-action h-12 w-full gap-2 rounded-2xl border-dashed text-sm font-medium',
                    assessmentBodyFont.className,
                  )}
                >
                  <Plus className="size-4" />
                  {t('add-email')}
                </Button>
                {assignment.emails.length ? (
                  <div
                    className={cn(
                      'border-assessment-border bg-assessment-surface mt-4 flex min-h-20 flex-wrap content-start gap-2 rounded-2xl border p-3',
                      assessmentBodyFont.className,
                    )}
                  >
                    {assignment.emails.map((email) => (
                      <span
                        key={email}
                        className="border-assessment-border text-assessment-heading bg-card flex h-[34px] items-center gap-2 rounded-full border py-1.5 ps-3 pe-1.5 text-xs font-medium"
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
            <div className="border-assessment-border border-t px-6 py-6 sm:px-8">
              <div className="bg-assessment-warning/20 flex items-start gap-2 rounded-2xl p-4">
                <AlertCircle className="text-assessment-warning mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-assessment-warning text-sm leading-5 font-semibold">
                    {t('how-title')}
                  </p>
                  <p className="text-gray-45 mt-1 text-sm leading-normal">
                    {t('how-description')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 py-5 text-sm leading-5">
                <span className="text-assessment-heading font-semibold">
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
                className="bg-assessment-action h-[52px] w-full rounded-2xl text-base font-semibold"
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
