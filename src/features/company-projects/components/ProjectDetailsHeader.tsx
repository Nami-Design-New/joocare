'use client';

import type { CompanyProject } from '../types/company-projects.types';

type ProjectDetailsHeaderProps = {
  project: CompanyProject;
  candidateCount: number;
};

export default function ProjectDetailsHeader({
  project,
}: ProjectDetailsHeaderProps) {

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-foreground text-2xl font-bold sm:text-[28px]">
          {project.name}
        </h1>
      </div>

    </header>
  );
}
