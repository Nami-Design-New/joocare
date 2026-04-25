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
  const [pauseJob, setPauseJob] = useState(false);
  const [deleteJob, setDeleteJob] = useState(false);
  const { updateStatus, isPending } = useUpdateCompanyJobStatus(jobId, {
    onSuccess: () => {
      setCloseJob(false);
      setPauseJob(false);
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
              variant: "secondary",
              size: "pill",
            })} items-center gap-2`}
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
          <Button
            variant="default"
            size="pill"
            className="flex items-center gap-2"
            disabled={isPending}
            onClick={() => setCloseJob(true)}
          >
            <CheckCheck className="h-4 w-4" /> Closed
          </Button>
          <Button
            size="pill"
            className="bg-foreground flex items-center gap-2"
            disabled={isPending}
            onClick={() => setPauseJob(true)}
          >
            <EyeOff className="h-4 w-4" /> Paused
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
            onClick={handleOpenJob}
          >
            <Play className="h-4 w-4" /> Resume
          </Button>
        ) : null}

        <Button
          variant="destructive"
          size="pill"
          className={`flex-1 items-center justify-center gap-2 `}
          disabled={isDeleting}
          onClick={() => setDeleteJob(true)}
        >
          <Trash2 className="h-4 w-4" /> Deleted
        </Button>
      </div>
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

export default JobActionButtons;
