export type MatchLevel = 'high' | 'good' | 'review' | 'limited' | 'low';

export type MatchLevelRange = {
  level: MatchLevel;
  min: number;
  max: number;
};

export type JobMatch = {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  employmentType: string;
  /** AI match score, 0–100. */
  score: number;
  highlights: string[];
};

export type JobPreferences = {
  domainIds: string[];
  /** A role category id, or `JOB_FUNCTION_BOTH`. */
  jobFunction: string;
  jobTitleIds: string[];
  companyIds: string[];
  countryIds: string[];
  seniorityLevelIds: string[];
  highMatchOnly: boolean;
};

export type JobPreferencesMode = 'add' | 'edit';

export type AiJobMatchScenario = 'results' | 'empty';
