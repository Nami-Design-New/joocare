export const PROJECTS_PAGE_SIZE = 6;
export const PROJECT_SEARCH_DEBOUNCE_MS = 400;
export const PROJECT_OPTIONS_PAGE_SIZE = 10;
export const PROJECT_OPTIONS_QUERY_KEY = 'company-project-options';

export const projectQueryKeys = {
  projects: (locale: string, search: string, page: number) => [
    'company-projects',
    locale,
    search,
    page,
  ],
  hiringManagers: (locale: string) => ['company-hiring-managers', locale],
  projectCandidates: (locale: string, projectId: string) => [
    'company-project-candidates',
    locale,
    projectId,
  ],
  project: (locale: string, projectId: string) => [
    'company-project',
    locale,
    projectId,
  ],
};

// Invalidated after a project is created, renamed or deleted.
export const PROJECT_QUERY_PREFIXES = [
  ['company-projects'],
  ['company-project'],
  ['company-project-candidates'],
  [PROJECT_OPTIONS_QUERY_KEY],
];

// The app turns refetchOnMount off globally; these refetch on mount only when
// stale, so a list opened after a change shows fresh data.
export const REFETCH_STALE_ON_MOUNT = { refetchOnMount: true } as const;

// Avatar shown when a project candidate has no profile image.
export const CANDIDATE_AVATAR_FALLBACK =
  '/assets/company-projects/candidate-avatar.png';

// Shown where the projects API has no data yet.
export const MISSING_API_VALUE = '#';
