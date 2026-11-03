'use client';

import { useMemo, useState } from 'react';
import { useUrlFilters } from '@/shared/hooks/useUrlFilters';
import {
  ALL_PROJECT_RECRUITERS_VALUE,
  projectPreviewData,
} from '../constants/project-preview-data';
import type { CompanyProject } from '../types/company-projects.types';

export function useCompanyProjectsPreview() {
  const url = useUrlFilters();
  const [projects, setProjects] = useState(projectPreviewData);
  const [search, setSearch] = useState(url.get('search'));
  const recruiter = url.get('recruiter');
  const page = url.getPage();
  const setPage = (nextPage: number) => url.update({ page: nextPage });
  const pageSize = 6;

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLocaleLowerCase()
        .includes(normalizedSearch);
      const matchesRecruiter = !recruiter || project.recruiter === recruiter;
      return matchesSearch && matchesRecruiter;
    });
  }, [projects, recruiter, search]);

  const visibleProjects = filteredProjects.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const updateProject = (
    id: string,
    update: (project: CompanyProject) => CompanyProject,
  ) => {
    setProjects((current) =>
      current.map((project) => (project.id === id ? update(project) : project)),
    );
  };

  const renameProject = (id: string, name: string) => {
    updateProject(id, (project) => ({ ...project, name }));
  };

  const removeProject = (id: string) => {
    const remainingCount = filteredProjects.filter(
      (project) => project.id !== id,
    ).length;
    setProjects((current) => current.filter((project) => project.id !== id));
    setPage(Math.min(page, Math.max(1, Math.ceil(remainingCount / pageSize))));
  };

  const shareProject = (id: string, manager: string) => {
    const managerEmail =
      hiringManagerEmails[manager] ?? 'hiring.manager@example.com';
    updateProject(id, (project) => ({
      ...project,
      shareLogs: [
        {
          id: `${id}-${Date.now()}`,
          manager,
          managerEmail,
          sharedBy: 'Sara Al-Qahtani',
          sharedByRole: 'Recruiter',
          date: 'Today',
          time: '10:30 AM',
        },
        ...project.shareLogs,
      ],
    }));
  };

  const closeProject = (id: string) => {
    updateProject(id, (project) => ({ ...project, isClosed: true }));
  };

  return {
    projects,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      url.update({ search: value.trim(), page: null });
    },
    recruiter,
    setRecruiter: (value: string) =>
      url.update({
        recruiter: value === ALL_PROJECT_RECRUITERS_VALUE ? '' : value,
        page: null,
      }),
    page,
    setPage,
    pageSize,
    filteredProjects,
    visibleProjects,
    renameProject,
    removeProject,
    closeProject,
    shareProject,
  };
}

const hiringManagerEmails: Record<string, string> = {
  'Khalid Al-Mutairi': 'khalid@example.com',
  'Maha Hassan': 'maha@example.com',
  'Noura Al-Harbi': 'noura@example.com',
};
