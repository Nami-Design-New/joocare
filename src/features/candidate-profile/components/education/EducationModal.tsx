"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useGetCountries from "@/shared/hooks/useGetCountries";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { createEducation, updateEducation } from "../../services/education-client-service";
import type { CandidateEducationViewModel } from "../../types/profile.types";
import {
  educationModalSchema,
  type EducationModalFormData,
} from "../../validation/education-modal-schema";

interface EducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  education?: CandidateEducationViewModel | null;
}

const EMPTY_FORM: EducationModalFormData = {
  degree: "",
  university: "",
  gpa: "",
  countryId: "",
  startDate: "",
  endDate: "",
};

function toFormState(
  education?: CandidateEducationViewModel | null,
): EducationModalFormData {
  if (!education) {
    return EMPTY_FORM;
  }

  return {
    degree: education.degree ?? "",
    university: education.university,
    gpa: education.gpa ?? "",
    countryId: education.countryId ?? "",
    startDate: education.startDate ?? "",
    endDate: education.endDate ?? "",
  };
}

export function EducationModal({
  open,
  onOpenChange,
  label,
  education,
}: EducationModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationModalFormData>({
    resolver: zodResolver(educationModalSchema),
    defaultValues: toFormState(education),
  });
  const {
    countries,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetCountries(countrySearch);

  const countryOptions = countries
    .map((country) => ({
      label: String(country.title ?? country.name ?? ""),
      value: String(country.id),
    }))
    .filter((country) => country.label);

  useEffect(() => {
    if (open) {
      reset(toFormState(education));
      setCountrySearch("");
    }
  }, [education, open, reset]);

  const handleDialogContentRef = useCallback((node: HTMLDivElement | null) => {
    setDialogContentElement(node);
  }, []);

  const onSubmit: SubmitHandler<EducationModalFormData> = async (form) => {
    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        degree: form.degree.trim(),
        university: form.university.trim(),
        gpa: form.gpa.trim(),
        countryId: form.countryId,
        startDate: form.startDate,
        endDate: form.endDate?.trim() || undefined,
        locale,
        token: session.accessToken,
      };

      const response = education?.id
        ? await updateEducation(education.id, payload)
        : await createEducation(payload);

      toast.success(
        response?.message ??
        (education?.id
          ? "Education updated successfully."
          : "Education added successfully."),
      );
      reset(EMPTY_FORM);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save education.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={handleDialogContentRef} className="max-w-175">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-[28px] text-black">{label}</DialogTitle>
          </DialogHeader>

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

          <InputField
            id="gpa"
            label="GPA"
            type="text"
            inputMode="decimal"
            placeholder="ex: 3.75"
            {...register("gpa")}
            error={errors.gpa?.message}
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
            <Button className="w-1/3" size={"pill"} type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : education?.id ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
