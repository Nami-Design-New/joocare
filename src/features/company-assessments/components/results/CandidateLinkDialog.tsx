'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Info, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import SearchInput from '@/shared/components/SearchInput';
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
          <DialogTitle className="text-[24px] leading-8 font-bold text-assessment-dark sm:text-[28px]">
            {kind === 'job' ? t('link-job-title') : t('link-project-title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('close')}
              className="size-12 shrink-0 rounded-full bg-assessment-primary text-white hover:bg-assessment-primary/90 hover:text-white"
            >
              <X className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          {kind === 'job' ? t('link-job-title') : t('link-project-title')}
        </DialogDescription>
        <SearchInput
          id="candidate-link-search"
          placeholder={kind === 'job' ? t('search-jobs') : t('search-projects')}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          containerClassName="mb-3"
          iconClassName="text-assessment-primary"
          className="border border-assessment-border ps-11 text-sm"
        />
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
                  'flex min-h-[74px] w-full items-center gap-3 rounded-2xl border border-assessment-border px-4 py-3 text-start transition-colors',
                  isSelected &&
                    'border-assessment-primary bg-assessment-info/80',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-full border border-assessment-border',
                    isSelected && 'border-assessment-primary',
                  )}
                >
                  {isSelected ? (
                    <span className="size-2 rounded-full bg-assessment-primary" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base leading-5 font-semibold text-assessment-dark">
                    {target.name}
                  </span>
                  <span className="mt-1 block truncate text-[13px] leading-5 text-assessment-muted">
                    {metadata.join('  •  ')}
                  </span>
                </span>
                {target.alreadyLinked ? (
                  <span className="shrink-0 rounded-full bg-assessment-warning/10 px-3 py-1 text-xs font-semibold text-assessment-warning">
                    {kind === 'job'
                      ? t('already-applied')
                      : t('already-in-project')}
                  </span>
                ) : null}
              </button>
            );
          })}
          {!targets.length ? (
            <p className="py-6 text-center text-sm text-assessment-muted">
              {t('no-link-targets')}
            </p>
          ) : null}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-assessment-link-info-border bg-assessment-link-info p-4 text-assessment-link-info-text">
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
            <p className="text-sm font-semibold text-assessment-dark">
              {t('candidate')}
            </p>
            <p className="text-sm text-assessment-muted">
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
          className="h-13 w-full rounded-full bg-assessment-primary text-sm font-semibold"
        >
          {kind === 'job' ? t('link-job') : t('link-project')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
