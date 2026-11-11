'use client';

import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useGetSkills from '@/shared/hooks/useGetSkills';
import { OTHER_OPTION_VALUE } from '../constants';
import type { JobDetails } from '../types/jobs.types';
import type { JobFormData } from '../validation/job-post-schema';
import { useRecommendedSkills } from './useRecommendedSkills';

// Skills search + recommendations for the job title picked in step 1.
export function useJobSkillsField(existingJob?: JobDetails | null) {
  const { watch } = useFormContext<JobFormData>();
  const [search, setSearch] = useState('');
  // Labels of picked skills, kept after the search results change.
  const [pickedLabels, setPickedLabels] = useState<Map<string, string>>(
    () => new Map(),
  );
  const jobTitle = watch('title') ?? '';
  const jobTitleId = jobTitle === OTHER_OPTION_VALUE ? '' : jobTitle;
  const selected = watch('skills') ?? [];

  const query = useGetSkills(search, jobTitleId, Boolean(jobTitleId));
  const options = query.skills.map((item) => ({
    label: item.title,
    value: String(item.id),
  }));
  const existingOptions = useMemo(
    () =>
      (existingJob?.skills ?? []).map((skill) => ({
        label: skill.title,
        value: String(skill.id),
      })),
    [existingJob],
  );
  const recommended = useRecommendedSkills(jobTitleId, selected);

  const knownLabels = useMemo(() => {
    const map = new Map<string, string>();
    [...existingOptions, ...recommended.options, ...options].forEach((option) =>
      map.set(option.value, option.label),
    );
    return map;
  }, [existingOptions, recommended.options, options]);

  const getLabel = (value: string) =>
    pickedLabels.get(value) ?? knownLabels.get(value) ?? value;

  const rememberLabels = (values: string[]) =>
    setPickedLabels((current) => {
      const next = new Map(current);
      values.forEach((value) => {
        const label = knownLabels.get(value);
        if (label) next.set(value, label);
      });
      return next;
    });

  return {
    options,
    existingOptions,
    recommended,
    setSearch,
    query,
    getLabel,
    rememberLabels,
  };
}
