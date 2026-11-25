// Every filter is optional, so a field can be unset.
export type TalentFilterValues = Record<string, string | string[] | undefined>;

// Where a select field loads its options from (see `useTalentLookups`).
export type TalentLookupKey =
  | 'categories'
  | 'certifications'
  | 'cities'
  | 'countries'
  | 'currencies'
  | 'domains'
  | 'education-levels'
  | 'employment-types'
  | 'experiences'
  | 'genders'
  | 'job-search-statuses'
  | 'job-titles'
  | 'languages'
  | 'last-active'
  | 'license-statuses'
  | 'marital-statuses'
  | 'notice-periods'
  | 'professional-licenses'
  | 'proficiency-levels'
  | 'seniority-levels'
  | 'sponsorship-requirements'
  | 'verification-statuses'
  | 'visa-statuses';

export type TalentFilterField = {
  /** Form field name and translation key (`fields.<key>`). */
  key: string;
  /** Query param sent to `candidates/search`; multi fields add `[]`. */
  param: string;
  kind?: 'text' | 'number' | 'multi';
  lookup?: TalentLookupKey;
  placeholder?: string;
  /** Fields emptied when this one changes (e.g. city after country). */
  resets?: string[];
};

export type TalentCandidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  nationality: string | null;
  score: number | null;
  cv: string | null;
  isPinned: boolean;
};

// Fixture rows for the features still on preview data (AI Talent Match, chat).
export type TalentPreviewCandidate = TalentCandidate & {
  attributes: TalentFilterValues;
};

export type TalentCandidatesPage = {
  candidates: TalentCandidate[];
  total: number;
  perPage: number;
};

export type TalentSearchFilters = {
  filters: TalentFilterValues;
  search: string;
  page: number;
};

export type ApiTalentCandidate = {
  id: number;
  name: string;
  image: string | null;
  nationality: { id: number; name: string } | null;
  email: string | null;
  phone_code: string | null;
  phone: string | null;
  ai_score: number | null;
  cv: string | null;
  is_pinned: boolean;
};

export type ApiTalentCandidatesPage = {
  data: ApiTalentCandidate[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type TalentMessageValues = { message: string };

// The message dialog only needs these, so other candidate lists can reuse it.
export type MessageRecipient = Pick<TalentCandidate, 'id' | 'name'>;
