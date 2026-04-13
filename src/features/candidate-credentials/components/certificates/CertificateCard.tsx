"use client";

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import DeleteModal from "@/shared/components/modals/DeleteModal";
import { deleteCertificateAction } from "../../actions/certificate-actions";
import { certificatesQueryKeyPrefix } from "../../hooks/useGetCertificates";
import { removeInfiniteItem } from "../../services/infinite-query-cache";
import type { CertificateViewModel } from "../../types/certificate.types";
import { CertificateModal } from "./CertificateModal";

export default function CertificateCard({
  certificate,
}: {
  certificate: CertificateViewModel;
}) {
  const [open, setOpen] = useState(false);
  const [deleteCertificate, setDeleteCertificate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const handleDeleteCertificate = () => {
    const previousQueries = queryClient.getQueriesData({
      queryKey: certificatesQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData(
      { queryKey: certificatesQueryKeyPrefix(locale) },
      (current) =>
        removeInfiniteItem<CertificateViewModel>(
          current,
          ["certifications", "certificates"],
          certificate.id,
        ),
    );

    startTransition(async () => {
      try {
        const response = await deleteCertificateAction({
          id: certificate.id,
          locale,
        });

        toast.success(response.message ?? "Certificate deleted successfully.");
        setDeleteCertificate(false);
        await queryClient.invalidateQueries({
          queryKey: certificatesQueryKeyPrefix(locale),
        });
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message =
          error instanceof Error ? error.message : "Failed to delete certificate.";
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
            src={certificate.image ?? "/assets/credentials.svg"}
            alt="credentials"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">{certificate.name}</h2>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteCertificate(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
          <p className="text-base">{certificate.company}</p>
          <p className="text-base">{certificate.period ?? "No period added yet."}</p>
        </div>
      </section>

      {open && (
        <CertificateModal
          label="Edit Certificate"
          open={open}
          onOpenChange={setOpen}
          certificate={certificate}
        />
      )}

      <DeleteModal
        open={deleteCertificate}
        onOpenChange={setDeleteCertificate}
        title="Do you want to delete this Certificate?"
        description="The Certificate will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteCertificate}
        isLoading={isPending}
      />
    </>
  );
}
