"use client";

import { Link } from "@/i18n/navigation";
import { useDeleteCompanyJob } from "@/features/jobs/hooks/useDeleteCompanyJob";
import { useUpdateCompanyJobStatus } from "@/features/jobs/hooks/useUpdateCompanyJobStatus";
import AlertModal from "@/shared/components/modals/AlertModal";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { CheckCheck, Edit, EyeOff, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { JobStatus } from "../types/index.types";
import { useTranslations } from "next-intl";

type JobActionButtonsProps = {
  jobId?: number | string;
  candidatesHref?: string;
  applicationsCount?: number;
  currentStatus?: JobStatus;
  deleteRedirectTo?: string;
};

export function JobActionButtons({
  jobId,
  candidatesHref,
  applicationsCount,
  currentStatus = "open",
  deleteRedirectTo,
}: JobActionButtonsProps) {
  const t = useTranslations();
  const [closeJob, setCloseJob] = useState(false);
  const [reactivateJob, setReactivateJob] = useState(false);
  const [pauseJob, setPauseJob] = useState(false);
  const [deleteJob, setDeleteJob] = useState(false);
  const { updateStatus, isPending } = useUpdateCompanyJobStatus(jobId, {
    onSuccess: () => {
      setCloseJob(false);
      setPauseJob(false);
      setReactivateJob(false);
      window.location.reload()
    },
  });
  const { deleteJob: deleteCompanyJob, isPending: isDeleting } = useDeleteCompanyJob(jobId, {
    redirectTo: deleteRedirectTo,
    onSuccess: () => {
      setDeleteJob(false);
    },
  });

  const handleCloseJob = () => {
    updateStatus("closed");
  };
  const handleReactivateJob = () => {
    updateStatus("open");
  };
  const handlePauseJob = () => {
    updateStatus("paused");
  };
  const handleOpenJob = () => {
    updateStatus("open");
  };
  const handleDeleteJob = () => {
    deleteCompanyJob();
  };

  const resolvedCompleteHref = jobId ? `/company/post-job?jobId=${jobId}` : "/company/post-job";
  const resolvedEditHref = jobId ? `/company/post-job?editId=${jobId}` : "/company/post-job";
  const isDraft = currentStatus === "draft";
  const isClosed = currentStatus === "closed";
  const isOpen = currentStatus === "open";
  const isPaused = currentStatus === "paused";

  return (
    <>
      <div className="flex w-full flex-wrap gap-3">
        {isOpen && (<>
          <Link
            href={resolvedEditHref}
            className={`${buttonVariants({
              variant: "default",
              size: "pill",
            })} items-center gap-2 max-sm:px-4`}
          >
            <Edit className="h-4 w-4" /> {t("common.edit")}
          </Link>
          <Button
            variant="default"
            size="pill"
            className="bg-destructive flex items-center gap-2 max-sm:px-4"
            disabled={isPending}
            onClick={() => setCloseJob(true)}
          >
            <CheckCheck className="h-4 w-4" /> {t("companyPage.jobs.actions.close")}
          </Button>
          <Button
            size="pill"
            className="bg-warning flex items-center gap-2 max-sm:px-4"
            disabled={isPending}
            onClick={() => setPauseJob(true)}
          >
            <EyeOff className="h-4 w-4" /> {t("companyPage.jobs.actions.pause")}
          </Button>
        </>
        )}
        {isDraft ? (
          <Link
            href={resolvedCompleteHref}
            className={`${buttonVariants({
              variant: "default",
              size: "pill",
            })} flex-1 items-center justify-center gap-2 max-sm:px-4`}
          >
            {t("companyPage.jobs.actions.complete-post")}
          </Link>
        ) : null}

        {isPaused ? (
          <Button
            variant="default"
            size="pill"
            className="flex-1 items-center justify-center gap-2 max-sm:px-4"
            disabled={isPending}
            onClick={() => setReactivateJob(true)}
          >
            <Play className="h-4 w-4" /> {t("companyPage.jobs.actions.resume")}
          </Button>
        ) : null}
        {isDraft && (
          <Button
            variant="destructive"
            size="pill"
            className={`flex-1 items-center justify-center gap-2 max-sm:px-4 `}
            disabled={isDeleting}
            onClick={() => setDeleteJob(true)}
          >
            <Trash2 className="h-4 w-4" /> {t("companyPage.jobs.actions.delete")}
          </Button>
        )}
      </div>
      <AlertModal
        open={closeJob}
        onOpenChange={setCloseJob}
        title={t("companyPage.jobs.card.modals.close.title")}
        description={t("companyPage.jobs.card.modals.close.description")}
        confirmLabel={t("companyPage.jobs.card.modals.close.confirm")}
        cancelLabel={t("common.back")}
        onConfirm={handleCloseJob}
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

export default JobActionButtons;
