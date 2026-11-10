'use client';

import { useMemo } from 'react';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  PIPELINE_FILTER_KEYS,
  PIPELINE_FILTER_LABEL_KEYS,
} from '../constants';
import type {
  PipelineFilterKey,
  PipelineFilters,
} from '../types/job-candidates.types';

// Each score range is one filter (one chip).
const RANGE_PAIRS: [PipelineFilterKey, PipelineFilterKey][] = [
  ['min_score', 'max_score'],
  ['min_assessment_score', 'max_assessment_score'],
];
const RANGE_KEYS = RANGE_PAIRS.flat();
const LABELLED_KEYS = ['country', 'nationality'] as const;

export type PipelineFilterChip = {
  id: PipelineFilterKey;
  keys: PipelineFilterKey[];
  value: string;
  max: string;
};

export function usePipelineFilters() {
  const { get, getPage, update } = useUrlFilters();
  const filters = useMemo(() => {
    const values: Partial<PipelineFilters> = {};
    PIPELINE_FILTER_KEYS.forEach((key) => {
      const value = get(key);
      if (value) values[key] = value;
    });
    return values;
  }, [get]);

  const chips = useMemo<PipelineFilterChip[]>(() => {
    const single = PIPELINE_FILTER_KEYS.filter(
      (key) => filters[key] && !RANGE_KEYS.includes(key),
    ).map((key) => ({
      id: key,
      keys: [key],
      value: filters[key] ?? '',
      max: '',
    }));
    const ranges = RANGE_PAIRS.filter(
      ([min, max]) => filters[min] || filters[max],
    ).map(([min, max]) => ({
      id: min,
      keys: [min, max],
      value: filters[min] ?? '',
      max: filters[max] ?? '',
    }));
    return [...single, ...ranges];
  }, [filters]);

  const clearKeys = (keys: PipelineFilterKey[]) =>
    update({
      ...Object.fromEntries(keys.map((key) => [key, null])),
      ...Object.fromEntries(
        LABELLED_KEYS.filter((key) => keys.includes(key)).map((key) => [
          PIPELINE_FILTER_LABEL_KEYS[key],
          null,
        ]),
      ),
      page: null,
    });

  return {
    filters,
    labels: {
      country: get(PIPELINE_FILTER_LABEL_KEYS.country),
      nationality: get(PIPELINE_FILTER_LABEL_KEYS.nationality),
    },
    chips,
    page: getPage(),
    setPage: (page: number) => update({ page }),
    removeChip: (chip: PipelineFilterChip) => clearKeys(chip.keys),
    clearAll: () => clearKeys([...PIPELINE_FILTER_KEYS]),
  };
}

export type PipelineFiltersState = ReturnType<typeof usePipelineFilters>;
