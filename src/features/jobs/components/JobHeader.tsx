import { ReactNode } from 'react';
import { JobActionButtons } from './JobActionButtons';
import JobStatusBadge from './JobStatusBadge';
import { JobStatus } from '../types/index.types';
import PositionCard, { type PositionCardProps } from './PositionCard';

type JobHeaderProps = PositionCardProps & {
  status: JobStatus;
  statusDate?: string | null;
  actions?: ReactNode;
};

export default function JobHeader({
  logoSrc,
  title,
  company,
  employmentType,
  status,
  statusDate,
  actions,
}: JobHeaderProps) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <PositionCard
        logoSrc={logoSrc}
        title={title}
        company={company}
        employmentType={employmentType}
      />

      {/* Buttons and status bar share one width, as in Figma (3 × 131px). */}
      <div className="flex w-full flex-col gap-4 md:w-102">
        {actions ?? <JobActionButtons />}
        <JobStatusBadge status={status} date={statusDate} />
      </div>
    </section>
  );
}
