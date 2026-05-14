"use client";

import { useDeleteCompanyJob } from "@/features/jobs/hooks/useDeleteCompanyJob";
import { useUpdateCompanyJobStatus } from "@/features/jobs/hooks/useUpdateCompanyJobStatus";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCheck,
  CircleDollarSign,
  CircleEllipsis,
  Dot,
  Edit,
  Edit2,
  EyeOff,
  MapPin,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { JobListItem } from "../types/jobs.types";
import { getJobLocation, getJobSalaryWithCurrency, normalizeJobStatus } from "../utils";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations();
  const locale = useLocale()
  const [closedJob, setClosedJob] = useState(false);
  const [reactivateJob, setReactivateJob] = useState(false);
  const [pauseJob, setPauseJob] = useState(false);
  const [deleteJob, setDeleteJob] = useState(false);
  const queryClient = useQueryClient();
  const { updateStatus, isPending } = useUpdateCompanyJobStatus(job.id, {
    onSuccess: () => {
      setClosedJob(false);
      setReactivateJob(false);
      setPauseJob(false);
    },
  });
  const { deleteJob: deleteCompanyJob, isPending: isDeleting } = useDeleteCompanyJob(job.id, {
    onSuccess: () => {
      setDeleteJob(false);
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
    },
  });

  const handleClosedJob = () => {
    updateStatus("closed");
  };
  const handleReactivateJob = () => {
    updateStatus("open");
  };
  const handlePauseJob = () => {
    updateStatus("paused");
  };
  const handleDeleteJob = () => {
    deleteCompanyJob();
  };


  // console.log(job);

  const title =
    job?.job_title?.title ||
    job?.title ||
    t("companyPage.postJob.review.untitledJob");
  const company = job?.company?.name || t("jobsPage.joocare-employer");
  const companyLogo = job?.company?.image;
  const postedAtLabel = job?.current_status?.updated_at;
  const location = getJobLocation(job, t("jobsPage.location-not-specified"));
  const category =
    job?.category?.title || job?.category_title || t("jobsPage.not-specified");
  const employmentType =
    job?.employment_type?.title || t("jobsPage.not-specified");
  const salary = getJobSalaryWithCurrency(job, t("jobsPage.not-specified"));
  const experience =
    job?.experience?.title ||
    job?.experience_title ||
    t("jobsPage.experience-not-specified");
  const specialty =
    job?.specialty?.title || job?.specialty_title || t("jobsPage.healthcare");
  // const excerpt =
  //   job?.description?.slice(0, 70) || t("jobsPage.card-description-fallback");
  const plainDescription =
    typeof window !== "undefined"
      ? new DOMParser()
        .parseFromString(job.description || "", "text/html")
        .body.textContent || ""
      : "";

  const excerpt =
    plainDescription.slice(0, 70) ||
    t("jobsPage.card-description-fallback");

  const statusDate = job.status?.created_at ?? job.updated_at ?? "";
  const normalizedStatus = normalizeJobStatus(job.status?.status ?? "draft");
  const statusLabel = t(`companyPage.jobs.status.${normalizedStatus}`);

  // { console.log(normalizedStatus, job) }

  return (
    <>
      <Card className="max-lg:py-2 group hover:border-primary">
        <CardHeader className="flex gap-2 max-lg:px-2">
          <Image
            width={52}
            height={52}
            src={companyLogo || "/assets/new-logo-dot.svg"}
            alt={t("companyPage.postJob.review.companyLogoAlt")}
            className="rounded-2xl w-14 h-12"
          />
          <div className="flex grow flex-col gap-1">
            <h6 className="text-secondary text-lg font-semibold group-hover:text-primary">
              {title}
            </h6>
            <p className="text-foreground text-md font-normal">{company}</p>
            <time className="text-muted-foreground text-xs font-normal">
              {!["draft", "open"].includes(normalizedStatus) && postedAtLabel}
              {(normalizedStatus === "open") && statusDate}
              { }
            </time>
          </div>
          {/* Dropdown menu for job actions  or resume match*/}

          {!resumeMatch ? (
            <DropdownMenu>
              {(normalizedStatus !== "closed") &&
                <DropdownMenuTrigger asChild>
                  <CircleEllipsis color="var(--muted-foreground)" className="cursor-pointer" />
                </DropdownMenuTrigger>
              }

              <DropdownMenuContent align="end">
                {(normalizedStatus === "open") && (<>
                  <DropdownMenuItem className="flex gap-2">
                    <Link
                      href={`/company/post-job?editId=${job.id}`}
                      className="flex gap-2 items-center w-full">
                      <Edit /> <span>{t("common.edit")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={() => setPauseJob(true)}
                  >
                    <EyeOff /> <span>{t("companyPage.jobs.actions.pause")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={() => setClosedJob(true)}
                  >
                    <CheckCheck /> <span>{t("companyPage.jobs.actions.close")}</span>
                  </DropdownMenuItem>
                </>
                )}

                {(normalizedStatus === "draft" || job.status?.status === undefined || job.status?.status === null) &&
                  <DropdownMenuItem className="flex gap-2">
                    <Link
                      href={`/company/post-job?jobId=${job.id}`}
                      className="flex gap-2 items-center w-full">
                      <Edit2 /> <span>{t("companyPage.jobs.actions.complete-post")}</span>
                    </Link>
                  </DropdownMenuItem>
                }
                {(normalizedStatus === "paused") &&
                  <DropdownMenuItem
                    className="flex gap-2 cursor-pointer"
                    disabled={isPending}
                    onClick={() => setReactivateJob(true)}
                  >
                    <EyeOff /> <span>{t("companyPage.jobs.actions.resume")}</span>
                  </DropdownMenuItem>
                }
                {(normalizedStatus === "draft") &&
                  <DropdownMenuItem
                    className="text-destructive flex gap-2 cursor-pointer"
                    disabled={isDeleting}
                    onClick={() => setDeleteJob(true)}
                  >
                    <Trash2 color="var(--destructive)" /> <span>{t("companyPage.jobs.actions.delete")}</span>
                  </DropdownMenuItem>
                }
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p className="text-secondary text-[12px]">{t("companyPage.jobs.card.resume-match")}</p>
          )}
        </CardHeader>
        <CardContent className="max-lg:px-2">
          <div className=" flex flex-col gap-4  ">
            <ul className="items-cente flex gap-2">
              <li className="text-secondary flex items-start gap-1 text-sm font-normal">
                <MapPin size={14} color="var(--muted-foreground)" />
                {location}
              </li>
              <li className="text-secondary flex items-start gap-1 text-sm font-normal">
                <Briefcase size={14} color="var(--muted-foreground)" />
                {category}
              </li>
              <li className="text-secondary flex items-start gap-1 text-sm font-normal">
                <CircleDollarSign size={14} color="var(--muted-foreground)" />
                {job.has_salary ? salary : t("jobsPage.not-specified")}
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
            {/* <div
              className="prose prose-sm max-w-none border-b pb-5 mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  excerpt ||
                  `<p>${t("jobsPage.no-description-available")}</p>`,
              }}
            /> */}
            <div className="prose prose-sm max-w-none mt-3">
              {excerpt || t("jobsPage.no-description-available")}
            </div>
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
              {t("companyPage.jobs.card.view-candidates")} {job.applications_count}
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
              {t("companyPage.jobs.card.view-details")}
              {locale === 'ar' ? (
                <ArrowLeft size={18} strokeWidth={1.5} className="size-5" />
              ) : (
                <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
              )}
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
              {normalizedStatus !== "open" && statusDate}
            </span>
          </Badge>
        </CardFooter>
      </Card>
      <AlertModal
        open={closedJob}
        onOpenChange={setClosedJob}
        title={t("companyPage.jobs.card.modals.close.title")}
        description={t("companyPage.jobs.card.modals.close.description")}
        confirmLabel={t("companyPage.jobs.card.modals.close.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handleClosedJob}
        isLoading={isPending}
      />
      <AlertModal
        open={reactivateJob}
        onOpenChange={setReactivateJob}
        title={t("companyPage.jobs.card.modals.reactivate.title")}
        description={t("companyPage.jobs.card.modals.reactivate.description")}
        confirmLabel={t("companyPage.jobs.card.modals.reactivate.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handleReactivateJob}
        isLoading={isPending}
      />
      <AlertModal
        open={pauseJob}
        onOpenChange={setPauseJob}
        confirmButtonVariant="destructive"
        title={t("companyPage.jobs.card.modals.pause.title")}
        description={t("companyPage.jobs.card.modals.pause.description")}
        confirmLabel={t("companyPage.jobs.card.modals.pause.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handlePauseJob}
        isLoading={isPending}
      />
      <DeleteModal
        open={deleteJob}
        onOpenChange={setDeleteJob}
        title={t("companyPage.jobs.card.modals.delete.title")}
        description={t("companyPage.jobs.card.modals.delete.description")}
        confirmLabel={t("companyPage.jobs.card.modals.delete.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handleDeleteJob}
        isLoading={isDeleting}
      />
    </>
  );
}
