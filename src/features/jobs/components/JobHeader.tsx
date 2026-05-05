import Image from "next/image";
import { ReactNode } from "react";
import { JobActionButtons } from "./JobActionButtons";
import JobStatusBadge from "./JobStatusBadge";
import { JobStatus } from "../types/index.types";
import PositionCard, { positionCardProps } from "./PositionCard";

type JobHeaderProps = positionCardProps & {
  status: JobStatus;
  closingDate: string;
  actions?: ReactNode;
};

export default function JobHeader({
  logoSrc,
  title,
  company,
  employmentType,
  status,
  closingDate,
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

      <div className="flex flex-col items-end gap-2">
        {actions ?? <JobActionButtons />}
        <JobStatusBadge status={status} closingDate={closingDate} />
      </div>
    </section>
  );
}
