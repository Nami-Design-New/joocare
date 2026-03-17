"use client";

import { Link } from "@/i18n/navigation";
import AlertModal from "@/shared/components/modals/AlertModal";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { CheckCheck, Edit, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

export function JobActionButtons() {
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
  return (
    <>
      <div className="flex gap-3">
        <Link
          href="/company/post-job"
          className={`${buttonVariants({
            variant: "secondary",
            size: "pill",
          })} flex items-center gap-2`}
        >
          <Edit className="h-4 w-4" /> Edit
        </Link>
        <Button
          variant="default"
          size="pill"
          className="flex items-center gap-2"
          onClick={() => setCloseJob(true)}
        >
          <CheckCheck className="h-4 w-4" /> Closed
        </Button>
        <Button
          size="pill"
          className="bg-foreground flex items-center gap-2"
          onClick={() => setPauseJob(true)}
        >
          <EyeOff className="h-4 w-4" /> Paused
        </Button>
        <Button
          variant="destructive"
          size="pill"
          className="flex items-center gap-2"
          onClick={() => setDeleteJob(true)}
        >
          <Trash2 className="h-4 w-4" /> Delete
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
