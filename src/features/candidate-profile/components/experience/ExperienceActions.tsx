'use client';

import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteExperience } from "../../services/experience-client-service";
import type { CandidateExperienceViewModel } from "../../types/profile.types";
import { ExperienceModal } from "./ExperienceModal";

export default function ExperienceActions({
  experience,
}: {
  experience: CandidateExperienceViewModel;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteExperience = async () => {
    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteExperience({
        id: experience.id,
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? "Experience deleted successfully.");
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete experience.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Edit
          width={20}
          height={20}
          className="cursor-pointer text-muted-foreground"
          onClick={() => setOpen(true)}
        />
        <Trash2
          width={20}
          height={20}
          className="cursor-pointer text-red-400"
          onClick={() => setDeleteOpen(true)}
        />
      </div>

      <ExperienceModal
        label="Edit Experience"
        open={open}
        onOpenChange={setOpen}
        experience={experience}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Do you want to delete this Experience?"
        description="The Experience will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteExperience}
        isLoading={isDeleting}
      />
    </>
  );
}
