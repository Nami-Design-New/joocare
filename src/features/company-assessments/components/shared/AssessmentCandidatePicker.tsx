'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { InputField } from '@/shared/components/InputField';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import EmptyDataState from '@/shared/components/EmptyDataState';
import { assessmentBodyFont } from '../../constants/assessment-fonts';
import { ASSESSMENT_ASSETS } from '../../constants/assessment-invitations';
import type { AssignmentCandidate } from '../../types/assessment-invitation.types';
import { useGetAssignmentCandidates } from '../../hooks/useGetAssignmentCandidates';
import AssessmentsErrorState from './AssessmentsErrorState';

type AssessmentCandidatePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onToggle: (candidate: AssignmentCandidate) => void;
  disabled?: boolean;
};

export default function AssessmentCandidatePicker({
  open,
  onOpenChange,
  selectedIds,
  onToggle,
  disabled,
}: AssessmentCandidatePickerProps) {
  const t = useTranslations('companyPage.assessments.assignment');
  const [search, setSearch] = useState('');
  const candidatesQuery = useGetAssignmentCandidates(search, open);
  const isLoading = candidatesQuery.isLoading || candidatesQuery.isSearching;
  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            'h-12 w-full justify-between rounded-2xl border-input bg-card px-4 text-sm font-medium text-muted-foreground',
            assessmentBodyFont.className,
          )}
        >
          <span className="flex items-center gap-3">
            <Image
              src={`${ASSESSMENT_ASSETS}/search.svg`}
              width={16}
              height={16}
              alt=""
            />
            {t('picker-placeholder')}
          </span>
          <ChevronDown className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          'w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl border-input bg-card p-0 shadow-xl',
          assessmentBodyFont.className,
        )}
      >
        <div className="border-b border-border p-3">
          <div className="relative">
            <Image
              src={`${ASSESSMENT_ASSETS}/search.svg`}
              width={16}
              height={16}
              alt=""
              className="absolute start-3 top-1/2 z-10 -translate-y-1/2"
            />
            <InputField
              id="assignment-candidate-search"
              aria-label={t('search')}
              placeholder={t('search-placeholder')}
              value={search}
              disabled={disabled}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-xl border-assessment-primary bg-transparent ps-10 pe-10 text-sm shadow-none focus-visible:ring-assessment-primary/10"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label={t('close-picker')}
              className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-lg"
            >
              <Image
                src={`${ASSESSMENT_ASSETS}/picker-close.svg`}
                width={16}
                height={16}
                alt=""
              />
            </Button>
          </div>
        </div>
        <div
          className="max-h-[min(18rem,40dvh)] touch-pan-y space-y-2 overflow-y-auto overscroll-y-contain p-2"
          role="group"
          aria-label={t('candidates')}
          aria-busy={isLoading || candidatesQuery.isFetchingNextPage}
          onScroll={(event) => {
            const element = event.currentTarget;
            if (
              element.scrollTop + element.clientHeight >=
                element.scrollHeight - 40 &&
              candidatesQuery.hasNextPage &&
              !candidatesQuery.isFetching &&
              !isLoading &&
              !candidatesQuery.isError
            ) {
              void candidatesQuery.fetchNextPage();
            }
          }}
        >
          {isLoading ? (
            <p
              role="status"
              className="p-5 text-center text-sm text-muted-foreground"
            >
              {t('loading-candidates')}
            </p>
          ) : candidatesQuery.isError ? (
            <AssessmentsErrorState
              onRetry={() => {
                void candidatesQuery.refetch();
              }}
            />
          ) : (
            candidatesQuery.candidates.map((candidate) => {
              const selected = selectedIds.includes(candidate.id);
              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggle(candidate)}
                  disabled={disabled}
                  className={cn(
                    'flex min-h-[66px] w-full items-center gap-3 rounded-xl border border-transparent p-3 text-start focus-visible:outline-2 focus-visible:outline-assessment-primary',
                    selected
                      ? 'border-assessment-primary/20 bg-assessment-primary/8'
                      : 'hover:bg-muted',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded border border-input',
                      selected &&
                        'border-assessment-primary bg-assessment-primary',
                    )}
                  >
                    {selected ? (
                      <Image
                        src={`${ASSESSMENT_ASSETS}/check.svg`}
                        width={14}
                        height={14}
                        alt=""
                      />
                    ) : null}
                  </span>
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={candidate.image ?? undefined} alt="" />
                    <AvatarFallback>
                      {candidate.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0">
                    <span className="block truncate text-sm leading-5 font-semibold text-assessment-dark">
                      {candidate.name}
                    </span>
                    <span className="block truncate text-xs leading-4 text-muted-foreground">
                      {[candidate.country, candidate.email]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                </button>
              );
            })
          )}
          {!isLoading &&
          !candidatesQuery.isError &&
          !candidatesQuery.candidates.length ? (
            <EmptyDataState
              titleText={t('no-candidates')}
              className="min-h-0 rounded-none p-5"
              icon={<span />}
            />
          ) : null}
          {candidatesQuery.isFetchingNextPage ? (
            <p
              role="status"
              className="p-3 text-center text-sm text-muted-foreground"
            >
              {t('loading-candidates')}
            </p>
          ) : null}
          {candidatesQuery.hasNextPage &&
          !isLoading &&
          !candidatesQuery.isError ? (
            <Button
              type="button"
              variant="ghost"
              disabled={candidatesQuery.isFetchingNextPage}
              className="w-full"
              onClick={() => {
                void candidatesQuery.fetchNextPage();
              }}
            >
              {t('load-more')}
            </Button>
          ) : null}
        </div>
        <div className="border-t border-border p-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="h-9 w-full rounded-[10px] bg-assessment-primary text-sm font-medium"
          >
            {t('done-count', { count: selectedIds.length })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
