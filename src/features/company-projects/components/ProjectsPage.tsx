'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CustomPagination } from '@/shared/components/CustomPagination';
import EmptyDataState from '@/shared/components/EmptyDataState';
import SearchInput from '@/shared/components/SearchInput';
import { SelectInputField } from '@/shared/components/SelectInputField';
import {
  ALL_PROJECT_RECRUITERS_VALUE,
  projectRecruiters,
} from '../constants/project-preview-data';
import { useCompanyProjectsPreview } from '../hooks/useCompanyProjectsPreview';
import type { ProjectAction } from '../types/company-projects.types';
import ProjectActionModals from './Modals/ProjectActionModals';
import ProjectCard from './ProjectCard';

export default function ProjectsPage() {
  const t = useTranslations('companyPage.projects');
  const preview = useCompanyProjectsPreview();
  const [action, setAction] = useState<ProjectAction>(null);
  const activeProject =
    preview.projects.find((project) => project.id === action?.projectId) ??
    null;
  // A recruiter can arrive from the URL (e.g. Recruiter Activity) before it is in the list.
  const recruiters =
    preview.recruiter && !projectRecruiters.includes(preview.recruiter)
      ? [...projectRecruiters, preview.recruiter]
      : projectRecruiters;
  const recruiterOptions = [
    { value: ALL_PROJECT_RECRUITERS_VALUE, label: t('all-recruiters') },
    ...recruiters.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
        <SearchInput
          value={preview.search}
          onChange={(event) => preview.setSearch(event.currentTarget.value)}
          placeholder={t('search-placeholder')}
        />
        <SelectInputField
          id="projects-recruiter-filter"
          aria-label={t('recruiter-filter')}
          options={recruiterOptions}
          value={preview.recruiter}
          onChange={preview.setRecruiter}
          placeholder={t('recruiter-filter')}
          allowDeselect
          className="h-13 border-border bg-card"
        />
      </div>

      {preview.visibleProjects.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {preview.visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onShare={() =>
                setAction({ type: 'share', projectId: project.id })
              }
              onShowLog={() =>
                setAction({ type: 'log', projectId: project.id })
              }
              onRename={() =>
                setAction({ type: 'edit', projectId: project.id })
              }
              onCloseProject={() =>
                setAction({ type: 'close', projectId: project.id })
              }
              onDelete={() =>
                setAction({ type: 'delete', projectId: project.id })
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-card p-5 text-center sm:p-8">
          <EmptyDataState
            title="companyPage.projects.empty-title"
            description={t('empty-description')}
          />
        </div>
      )}

      {preview.filteredProjects.length > preview.pageSize && (
        <CustomPagination
          totalItems={preview.filteredProjects.length}
          pageSize={preview.pageSize}
          currentPage={preview.page}
          onPageChange={preview.setPage}
          statusPosition="start"
          tone="strong"
          align="start"
        />
      )}

      <ProjectActionModals
        action={action}
        project={activeProject}
        onClose={() => setAction(null)}
        onShare={preview.shareProject}
        onRename={preview.renameProject}
        onCloseProject={preview.closeProject}
        onDelete={preview.removeProject}
      />
    </div>
  );
}
