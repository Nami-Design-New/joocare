'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { Info, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import SearchInput from '@/shared/components/SearchInput';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import type {
  AssessmentResultCandidate,
  CandidateLinkKind,
  CandidateLinkTarget,
  CandidateLinkResult,
} from '../../types/assessment-results.types';

type CandidateLinkDialogProps = {
  kind: CandidateLinkKind | null;
  candidate: AssessmentResultCandidate | null;
  search: string;
  onSearchChange: (value: string) => void;
  targets: CandidateLinkTarget[];
  selectedTargetIds: string[];
  onTargetSelect: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  result?: CandidateLinkResult;
  recruiterName: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  isLoadingResult: boolean;
  isResultError: boolean;
  onRetryResult: () => void;
  isLinking: boolean;
};

export default function CandidateLinkDialog({
  kind,
  candidate,
  search,
  onSearchChange,
  targets,
  selectedTargetIds,
  onTargetSelect,
  onOpenChange,
  onConfirm,
  result,
  recruiterName,
  isLoading,
  isError,
  onRetry,
  hasMore,
  isLoadingMore,
  onLoadMore,
  isLoadingResult,
  isResultError,
  onRetryResult,
  isLinking,
}: CandidateLinkDialogProps) {
  const t = useTranslations('companyPage.assessments.results');
  const format = useFormatter();
  const open = kind !== null && candidate !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !isLinking && onOpenChange(open)}
    >
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
              disabled={isLinking}
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
          disabled={isLinking}
          onChange={(event) => onSearchChange(event.target.value)}
          containerClassName="mb-3"
          iconClassName="text-assessment-primary"
          className="border border-assessment-border ps-11 text-sm"
        />
        <div
          role="group"
          aria-label={
            kind === 'job' ? t('link-job-title') : t('link-project-title')
          }
          aria-busy={isLoading || isLoadingMore}
          className="flex max-h-[332px] flex-col gap-3 overflow-y-auto py-1"
        >
          {isLoading ? (
            <Skeleton className="min-h-40 w-full rounded-2xl" />
          ) : (
            targets.map((target) => {
              const isSelected = selectedTargetIds.includes(target.id);
              const countLabel =
                target.associatedCount === null
                  ? null
                  : kind === 'job'
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
                <label
                  key={target.id}
                  className={cn(
                    'flex min-h-[74px] w-full cursor-pointer items-center gap-3 rounded-2xl border border-assessment-border px-4 py-3 text-start transition-colors',
                    isSelected &&
                      'border-assessment-primary bg-assessment-info/80',
                    isLinking && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isLinking}
                    onCheckedChange={() => onTargetSelect(target.id)}
                    aria-label={target.name}
                    className="flex size-4 items-center justify-center rounded-full border-assessment-border shadow-none data-[state=checked]:border-assessment-primary data-[state=checked]:bg-transparent [&_[data-slot=checkbox-indicator]]:size-2 [&_[data-slot=checkbox-indicator]]:rounded-full [&_[data-slot=checkbox-indicator]]:bg-assessment-primary [&_svg]:hidden"
                  />
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
                </label>
              );
            })
          )}
          {!isLoading && !isError && !targets.length ? (
            <EmptyDataState
              titleText={t('no-link-targets')}
              className="min-h-40 py-4"
            />
          ) : null}
          {isError ? (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 p-3"
            >
              <p className="text-sm text-destructive">
                {t('link-targets-error')}
              </p>
              <Button
                variant="outline"
                disabled={isLoadingMore || isLinking}
                onClick={onRetry}
              >
                {t('retry-link')}
              </Button>
            </div>
          ) : hasMore && !isLoading ? (
            <Button
              variant="ghost"
              disabled={isLoadingMore || isLinking}
              onClick={onLoadMore}
            >
              {t(isLoadingMore ? 'loading-link-data' : 'load-more-targets')}
            </Button>
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
                    recruiter: recruiterName,
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
            {isLoadingResult ? (
              <Skeleton className="h-5 w-64 max-w-full" />
            ) : isResultError ? (
              <div role="alert" className="flex items-center gap-2">
                <p className="text-sm text-destructive">
                  {t('link-result-error')}
                </p>
                <Button variant="ghost" onClick={onRetryResult}>
                  {t('retry-link')}
                </Button>
              </div>
            ) : result ? (
              <p className="text-end text-sm text-assessment-muted">
                {t('candidate-result', {
                  name: result.name,
                  score:
                    result.score === null
                      ? t('no-score')
                      : `${format.number(result.score)}%`,
                  status: result.statusLabel,
                })}
              </p>
            ) : null}
          </div>
        ) : null}
        <Button
          type="button"
          disabled={
            !selectedTargetIds.length ||
            isLoading ||
            isLoadingResult ||
            isResultError ||
            isError ||
            isLinking
          }
          onClick={onConfirm}
          className="h-13 w-full rounded-full bg-assessment-primary text-sm font-semibold"
        >
          {isLinking
            ? t(kind === 'job' ? 'linking-job' : 'linking-project')
            : kind === 'job'
              ? t('link-job')
              : t('link-project')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
