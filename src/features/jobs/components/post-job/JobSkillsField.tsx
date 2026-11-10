'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { MultiSelectInputField } from '@/shared/components/MultiSelectInputField';
import { useJobSkillsField } from '../../hooks/useJobSkillsField';
import type { JobDetails } from '../../types/jobs.types';
import type { JobFormData } from '../../validation/job-post-schema';
import RecommendedSkills from './RecommendedSkills';
import SelectedSkills from './SelectedSkills';

type JobSkillsFieldProps = {
  existingJob?: JobDetails | null;
  translateError: (message?: string) => string | undefined;
  onLabelsChange?: (labels: string[]) => void;
};

// Skills field + Recommended Skills + Selected Skills (Figma 11073:45434).
export default function JobSkillsField({
  existingJob,
  translateError,
  onLabelsChange,
}: JobSkillsFieldProps) {
  const t = useTranslations('companyPage.postJob.fields.skills');
  const { control, formState: { errors } } = useFormContext<JobFormData>();
  const skills = useJobSkillsField(existingJob);
  const { query, recommended } = skills;

  return (
    <Controller
      control={control}
      name="skills"
      render={({ field }) => {
        const value = field.value ?? [];
        const change = (next: string[]) => {
          skills.rememberLabels(next);
          field.onChange(next);
          onLabelsChange?.(next.map(skills.getLabel));
        };
        return (
          <div className="flex flex-col gap-4">
            <MultiSelectInputField
              {...field}
              hideSelectedChips
              id="skills"
              label={t('label')}
              placeholder={t('placeholder')}
              withSearchInput
              error={
                translateError(errors.skills?.message) ??
                (query.error instanceof Error ? query.error.message : undefined)
              }
              options={skills.options}
              onChange={change}
              disabled={query.isLoading}
              preloadOptions={skills.existingOptions.length ? skills.existingOptions : skills.options}
              onReachEnd={() => query.fetchNextPage()}
              hasNextPage={Boolean(query.hasNextPage)}
              isFetchingNextPage={query.isFetchingNextPage}
              onSearchChange={skills.setSearch}
            />
            <RecommendedSkills
              skills={recommended.visible}
              canShowMore={recommended.canShowMore}
              isLoadingMore={recommended.isLoadingMore}
              disabled={query.isLoading}
              onSelect={(skillId) => change([...value, skillId])}
              onShowMore={recommended.showMore}
            />
            <SelectedSkills
              skills={value.map((skillId) => ({ value: skillId, label: skills.getLabel(skillId) }))}
              onRemove={(skillId) => change(value.filter((item) => item !== skillId))}
            />
          </div>
        );
      }}
    />
  );
}
