"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { InputField } from "@/shared/components/InputField";
import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { storeUploadedFileAction } from "@/features/candidate-settings/actions/basic-info-actions";
import {
  createCertificateAction,
  updateCertificateAction,
} from "../../actions/certificate-actions";
import { certificatesQueryKeyPrefix } from "../../hooks/useGetCertificates";
import {
  prependInfiniteItem,
  replaceInfiniteItem,
} from "../../services/infinite-query-cache";
import type {
  CertificateFormValues,
  CertificateViewModel,
} from "../../types/certificate.types";
import {
  certificateSchema,
  type CertificateSchemaOutput,
  type CertificateSchemaValues,
} from "../../validation/certificate-schema";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  certificate?: CertificateViewModel | null;
}

const EMPTY_FORM: CertificateFormValues = {
  name: "",
  company: "",
  startDate: "",
  endDate: "",
  image: [],
};

function toFormState(certificate?: CertificateViewModel | null): CertificateFormValues {
  if (!certificate) {
    return EMPTY_FORM;
  }

  return {
    name: certificate.name,
    company: certificate.company,
    startDate: certificate.startDate ?? "",
    endDate: certificate.endDate ?? "",
    image: [],
  };
}

function buildOptimisticCertificate({
  certificate,
  name,
  company,
  startDate,
  endDate,
  image,
}: {
  certificate?: CertificateViewModel | null;
  name: string;
  company: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
}): CertificateViewModel {
  const startLabel = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
  const endLabel = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "Present";

  return {
    id: certificate?.id ?? `temp-${Date.now()}`,
    name,
    company,
    startDate,
    endDate: endDate ?? null,
    period: `${startLabel} - ${endLabel}`,
    image: image ?? certificate?.image ?? null,
  };
}

export function CertificateModal({
  open,
  onOpenChange,
  label,
  certificate,
}: CertificateModalProps) {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);
  const [showExistingImage, setShowExistingImage] = useState(Boolean(certificate?.image));
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CertificateSchemaValues, undefined, CertificateSchemaOutput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: toFormState(certificate),
  });

  const onSubmit: SubmitHandler<CertificateSchemaOutput> = (form) => {
    const imagePayload = certificate?.id
      ? storedImagePath ?? undefined
      : storedImagePath ?? (showExistingImage ? certificate?.image ?? null : null);

    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      startDate: form.startDate,
      endDate: form.endDate?.trim() || undefined,
      image: imagePayload,
      locale,
    };
    const optimisticCertificate = buildOptimisticCertificate({
      certificate,
      ...payload,
    });
    const previousQueries = queryClient.getQueriesData({
      queryKey: certificatesQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData(
      { queryKey: certificatesQueryKeyPrefix(locale) },
      (current) =>
        certificate?.id
          ? replaceInfiniteItem<CertificateViewModel>(
              current,
              ["certifications", "certificates"],
              optimisticCertificate,
            )
          : prependInfiniteItem<CertificateViewModel>(
              current,
              ["certifications", "certificates"],
              optimisticCertificate,
            ),
    );

    startTransition(async () => {
      try {
        const response = certificate?.id
          ? await updateCertificateAction({
              id: certificate.id,
              ...payload,
            })
          : await createCertificateAction(payload);

        toast.success(
          response.message ??
            (certificate?.id
              ? "Certificate updated successfully."
              : "Certificate added successfully."),
        );
        onOpenChange(false);
        await queryClient.invalidateQueries({
          queryKey: certificatesQueryKeyPrefix(locale),
        });
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message =
          error instanceof Error ? error.message : "Failed to save certificate.";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-175 flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
          </DialogHeader>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <StoredFilepondUpload
                label="Upload Image"
                files={field.value}
                onChange={field.onChange}
                allowMultiple={false}
                maxFiles={1}
                allowImagePreview
                acceptedFileTypes={["image/png", "image/jpeg", "image/jpg"]}
                processFile={async (file) => {
                  const uploadFormData = new FormData();
                  uploadFormData.append("image", file);
                  return storeUploadedFileAction(uploadFormData, locale);
                }}
                onStoredPathChange={(path) => {
                  setStoredImagePath(path);
                  if (path) {
                    clearErrors("image");
                    setShowExistingImage(false);
                  }
                }}
                onUploadError={(message) => {
                  if (!message) {
                    clearErrors("image");
                    return;
                  }

                  setError("image", {
                    type: "server",
                    message,
                  });
                }}
                existingFileUrl={showExistingImage ? certificate?.image ?? null : null}
                existingFileLabel={certificate?.name ?? "Certificate image"}
                onExistingFileRemove={() => {
                  setShowExistingImage(false);
                  setStoredImagePath(null);
                  field.onChange([]);
                }}
                error={errors.image?.message}
              />
            )}
          />

          <InputField
            id="certificateName"
            label="Certificate Name"
            type="text"
            placeholder="ex: Infection Control Diploma"
            {...register("name")}
            error={errors.name?.message}
          />

          <InputField
            id="issuingOrganization"
            label="Issuing Organization"
            type="text"
            placeholder="ex: American Heart Association"
            {...register("company")}
            error={errors.company?.message}
          />

          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <InputField
              id="startDate"
              label="Start Date"
              type="date"
              {...register("startDate")}
              error={errors.startDate?.message}
            />
            <InputField
              id="endDate"
              label="End Date"
              type="date"
              {...register("endDate")}
              error={errors.endDate?.message}
            />
          </div>

          <DialogFooter className="flex items-center justify-center!">
            <Button className="w-1/3" size="pill" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : certificate?.id ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
