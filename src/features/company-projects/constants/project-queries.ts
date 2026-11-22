export const PROJECTS_PAGE_SIZE = 6;
export const PROJECT_SEARCH_DEBOUNCE_MS = 400;

export const projectQueryKeys = {
  projects: (locale: string, search: string, page: number) => [
    'company-projects',
    locale,
    search,
    page,
  ],
  project: (locale: string, projectId: string) => [
    'company-project',
    locale,
    projectId,
  ],
};

// Invalidated after a project is renamed or deleted.
export const PROJECT_QUERY_PREFIXES = [
  ['company-projects'],
  ['company-project'],
];

// The app turns refetchOnMount off globally; these refetch on mount only when
// stale, so a list opened after a change shows fresh data.
export const REFETCH_STALE_ON_MOUNT = { refetchOnMount: true } as const;
