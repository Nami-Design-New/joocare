'use client';

import { useEffect, useState } from 'react';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import { PROJECT_SEARCH_DEBOUNCE_MS } from '../constants/project-queries';
import { ALL_PROJECT_RECRUITERS_VALUE } from '../constants/project-preview-data';
import type { CompanyProject } from '../types/company-projects.types';
import { useDeleteProject } from './useDeleteProject';
import { useGetProjects } from './useGetProjects';
import { useRenameProject } from './useRenameProject';

// Projects list from the API. Closing and the recruiter filter have no API
// yet, so they stay local preview state on top of the API data.
export function useCompanyProjects() {
  const url = useUrlFilters();
  const urlSearch = url.get('search');
  const recruiter = url.get('recruiter');
  const page = url.getPage();
  const { update } = url;
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [closedIds, setClosedIds] = useState<string[]>([]);
  const query = useGetProjects(urlSearch, page);
  const renameMutation = useRenameProject();
  const deleteMutation = useDeleteProject();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== urlSearch) update({ search: next, page: null });
    }, PROJECT_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, urlSearch, update]);

  const projects: CompanyProject[] = (query.data?.items ?? []).map(
    (project) => ({
      ...project,
      isClosed: closedIds.includes(project.id),
    }),
  );

  return {
    query,
    projects,
    total: query.data?.total ?? 0,
    pageSize: query.data?.perPage ?? 0,
    search: searchInput,
    setSearch: setSearchInput,
    recruiter,
    setRecruiter: (value: string) =>
      update({
        recruiter: value === ALL_PROJECT_RECRUITERS_VALUE ? '' : value,
      }),
    page,
    setPage: (nextPage: number) => update({ page: nextPage }),
    isRenaming: renameMutation.isPending,
    renameProject: (id: string, name: string) =>
      renameMutation.mutateAsync({ projectId: id, name }),
    isDeleting: deleteMutation.isPending,
    removeProject: async (id: string) => {
      await deleteMutation.mutateAsync(id);
      // Step back when the last project of a page is deleted.
      if (projects.length === 1 && page > 1) update({ page: page - 1 });
    },
    closeProject: (id: string) =>
      setClosedIds((current) => [...new Set([...current, id])]),
  };
}
