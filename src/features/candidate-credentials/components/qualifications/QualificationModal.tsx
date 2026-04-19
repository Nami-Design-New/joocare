"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import useGetCountries from "@/shared/hooks/useGetCountries";
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
import { storeUploadedFileAction } from "@/features/candidate-settings/actions/basic-info-actions";
import {
  createQualificationAction,
  updateQualificationAction,
} from "../../actions/qualification-actions";
import { qualificationsQueryKeyPrefix } from "../../hooks/useGetQualifications";
import {
  prependInfiniteItem,
  replaceInfiniteItem,
} from "../../services/infinite-query-cache";
import type {
  QualificationFormValues,
  QualificationViewModel,
} from "../../types/qualification.types";
import {
  createQualificationSchema,
  type QualificationSchemaOutput,
  type QualificationSchemaValues,
} from "../../validation/qualification-schema";

interface QualificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  qualification?: QualificationViewModel | null;
}

const EMPTY_FORM: QualificationFormValues = {
  degree: "",
  university: "",
  countryId: "",
  startDate: "",
  endDate: "",
  image: [],
};

function toFormState(
  qualification?: QualificationViewModel | null,
): QualificationFormValues {
  if (!qualification) {
    return EMPTY_FORM;
  }

  return {
    degree: qualification.degree,
    university: qualification.university,
    countryId: qualification.countryId ?? "",
    startDate: qualification.startDate ?? "",
    endDate: qualification.endDate ?? "",
    image: [],
  };
}

function buildOptimisticQualification({
  qualification,
  degree,
  university,
  countryId,
  startDate,
  endDate,
  image,
}: {
  qualification?: QualificationViewModel | null;
  degree: string;
  university: string;
  countryId: string;
  startDate: string;
  endDate?: string;
  image?: string | null;
}): QualificationViewModel {
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
    id: qualification?.id ?? `temp-${Date.now()}`,
    degree,
    university,
    countryId,
    countryName: qualification?.countryName ?? null,
    startDate,
    endDate: endDate ?? null,
    period: `${startLabel} - ${endLabel}`,
    image: image ?? qualification?.image ?? null,
  };
}

export function QualificationModal({
  open,
  onOpenChange,
  label,
  qualification,
}: QualificationModalProps) {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);
  const [showExistingImage, setShowExistingImage] = useState(Boolean(qualification?.image));
  const qualificationFormSchema = useMemo(
    () =>
      createQualificationSchema({
        requireImage: !(qualification?.image && showExistingImage),
      }),
    [qualification?.image, showExistingImage],
  );
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<QualificationSchemaValues, undefined, QualificationSchemaOutput>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: toFormState(qualification),
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

  const onSubmit: SubmitHandler<QualificationSchemaOutput> = (form) => {
    const imagePayload = qualification?.id
      ? storedImagePath ?? undefined
      : storedImagePath ?? (showExistingImage ? qualification?.image ?? null : null);

    const payload = {
      degree: form.degree.trim(),
      university: form.university.trim(),
      countryId: form.countryId,
      startDate: form.startDate,
      endDate: form.endDate?.trim() || undefined,
      image: imagePayload,
      locale,
    };
    const optimisticQualification = buildOptimisticQualification({
      qualification,
      ...payload,
    });
    const previousQueries = queryClient.getQueriesData({
      queryKey: qualificationsQueryKeyPrefix(locale),
    });

    queryClient.setQueriesData(
      { queryKey: qualificationsQueryKeyPrefix(locale) },
      (current) =>
        qualification?.id
          ? replaceInfiniteItem<QualificationViewModel>(
            current,
            ["qualifications", "qualification"],
            optimisticQualification,
          )
          : prependInfiniteItem<QualificationViewModel>(
            current,
            ["qualifications", "qualification"],
            optimisticQualification,
          ),
    );

    startTransition(async () => {
      try {
        const response = qualification?.id
          ? await updateQualificationAction({
            id: qualification.id,
            ...payload,
          })
          : await createQualificationAction(payload);

        toast.success(
          response.message ??
          (qualification?.id
            ? "Qualification updated successfully."
            : "Qualification added successfully."),
        );
        await queryClient.invalidateQueries({
          queryKey: qualificationsQueryKeyPrefix(locale),
        });
        onOpenChange(false);
      } catch (error) {
        previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });

        const message =
          error instanceof Error ? error.message : "Failed to save qualification.";
        toast.error(message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={handleDialogContentRef} className="max-w-175">
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
                required={!(qualification?.image && showExistingImage)}
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
                existingFileUrl={showExistingImage ? qualification?.image ?? null : null}
                existingFileLabel={qualification?.degree ?? "Qualification image"}
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
            id="degree"
            label="Degree"
            type="text"
            placeholder="ex: Bachelor's degree, Medicine and Surgery"
            {...register("degree")}
            error={errors.degree?.message}
          />

          <InputField
            id="university"
            label="University"
            type="text"
            placeholder="ex: Ain Shams University - Faculty of Medicine"
            {...register("university")}
            error={errors.university?.message}
          />

          <Controller
            name="countryId"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                label="Country"
                placeholder={isLoading ? "Loading countries..." : "ex: Egypt"}
                options={countryOptions}
                value={field.value}
                disabled={isLoading}
                portalContainer={dialogContentElement}
                withSearchInput
                searchPlaceholder="Search countries..."
                onSearchChange={setCountrySearch}
                onChange={field.onChange}
                onReachEnd={() => void fetchNextPage()}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                error={errors.countryId?.message}
              />
            )}
          />

          <div className="flex items-center justify-between gap-2 max-md:flex-col">
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
            <Button className="w-1/3" size={"pill"} type="submit" disabled={isPending}>
              {isPending ? "Saving..." : qualification?.id ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
