"use client";

import { Link } from "@/i18n/navigation";
import { useDeleteCompanyJob } from "@/features/jobs/hooks/useDeleteCompanyJob";
import { useUpdateCompanyJobStatus } from "@/features/jobs/hooks/useUpdateCompanyJobStatus";
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
  CircleDollarSign,
  CircleEllipsis,
  DollarSign,
  Dot,
  Edit,
  Edit2,
  EyeOff,
  MapPin,
  Play,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { JobListItem } from "../types/jobs.types";
import { getJobLocation, getJobSalary, normalizeJobStatus } from "../utils";
import { useQueryClient } from "@tanstack/react-query";

type JobCardProps = {
  job: Omit<JobListItem, 'status'> & {
    status?: {
      status: string;
      created_at: string;
    } | null;
    applications_count?: number;
  };
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
  const queryClient = useQueryClient();
  const { updateStatus, isPending } = useUpdateCompanyJobStatus(job.id, {
    onSuccess: () => {
      setCloseJob(false);
      setPauseJob(false);
    },
  });
  const { deleteJob: deleteCompanyJob, isPending: isDeleting } = useDeleteCompanyJob(job.id, {
    onSuccess: () => {
      setDeleteJob(false);
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
    },
  });

  const handleCloseJob = () => {
    updateStatus("closed");
  };
  const handlePauseJob = () => {
    updateStatus("paused");
  };
  const handleDeleteJob = () => {
    deleteCompanyJob();
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
  const excerpt = job?.description?.slice(0, 150) || "Explore the job details to learn more about the role and employer.";
  const statusLabel = (() => {
    const rawStatus = job.status?.status ?? "draft";
    return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  })();
  const statusDate = job.status?.created_at ?? job.updated_at ?? "";
  const normalizedStatus = normalizeJobStatus(job.status?.status ?? "draft");
  const handleOpenJob = () => {
    updateStatus("open");
  };

  { console.log(normalizedStatus, job) }

  return (
    <>
      <Card className="max-lg:py-2">
        <CardHeader className="flex gap-2 max-lg:px-2">
          <Image
            width={52}
            height={52}
            src={companyLogo || "/assets/comp-logo.svg"}
            alt={`${company} logo`}
            className="rounded-2xl w-14 h-12"
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
                <CircleEllipsis color="var(--muted-foreground)" className="cursor-pointer" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {(normalizedStatus === "open") && (<>
                  <DropdownMenuItem className="flex gap-2">
                    <Link
                      href={`/company/post-job?editId=${job.id}`}
                      className="flex gap-2 items-center w-full">
                      <Edit /> <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={() => setPauseJob(true)}
                  >
                    <EyeOff /> <span>Pause</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={() => setCloseJob(true)}
                  >
                    <CheckCheck /> <span>closed</span>
                  </DropdownMenuItem>
                </>
                )}

                {(normalizedStatus === "draft" || job.status?.status === undefined || job.status?.status === null) &&
                  <DropdownMenuItem className="flex gap-2">
                    <Link
                      href={`/company/post-job?jobId=${job.id}`}
                      className="flex gap-2 items-center w-full">
                      <Edit2 /> <span>Complete</span>
                    </Link>
                  </DropdownMenuItem>
                }
                {(normalizedStatus === "paused") &&
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={handleOpenJob}
                  >
                    <EyeOff /> <span>Reactive</span>
                  </DropdownMenuItem>
                }
                <DropdownMenuItem
                  className="text-destructive flex gap-2 cursor-pointer"
                  disabled={isDeleting}
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
                <CircleDollarSign size={14} color="var(--muted-foreground)" />
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
            {/* <p className="text-muted-foreground grow h-auto text-sm">{excerpt}</p> */}
            <div
              className="prose prose-sm max-w-none border-b pb-5"
              dangerouslySetInnerHTML={{
                __html:
                  excerpt ||
                  "<p>No description available.</p>",
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 max-lg:px-2 flex-1 justify-end ">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
            <Link
              className={` grow ${buttonVariants({
                variant: "secondary",
                size: "pill",
              })} lg:w-2/3`}
              href={`/company/job/candidates/${job.id}`}
            >
              View Candidates {job.applications_count}
            </Link>
            <Link
              className={`lg-max:py-2 lg-max:px-4 flex items-center gap-2 ${buttonVariants(
                {
                  variant: "default",
                  size: "pill",
                },
              )} lg:w-1/3`}
              href={`/company/job/${job.id}`}
            >
              View Details
              <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
            </Link>
          </div>
          <Badge
            variant={normalizedStatus}
            size="pill"
            className="flex w-full justify-start gap-1"
          >
            <Dot className="h-4 w-4" strokeWidth={12} /> <span>
              {statusLabel}
            </span>
            <span className="grow text-end">
              {statusDate}
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
        isLoading={isPending}
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
        isLoading={isPending}
      />
      <DeleteModal
        open={deleteJob}
        onOpenChange={setDeleteJob}
        title="Do you want to delete this advertisement?"
        description="The advertisement will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteJob}
        isLoading={isDeleting}
      />
    </>
  );
}
