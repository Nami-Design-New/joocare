import { Badge } from "@/shared/components/ui/badge";
import Image from "next/image";
import { JobActionButtons } from "./JobActionButtons";
import JobStatusBadge from "./JobStatusBadge";
import { JobStatus } from "../index.types";
import PositionCard, { positionCardProps } from "./PositionCard";

type JobHeaderProps = positionCardProps & {
  status: JobStatus;
  closingDate: string;
};

export default function JobHeader({
  logoSrc,
  title,
  company,
  employmentType,
  status,
  closingDate,
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
        <JobActionButtons />
        <JobStatusBadge status={status} closingDate={closingDate} />
      </div>
    </section>
  );
}
