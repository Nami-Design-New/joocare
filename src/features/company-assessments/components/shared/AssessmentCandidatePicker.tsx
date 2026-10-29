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
import { assessmentBodyFont } from '../../constants/assessment-fonts';
import {
  ASSESSMENT_ASSETS,
  assignmentCandidates,
} from '../../constants/assessment-invitations';

type AssessmentCandidatePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export default function AssessmentCandidatePicker({
  open,
  onOpenChange,
  selectedIds,
  onToggle,
}: AssessmentCandidatePickerProps) {
  const t = useTranslations('companyPage.assessments.assignment');
  const [search, setSearch] = useState('');
  const visibleCandidates = assignmentCandidates.filter((candidate) =>
    `${candidate.name} ${candidate.email}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'border-input text-muted-foreground bg-card h-12 w-full justify-between rounded-2xl px-4 text-sm font-medium',
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
          'border-input bg-card w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl p-0 shadow-xl',
          assessmentBodyFont.className,
        )}
      >
        <div className="border-border border-b p-3">
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
              onChange={(event) => setSearch(event.target.value)}
              className="border-assessment-primary focus-visible:ring-assessment-primary/10 h-11 rounded-xl bg-transparent ps-10 pe-10 text-sm shadow-none"
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
          className="max-h-72 space-y-2 overflow-y-auto p-2"
          role="group"
          aria-label={t('candidates')}
        >
          {visibleCandidates.map((candidate) => {
            const selected = selectedIds.includes(candidate.id);
            return (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggle(candidate.id)}
                className={cn(
                  'focus-visible:outline-assessment-primary flex min-h-[66px] w-full items-center gap-3 rounded-xl border border-transparent p-3 text-start focus-visible:outline-2',
                  selected
                    ? 'border-assessment-primary/20 bg-assessment-primary/8'
                    : 'hover:bg-muted',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'border-input flex size-5 shrink-0 items-center justify-center rounded border',
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
                <Image
                  src={`${ASSESSMENT_ASSETS}/${candidate.image}`}
                  width={40}
                  height={40}
                  alt=""
                  className="size-10 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="text-assessment-dark block truncate text-sm leading-5 font-semibold">
                    {candidate.name}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs leading-4">
                    {candidate.country} · {candidate.email}
                  </span>
                </span>
              </button>
            );
          })}
          {!visibleCandidates.length ? (
            <p className="text-muted-foreground p-5 text-center text-sm">
              {t('no-candidates')}
            </p>
          ) : null}
        </div>
        <div className="border-border border-t p-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-assessment-primary h-9 w-full rounded-[10px] text-sm font-medium"
          >
            {t('done-count', { count: selectedIds.length })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
