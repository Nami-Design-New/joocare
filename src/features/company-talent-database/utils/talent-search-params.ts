import {
  mobilityQuestions,
  talentSearchFields,
} from '../constants/talent-filters';
import type { TalentFilterValues } from '../types/talent-database.types';

const YES_NO_PARAM_VALUES: Record<string, string> = { yes: '1', no: '0' };

// Country fields of a mobility question only count when it is answered "yes".
const hiddenMobilityFields = (filters: TalentFilterValues) =>
  new Set(
    mobilityQuestions
      .filter(({ key }) => filters[key] !== 'yes')
      .flatMap(({ countries }) => countries.map((field) => field.key)),
  );

// Turns the search form values into `candidates/search` query params; empty values are skipped.
export function appendTalentFilterParams(
  params: URLSearchParams,
  filters: TalentFilterValues,
) {
  const hidden = hiddenMobilityFields(filters);

  mobilityQuestions.forEach(({ key, param }) => {
    const value = YES_NO_PARAM_VALUES[String(filters[key])];
    if (value) params.set(param, value);
  });

  talentSearchFields.forEach(({ key, param, kind }) => {
    if (hidden.has(key)) return;
    const value = filters[key];
    if (Array.isArray(value)) {
      value
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => params.append(`${param}[]`, item));
      return;
    }
    const trimmed = value?.trim();
    if (!trimmed) return;
    params.set(kind === 'multi' ? `${param}[]` : param, trimmed);
  });
}
