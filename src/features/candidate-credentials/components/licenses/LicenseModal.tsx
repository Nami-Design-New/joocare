"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import useGetCountries from "@/shared/hooks/useGetCountries";
import { storeUploadedFileAction } from "@/features/candidate-settings/actions/basic-info-actions";
import {
  createLicenseAction,
  updateLicenseAction,
} from "../../actions/license-actions";
import { licensesQueryKeyPrefix } from "../../hooks/useGetLicenses";
import {
  prependInfiniteItem,
  replaceInfiniteItem,
} from "../../services/infinite-query-cache";
import type { LicenseFormValues, LicenseViewModel } from "../../types/license.types";
import {
  createLicenseSchema,
  type LicenseSchemaOutput,
  type LicenseSchemaValues,
} from "../../validation/license-schema";

interface LicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  license?: LicenseViewModel | null;
}

const EMPTY_FORM: LicenseFormValues = {
  title: "",
  number: "",
  countryId: "",
  image: [],
};

function toFormState(license?: LicenseViewModel | null): LicenseFormValues {
  if (!license) {
    return EMPTY_FORM;
  }

  return {
    title: license.title,
    number: license.number,
    countryId: license.countryId ?? "",
    image: [],
  };
}

function buildOptimisticLicense({
  license,
  title,
  number,
  countryId,
  image,
}: {
  license?: LicenseViewModel | null;
  title: string;
  number: string;
  countryId: string;
  image?: string | null;
}): LicenseViewModel {
  return {
    id: license?.id ?? `temp-${Date.now()}`,
    title,
    number,
    countryId,
    countryName: license?.countryName ?? null,
    image: image ?? license?.image ?? null,
  };
}

export function LicenseModal({
  open,
  onOpenChange,
  label,
  license,
}: LicenseModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);
  const [showExistingImage, setShowExistingImage] = useState(Boolean(license?.image));
  const licenseFormSchema = useMemo(
    () =>
      createLicenseSchema({
        requireImage: !(license?.image && showExistingImage),
        messages: {
          titleMin: t("candidateValidation.license-title-min"),
          titleMax: t("candidateValidation.license-title-max"),
          numberMin: t("candidateValidation.license-number-min"),
          numberMax: t("candidateValidation.license-number-max"),
          countryRequired: t("authPage.validation.country-required"),
          imageRequired: t("candidateValidation.license-image-required"),
          oneImageOnly: t("candidateValidation.one-image-only"),
          imageType: t("candidateValidation.image-jpg-png"),
          imageSize: t("candidateValidation.image-max-2mb"),
        },
      }),
    [license?.image, showExistingImage, t],
  );
  const [uploadingCount, setUploadingCount] = useState(0);
  const isUploading = uploadingCount > 0;
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LicenseSchemaValues, undefined, LicenseSchemaOutput>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: toFormState(license),
  });
  const {
    countries,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetCountries(countrySearch);

  const countryOptions = countries
    .map((country) => ({
      label: String(country.title ?? country.name ?? ""),
      value: String(country.id),
    }))
    .filter((country) => country.label);

  const handleDialogContentRef = useCallback((node: HTMLDivElement | null) => {
    setDialogContentElement(node);
  }, []);

  const onSubmit: SubmitHandler<LicenseSchemaOutput> = (form) => {
    const imagePayload = license?.id
      ? storedImagePath ?? undefined
      : storedImagePath ?? (showExistingImage ? license?.image ?? null : null);

    const payload = {
      title: form.title.trim(),
      number: form.number.trim(),
      countryId: form.countryId,
      image: imagePayload,
      locale,
    };
    const optimisticLicense = buildOptimisticLicense({
      license,
      ...payload,
    });
    const previousQueries = queryClient.getQueriesData({
      queryKey: licensesQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData({ queryKey: licensesQueryKeyPrefix(locale) }, (current) =>
      license?.id
        ? replaceInfiniteItem<LicenseViewModel>(
          current,
          ["user_licenses", "licenses"],
          optimisticLicense,
        )
        : prependInfiniteItem<LicenseViewModel>(
          current,
          ["user_licenses", "licenses"],
          optimisticLicense,
        ),
    );

    startTransition(async () => {
      try {
        const response = license?.id
          ? await updateLicenseAction({
            id: license.id,
            ...payload,
          })
          : await createLicenseAction(payload);

        toast.success(
          response.message ??
          (license?.id ? t("candidatePage.toasts.license-updated") : t("candidatePage.toasts.license-added")),
        );
        onOpenChange(false);
        await queryClient.invalidateQueries({
          queryKey: licensesQueryKeyPrefix(locale),
        });
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message = error instanceof Error ? error.message : t("candidatePage.toasts.license-save-failed");
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={handleDialogContentRef} className="max-w-175 flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
          </DialogHeader>

          <InputField
            id="licenseTitle"
            label={t("authPage.common.license-title")}
            type="text"
            placeholder={t("candidatePage.credentials.license-title-placeholder")}
            {...register("title")}
            error={errors.title?.message}
          />

          <InputField
            id="licenseNumber"
            label={t("authPage.common.license-number")}
            type="text"
            placeholder={t("candidatePage.credentials.license-number-placeholder")}
            {...register("number")}
            error={errors.number?.message}
          />

          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                label={t("candidatePage.profile.country")}
                placeholder={isLoading ? t("candidatePage.profile.loading-countries") : t("candidatePage.credentials.license-country-placeholder")}
                options={countryOptions}
                value={field.value}
                disabled={isLoading}
                portalContainer={dialogContentElement}
                withSearchInput
                searchPlaceholder={t("candidatePage.profile.search-countries")}
                onSearchChange={setCountrySearch}
                onChange={field.onChange}
                onReachEnd={() => void fetchNextPage()}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                error={errors.countryId?.message}
              />
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <StoredFilepondUpload
                label={t("candidatePage.profile.upload-image")}
                files={field.value}
                onChange={field.onChange}
                required={!(license?.image && showExistingImage)}
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
                existingFileUrl={showExistingImage ? license?.image ?? null : null}
                existingFileLabel={license?.title ?? t("candidatePage.credentials.license-image")}
                onExistingFileRemove={() => {
                  setShowExistingImage(false);
                  setStoredImagePath(null);
                  field.onChange([]);
                }}
                error={errors.image?.message}
                onUploadingChange={(isUploading) => {
                  setUploadingCount((prev) =>
                    isUploading ? prev + 1 : Math.max(0, prev - 1)
                  );
                }}
              />
            )}
          />

          <DialogFooter className="flex items-center justify-center!">
            <Button className="w-1/3" size="pill" type="submit" disabled={isPending || isLoading || isUploading}>
              {isPending ? t("candidatePage.common.saving") : license?.id ? t("common.save") : t("candidatePage.common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
