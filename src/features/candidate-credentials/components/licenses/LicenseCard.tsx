"use client";

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";

import DeleteModal from "@/shared/components/modals/DeleteModal";
import { deleteLicenseAction } from "../../actions/license-actions";
import { licensesQueryKeyPrefix } from "../../hooks/useGetLicenses";
import { removeInfiniteItem } from "../../services/infinite-query-cache";
import type { LicenseViewModel } from "../../types/license.types";
import { LicenseModal } from "./LicenseModal";

export default function LicenseCard({ license }: { license: LicenseViewModel }) {
  const [open, setOpen] = useState(false);
  const [deleteLicense, setDeleteLicense] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const handleDeleteLicense = () => {
    const previousQueries = queryClient.getQueriesData({
      queryKey: licensesQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData({ queryKey: licensesQueryKeyPrefix(locale) }, (current) =>
      removeInfiniteItem<LicenseViewModel>(current, ["user_licenses", "licenses"], license.id),
    );

    startTransition(async () => {
      try {
        const response = await deleteLicenseAction({
          id: license.id,
          locale,
        });

        toast.success(response.message ?? "License deleted successfully.");
        setDeleteLicense(false);
        await queryClient.invalidateQueries({
          queryKey: licensesQueryKeyPrefix(locale),
        });
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message = error instanceof Error ? error.message : "Failed to delete license.";
        toast.error(message);
      }
    });
  };

  return (
    <>
      <section className="flex flex-col items-center justify-start gap-2 rounded-2xl border bg-white p-2 shadow">
        <div className="h-66 w-full grow">
          <Image
            className="h-full w-full rounded-sm object-cover"
            width={400}
            height={264}
            src={license.image ?? "/assets/credentials.svg"}
            alt="credentials"
          />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-2 p-2">
          <h2 className="text-lg font-semibold text-black">{license.title}</h2>
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{license.number}</p>
              <p className="text-sm text-muted-foreground">
                {license.countryName ?? "Country not provided"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteLicense(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
        </div>
      </section>

      {open && (
        <LicenseModal
          label="Edit License"
          open={open}
          onOpenChange={setOpen}
          license={license}
        />
      )}

      <DeleteModal
        open={deleteLicense}
        onOpenChange={setDeleteLicense}
        title="Do you want to delete this License?"
        description="The License will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteLicense}
        isLoading={isPending}
      />
    </>
  );
}
