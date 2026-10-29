'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Info, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { InputField } from '@/shared/components/InputField';
import { cn } from '@/shared/lib/utils';
import type {
  AssessmentResultCandidate,
  CandidateLinkKind,
  CandidateLinkTarget,
} from '../../types/assessment-results.types';
import { LINKING_RECRUITER_NAME } from '../../constants/assessment-results';

type CandidateLinkDialogProps = {
  kind: CandidateLinkKind | null;
  candidate: AssessmentResultCandidate | null;
  search: string;
  onSearchChange: (value: string) => void;
  targets: CandidateLinkTarget[];
  selectedTargetId: string;
  onTargetSelect: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function CandidateLinkDialog({
  kind,
  candidate,
  search,
  onSearchChange,
  targets,
  selectedTargetId,
  onTargetSelect,
  onOpenChange,
  onConfirm,
}: CandidateLinkDialogProps) {
  const t = useTranslations('companyPage.assessments.results');
  const format = useFormatter();
  const open = kind !== null && candidate !== null;
  const selectedTargetIsVisible = targets.some(
    (target) => target.id === selectedTargetId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[780px] gap-0 overflow-y-auto rounded-[24px] p-6 sm:min-w-0 sm:p-6"
      >
        <div className="flex items-center justify-between gap-4 pb-6">
          <DialogTitle className="text-assessment-dark text-[24px] leading-8 font-bold sm:text-[28px]">
            {kind === 'job' ? t('link-job-title') : t('link-project-title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('close')}
              className="bg-assessment-primary hover:bg-assessment-primary/90 size-12 shrink-0 rounded-full text-white hover:text-white"
            >
              <X className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          {kind === 'job' ? t('link-job-title') : t('link-project-title')}
        </DialogDescription>
        <div className="relative pb-3">
          <Search
            aria-hidden="true"
            className="text-assessment-primary pointer-events-none absolute start-4 top-1/2 z-10 size-5 -translate-y-1/2"
          />
          <InputField
            id="candidate-link-search"
            aria-label={
              kind === 'job' ? t('search-jobs') : t('search-projects')
            }
            placeholder={
              kind === 'job' ? t('search-jobs') : t('search-projects')
            }
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="border-assessment-border bg-card h-13 rounded-full ps-11 text-sm shadow-none"
          />
        </div>
        <div className="flex max-h-[310px] flex-col gap-3 overflow-y-auto py-1">
          {targets.map((target) => {
            const isSelected = target.id === selectedTargetId;
            const countLabel =
              kind === 'job'
                ? t('applicants-count', {
                    count: format.number(target.associatedCount),
                  })
                : t('candidates-count', {
                    count: format.number(target.associatedCount),
                  });
            const metadata = [
              target.organization,
              target.location,
              countLabel,
            ].filter(Boolean);

            return (
              <button
                key={target.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onTargetSelect(target.id)}
                className={cn(
                  'border-assessment-border flex min-h-[74px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-colors',
                  isSelected &&
                    'border-assessment-primary bg-assessment-info/80',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'border-assessment-border flex size-4 shrink-0 items-center justify-center rounded-full border',
                    isSelected && 'border-assessment-primary',
                  )}
                >
                  {isSelected ? (
                    <span className="bg-assessment-primary size-2 rounded-full" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-assessment-dark block truncate text-base leading-5 font-semibold">
                    {target.name}
                  </span>
                  <span className="text-assessment-muted mt-1 block truncate text-[13px] leading-5">
                    {metadata.join('  •  ')}
                  </span>
                </span>
                {target.alreadyLinked ? (
                  <span className="bg-assessment-warning/10 text-assessment-warning shrink-0 rounded-full px-3 py-1 text-xs font-semibold">
                    {kind === 'job'
                      ? t('already-applied')
                      : t('already-in-project')}
                  </span>
                ) : null}
              </button>
            );
          })}
          {!targets.length ? (
            <p className="text-assessment-muted py-6 text-center text-sm">
              {t('no-link-targets')}
            </p>
          ) : null}
        </div>
        <div className="border-assessment-link-info-border bg-assessment-link-info text-assessment-link-info-text mt-5 flex items-start gap-3 rounded-2xl border p-4">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm leading-5 font-semibold">
              {t('how-linking-works')}
            </p>
            {candidate && kind ? (
              <p className="mt-1 text-xs leading-[1.4]">
                {t(
                  kind === 'job'
                    ? 'job-link-explanation'
                    : 'project-link-explanation',
                  {
                    candidate: candidate.name,
                    recruiter: LINKING_RECRUITER_NAME,
                  },
                )}
              </p>
            ) : null}
          </div>
        </div>
        {candidate && kind ? (
          <div className="flex flex-wrap items-center justify-between gap-3 py-6">
            <p className="text-assessment-dark text-sm font-semibold">
              {t('candidate')}
            </p>
            <p className="text-assessment-muted text-sm">
              {t('candidate-result', {
                name: candidate.name,
                score:
                  candidate.score === null
                    ? t('no-score')
                    : `${format.number(candidate.score)}%`,
                status: t(`status.${candidate.status}`),
              })}
            </p>
          </div>
        ) : null}
        <Button
          type="button"
          disabled={!selectedTargetIsVisible}
          onClick={onConfirm}
          className="bg-assessment-primary h-13 w-full rounded-full text-sm font-semibold"
        >
          {kind === 'job' ? t('link-job') : t('link-project')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
