'use client';

import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations();
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteExperience = async () => {
    if (!session?.accessToken) {
      toast.error(t("candidatePage.toasts.session-expired"));
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteExperience({
        id: experience.id,
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? t("candidatePage.toasts.experience-deleted"));
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("candidatePage.toasts.experience-delete-failed");
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
        label={t("candidatePage.profile.edit-experience")}
        open={open}
        onOpenChange={setOpen}
        experience={experience}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("candidatePage.profile.delete-experience-title")}
        description={t("candidatePage.profile.delete-experience-description")}
        cancelLabel={t("candidatePage.common.back")}
        onConfirm={handleDeleteExperience}
        isLoading={isDeleting}
      />
    </>
  );
}
