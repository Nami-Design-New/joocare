"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { useRouter } from "@/i18n/navigation";
import { deleteEducation } from "../../services/education-client-service";
import type { CandidateEducationViewModel } from "../../types/profile.types";
import { EducationModal } from "./EducationModal";

const OneEducationSection = ({
  education,
}: {
  education: CandidateEducationViewModel;
}) => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteEducation = async () => {
    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteEducation({
        id: education.id,
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? "Education deleted successfully.");
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete education.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start justify-start gap-2">
          <div className="bg-accent rounded-full p-2">
            <Image
              src={"/assets/building-office-2.svg"}
              alt="building image"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{education.university}</h3>
            <p className="text-muted-foreground text-sm font-normal">
              {education.degree ?? "No degree details added yet."}
            </p>
            <span className="text-muted-foreground text-sm font-normal">
              {education.period ?? "No period added yet."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Edit
            width={20}
            height={20}
            className="text-muted-foreground cursor-pointer"
            onClick={() => setOpen(true)}
          />
          <Trash2
            width={20}
            height={20}
            className="cursor-pointer text-red-400"
            onClick={() => setDeleteOpen(true)}
          />
        </div>
      </div>

      <EducationModal
        label="Edit Education"
        open={open}
        onOpenChange={setOpen}
        education={education}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Do you want to delete this Education?"
        description="The Education will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteEducation}
        isLoading={isDeleting}
      />
    </>
  );
};

export default OneEducationSection;
