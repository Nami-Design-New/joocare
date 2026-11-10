'use client';

import { useState } from 'react';
import useGetSkills from '@/shared/hooks/useGetSkills';
import { RECOMMENDED_SKILLS_STEP } from '../constants';

// Uses the skills list the form already loads for this job title.
// Swap the source here when the recommended-skills endpoint is ready.
export function useRecommendedSkills(jobTitleId: string, selected: string[]) {
  const { skills, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetSkills('', jobTitleId, Boolean(jobTitleId));
  const [visibleCount, setVisibleCount] = useState(RECOMMENDED_SKILLS_STEP);

  const options = skills.map((skill) => ({
    label: skill.title,
    value: String(skill.id),
  }));
  const available = options.filter((option) => !selected.includes(option.value));
  const hasHidden = available.length > visibleCount;

  return {
    options,
    visible: available.slice(0, visibleCount),
    canShowMore: hasHidden || Boolean(hasNextPage),
    isLoadingMore: isFetchingNextPage,
    showMore: () => {
      setVisibleCount((count) => count + RECOMMENDED_SKILLS_STEP);
      if (!hasHidden && hasNextPage) void fetchNextPage();
    },
  };
}
