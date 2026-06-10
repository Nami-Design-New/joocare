"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations();
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteEducation = async () => {
    if (!session?.accessToken) {
      toast.error(t("candidatePage.toasts.session-expired"));
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteEducation({
        id: education.id,
        locale,
        token: session.accessToken,
      });

      toast.success(response?.message ?? t("candidatePage.toasts.education-deleted"));
      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("candidatePage.toasts.education-delete-failed");
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
              alt={t("candidatePage.profile.building-image")}
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold md:text-lg">{education.university}</h3>
            <div className="flex gap-2 items-center">
              <p className="text-muted-foreground text-xs font-normal md:text-sm">
                {education.degree ?? t("candidatePage.profile.no-degree-details")}
              </p>
              <p className="text-muted-foreground text-[10px] font-normal md:text-xs">
                ( {`${education.gpa}`} )
              </p>
            </div>
            <span className="text-muted-foreground text-xs font-normal md:text-sm">
              {education.educationPeriod ?? t("candidatePage.profile.no-period")}
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
        label={t("candidatePage.profile.edit-education")}
        open={open}
        onOpenChange={setOpen}
        education={education}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("candidatePage.profile.delete-education-title")}
        description={t("candidatePage.profile.delete-education-description")}
        cancelLabel={t("candidatePage.common.back")}
        onConfirm={handleDeleteEducation}
        isLoading={isDeleting}
      />
    </>
  );
};

export default OneEducationSection;
