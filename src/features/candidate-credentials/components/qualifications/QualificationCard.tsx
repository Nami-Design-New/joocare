"use client";

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import DeleteModal from "@/shared/components/modals/DeleteModal";
import { deleteQualificationAction } from "../../actions/qualification-actions";
import { qualificationsQueryKeyPrefix } from "../../hooks/useGetQualifications";
import { removeInfiniteItem } from "../../services/infinite-query-cache";
import type { QualificationViewModel } from "../../types/qualification.types";
import { QualificationModal } from "./QualificationModal";

export default function QualificationCard({
  qualification,
}: {
  qualification: QualificationViewModel;
}) {
  const [open, setOpen] = useState(false);
  const [deleteQualification, setDeleteQualification] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const handleDeleteQualification = () => {
    const previousQueries = queryClient.getQueriesData({
      queryKey: qualificationsQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData(
      { queryKey: qualificationsQueryKeyPrefix(locale) },
      (current) =>
        removeInfiniteItem<QualificationViewModel>(
          current,
          ["qualifications", "qualification"],
          qualification.id,
        ),
    );

    startTransition(async () => {
      try {
        const response = await deleteQualificationAction({
          id: qualification.id,
          locale,
        });

        toast.success(response.message ?? "Qualification deleted successfully.");
        await queryClient.invalidateQueries({
          queryKey: qualificationsQueryKeyPrefix(locale),
        });
        setDeleteQualification(false);
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message =
          error instanceof Error ? error.message : "Failed to delete qualification.";
        toast.error(message);
      }
    });
  };

  return (
    <>
      <section className="flex flex-col justify-start gap-2 rounded-2xl border bg-white p-2 shadow sm:flex-row sm:items-center">
        <div className="h-38 w-40 shrink-0">
          <Image
            className="h-full w-full rounded-lg"
            width={160}
            height={152}
            src={qualification.image ?? "/assets/credentials.svg"}
            alt="credentials"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">{qualification.degree}</h2>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteQualification(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
          <p className="text-base">{qualification.countryName ?? "Country not provided"}</p>
          <p className="text-base">{qualification.university}</p>
          <p className="text-base">{qualification.period ?? "No period added yet."}</p>
        </div>
      </section>

      {open ? (
        <QualificationModal
          label="Edit Qualification"
          open={open}
          onOpenChange={setOpen}
          qualification={qualification}
        />
      ) : null}

      <DeleteModal
        open={deleteQualification}
        onOpenChange={setDeleteQualification}
        title="Do you want to delete this Qualification?"
        description="The Qualification will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteQualification}
        isLoading={isPending}
      />
    </>
  );
}
