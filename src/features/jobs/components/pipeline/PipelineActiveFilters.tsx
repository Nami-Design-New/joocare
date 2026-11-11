'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { assessmentSeeds } from '@/features/company-assessments/constants/assessment-data';
import { LIST_SEPARATOR } from '../../constants';
import type { PipelineFilterChip } from '../../hooks/usePipelineFilters';

type PipelineActiveFiltersProps = {
  chips: PipelineFilterChip[];
  labels: { country: string; nationality: string };
  onRemove: (chip: PipelineFilterChip) => void;
  onClearAll: () => void;
};

export default function PipelineActiveFilters({
  chips,
  labels,
  onRemove,
  onClearAll,
}: PipelineActiveFiltersProps) {
  const t = useTranslations('companyPage.candidates.pipeline.chips');
  const tStatus = useTranslations(
    'companyPage.assessments.candidate-assessments.status',
  );
  if (!chips.length) return null;

  const getValue = (chip: PipelineFilterChip) => {
    switch (chip.id) {
      case 'country':
        return labels.country || chip.value;
      case 'nationality':
        return labels.nationality || chip.value;
      case 'medical_license':
        return t(chip.value === '1' ? 'with-license' : 'without-license');
      case 'assessment_status':
        return chip.value
          .split(LIST_SEPARATOR)
          .map((status) => tStatus(status))
          .join(', ');
      case 'assessment_id':
        return (
          assessmentSeeds.find((assessment) => assessment.id === chip.value)
            ?.title ?? chip.value
        );
      case 'min_score':
      case 'min_assessment_score':
        return t('range', { min: chip.value || 0, max: chip.max || 100 });
      default:
        return chip.value;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">{t('label')}</span>
      {chips.map((chip) => {
        const text =
          chip.id === 'starred'
            ? t('starred')
            : t('chip', { name: t(`names.${chip.id}`), value: getValue(chip) });
        return (
          <span
            key={chip.id}
            className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 ps-3 pe-2 text-sm"
          >
            <bdi>{text}</bdi>
            <button
              type="button"
              onClick={() => onRemove(chip)}
              aria-label={t('remove', { filter: text })}
              className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </span>
        );
      })}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-destructive underline underline-offset-2"
      >
        {t('clear-all')}
      </button>
    </div>
  );
}
