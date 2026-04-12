"use client";

import { Link } from "@/i18n/navigation";
import AlertModal from "@/shared/components/modals/AlertModal";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  ArrowRight,
  Briefcase,
  CheckCheck,
  CircleEllipsis,
  DollarSign,
  Dot,
  Edit,
  EyeOff,
  LocationEdit,
  MapPin,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { JobListItem } from "../types/jobs.types";
import { getJobLocation, getJobSalary } from "../utils";

type JobCardProps = {
  job: JobListItem;
  href?: string;
  appliedBadge?: boolean;
  appliedAtLabel?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
  resumeMatch?: boolean
};


export default function JobCard({ resumeMatch,
  job,
  href = "",
  appliedBadge,
  appliedAtLabel,
  onSavedChange

}: JobCardProps) {
  const [closeJob, setCloseJob] = useState(false);
  const [pauseJob, setPauseJob] = useState(false);
  const [deleteJob, setDeleteJob] = useState(false);
  const handleCloseJob = () => {
    setCloseJob(false);
  };
  const handlePauseJob = () => {
    setPauseJob(false);
  };
  const handleDeleteJob = () => {
    setDeleteJob(false);
  };


  const title = job?.job_title?.title || "Healthcare Opportunity3";
  const company = job?.company?.name || "Joocare Employer";
  const companyLogo = job?.company?.image;
  const postedAtLabel = job?.created_at;
  const location = getJobLocation(job);
  const category = job?.category?.title || "Not specified";
  const employmentType = job?.employment_type?.title || "Not specified";
  const salary = getJobSalary(job);
  const experience = job?.experience?.title || "Experience not specified";
  const specialty = job?.specialty?.title || "Healthcare";
  const excerpt = job?.description || "Explore the job details to learn more about the role and employer.";
  const shouldShowAppliedBadge = appliedBadge || job?.is_applied;
  const appliedLabel = appliedAtLabel || postedAtLabel;

  return (
    <>
      <Card className="max-lg:py-2">
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
          {/* Dropdown menu for job actions  or resume match*/}

          {!resumeMatch ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CircleEllipsis color="var(--muted-foreground)" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex gap-2">
                  <Edit /> <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2"
                  onClick={() => setCloseJob(true)}
                >
                  <CheckCheck /> <span>closed</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2"
                  onClick={() => setPauseJob(true)}
                >
                  <EyeOff /> <span>Pause</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive flex gap-2"
                  onClick={() => setDeleteJob(true)}
                >
                  <Trash2 color="var(--destructive)" /> <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p className="text-secondary text-[12px]">Resume Match</p>
          )}
        </CardHeader>
        <CardContent className="max-lg:px-2">
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
        <CardFooter className="flex flex-col gap-4 max-lg:px-2">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <Link
              className={` grow ${buttonVariants({
                variant: "secondary",
                size: "pill",
              })} `}
              href={`/company/job/candidates/${job.id}`}
            >
              View Candidates 280
            </Link>
            <Link
              className={`lg-max:py-2 lg-max:px-4 flex items-center gap-2 ${buttonVariants(
                {
                  variant: "default",
                  size: "pill",
                },
              )}`}
              href={`/company/job/medical/${job.id}`}
            >
              View Details
              <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
            </Link>
          </div>
          <Badge
            variant="open"
            size="pill"
            className="flex w-full justify-start gap-1"
          >
            <Dot className="h-4 w-4" strokeWidth={12} /> <span>
              {job.status.status}
            </span>
            <span className="grow text-end">
              {
                job.status.created_at}
            </span>
          </Badge>
        </CardFooter>
      </Card>
      <AlertModal
        open={closeJob}
        onOpenChange={setCloseJob}
        title="Was the recruitment process successful?"
        description="By closing this advertisement, it will be moved to the archive and will not be visible to medical staff again. Please ensure that you have saved the details of the applicants you wish to contact later."
        confirmLabel="Yes, close the advertisement."
        cancelLabel="Back"
        onConfirm={handleCloseJob}
      />
      <AlertModal
        open={pauseJob}
        onOpenChange={setPauseJob}
        confirmButtonVariant="destructive"
        title="Are you sure you want to stop your advertisement?"
        description="Stopping the advertisement means halting the flow of new applicants. Are you sure you want to disable this post now"
        confirmLabel="Yes, stop the advertisement"
        cancelLabel="Back"
        onConfirm={handlePauseJob}
      />
      <DeleteModal
        open={deleteJob}
        onOpenChange={setDeleteJob}
        title="Do you want to delete this advertisement?"
        description="The advertisement will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteJob}
      />
    </>
  );
}
