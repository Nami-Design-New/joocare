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
            })} items-center gap-2`}
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
          <Button
            variant="default"
            size="pill"
            className="bg-destructive flex items-center gap-2"
            disabled={isPending}
            onClick={() => setCloseJob(true)}
          >
            <CheckCheck className="h-4 w-4" /> Close
          </Button>
          <Button
            size="pill"
            className="bg-warning flex items-center gap-2"
            disabled={isPending}
            onClick={() => setPauseJob(true)}
          >
            <EyeOff className="h-4 w-4" /> Pause
          </Button>
        </>
        )}
        {isDraft ? (
          <Link
            href={resolvedCompleteHref}
            className={`${buttonVariants({
              variant: "default",
              size: "pill",
            })} flex-1 items-center justify-center gap-2`}
          >
            Complete Post
          </Link>
        ) : null}

        {isPaused ? (
          <Button
            variant="default"
            size="pill"
            className="flex-1 items-center justify-center gap-2"
            disabled={isPending}
            onClick={() => setReactivateJob(true)}
          >
            <Play className="h-4 w-4" /> Resume
          </Button>
        ) : null}
        {isDraft && (
          <Button
            variant="destructive"
            size="pill"
            className={`flex-1 items-center justify-center gap-2 `}
            disabled={isDeleting}
            onClick={() => setDeleteJob(true)}
          >
            <Trash2 className="h-4 w-4" /> Deleted
          </Button>
        )}
      </div>
      <AlertModal
        open={closeJob}
        onOpenChange={setCloseJob}
        title="Has this position been successfully filled?"
        description="Closing this job posting will archive the role and remove it from visibility to medical professionals. Please ensure all relevant applicant details have been saved before proceeding."
        confirmLabel="Yes, close the advertisement."
        cancelLabel="Back"
        onConfirm={handleCloseJob}
        isLoading={isPending}
      />
      <AlertModal
        open={reactivateJob}
        onOpenChange={setReactivateJob}
        title="Would you like to resume accepting applications?"
        description="Reactivating this job posting will make it visible in search results and allow qualified medical professionals to apply immediately. All applicant activity will resume according to your previous posting settings."
        confirmLabel="Yes, active now"
        cancelLabel="Back"
        onConfirm={handleReactivateJob}
        isLoading={isPending}
      />
      <AlertModal
        open={pauseJob}
        onOpenChange={setPauseJob}
        confirmButtonVariant="destructive"
        title="Would you like to pause applications for this position?"
        description="Pausing this job posting will stop new applications from being submitted. The role will no longer appear in search results until it is reactivated."
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

export default JobActionButtons;
