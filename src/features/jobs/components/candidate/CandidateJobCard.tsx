"use client"
import { Link } from "@/i18n/navigation";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import {
  getJobLocation,
  getJobSalary,
} from "@/features/jobs/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  Dot,
  MapPin,
  Share,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useJobShare } from "../../hooks/useJobShare";
import ToggleSavedJobButton from "./ToggleSavedJobButton";

type CandidateJobCardProps = {
  job: JobListItem;
  href?: string;
  appliedBadge?: boolean;
  appliedAtLabel?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
};

export default function CandidateJobCard({
  job,
  href = "/jobs",
  appliedBadge,
  appliedAtLabel,
  onSavedChange,
}: CandidateJobCardProps) {
  const { data: session } = useSession();
  const title = job.title || job.job_title?.title || "Healthcare Opportunity";
  const company = job.company?.name || "Joocare Employer";
  const companyLogo = job.company?.image;
  const postedAtLabel = job.created_at;
  const location = getJobLocation(job);
  const category = job?.category?.title || "Not specified";
  const employmentType = job?.employment_type?.title || "Not specified";
  const salary = getJobSalary(job);
  const experience = job.experience?.title || "Experience not specified";
  const specialty = job.specialty?.title || "Healthcare";
  const excerpt =
    job.description || "Explore the job details to learn more about the role and employer.";
  const shouldShowAppliedBadge = appliedBadge || job.is_applied;
  const appliedLabel = appliedAtLabel || postedAtLabel;
  const { shareJob } = useJobShare({ title, path: href });
  const isEmployer = session?.authRole === "employer";

  return (
    <Card>
      <CardHeader className="flex gap-2 max-lg:px-2">
        <Image
          width={52}
          height={46}
          src={companyLogo || "/assets/comp-logo.svg"}
          alt={`${company} logo`}
        />
        <div className="flex grow flex-col gap-1">
          <h6 className="text-secondary text-lg font-semibold">
            {title}
          </h6>
          <p className="text-foreground text-md font-normal">{company}</p>
          <time className="text-muted-foreground text-xs font-normal">
            {postedAtLabel}
          </time>
        </div>
        {/* <p className="text-[12px]">{domain}</p> */}
      </CardHeader>
      <CardContent className="max-lg:px-2 grow">
        <div className=" flex flex-col gap-4  ">
          <ul className="items-cente flex gap-2">
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <MapPin size={14} color="var(--muted-foreground)" />
              {location}
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <Briefcase size={14} color="var(--muted-foreground)" />
              {category}
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <DollarSign size={14} color="var(--muted-foreground)" />
              {salary}
            </li>
          </ul>
          <ul className="items-cente flex gap-2">
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {experience}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {employmentType}
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              {specialty}
            </li>
          </ul>
          <p className="text-muted-foreground grow h-auto text-sm">{excerpt}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4  max-lg:px-2">
        <div className="flex w-full items-center justify-between gap-2 border-b-border border-t pt-4">
          <div className="flex gap-2">
            {!isEmployer ? (
              <ToggleSavedJobButton
                jobId={job.id}
                initialIsSaved={job.is_saved}
                onSavedChange={onSavedChange}
              />
            ) : null}
            <Button
              variant="outline"
              size="pill"
              className="border-border text-muted-foreground h-9 px-4 py-2 text-sm"
              onClick={() => void shareJob()}
            >
              <Share /> Share
            </Button>
          </div>
          <Link
            className={`border-border bg-primary flex h-9 items-center gap-2 rounded-full px-3 py-2 text-sm text-white`}
            href={href}
          >
            View Job
            <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
          </Link>
        </div>
        {shouldShowAppliedBadge && (
          <Badge
            variant="open"
            size="pill"
            className="flex w-full justify-start gap-1"
          >
            <Dot className="h-4 w-4" strokeWidth={12} /> <span>Applied</span>
            <span className="grow text-end text-xs text-muted-foreground">{appliedLabel}</span>
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
