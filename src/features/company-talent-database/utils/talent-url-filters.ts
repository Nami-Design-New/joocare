import {
  mobilityQuestions,
  talentSearchFields,
} from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';

// URL keys besides the form fields (which use their own `key`).
export const TALENT_URL_KEYS = {
  view: 'view',
  page: 'page',
  search: 'search',
} as const;
export const TALENT_RESULTS_VIEW = 'results';

const multiKeys = new Set(
  talentSearchFields
    .filter((field) => field.kind === 'multi')
    .map((field) => field.key),
);
const singleKeys = [
  ...talentSearchFields
    .filter((field) => field.kind !== 'multi')
    .map((field) => field.key),
  ...mobilityQuestions.map(({ key }) => key),
];

// Reads the search form values back from a shared link.
export function readTalentFilters(params: URLSearchParams): TalentFilterValues {
  const values: TalentFilterValues = {};
  multiKeys.forEach((key) => {
    const items = params.getAll(key).filter(Boolean);
    if (items.length) values[key] = items;
  });
  singleKeys.forEach((key) => {
    const value = params.get(key);
    if (value) values[key] = value;
  });
  return values;
}

// Writes the filled form values as URL params; arrays repeat their key.
export function toTalentFilterParams(values: TalentFilterValues) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => params.append(key, item));
      return;
    }
    const trimmed = value?.trim();
    if (trimmed) params.set(key, trimmed);
  });
  return params;
}
