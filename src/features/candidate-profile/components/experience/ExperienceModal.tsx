"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { InputField } from "@/shared/components/InputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import {
  createExperience,
  updateExperience,
} from "../../services/experience-client-service";
import type { CandidateExperienceViewModel } from "../../types/profile.types";
import { experienceModalSchema, FormData } from "../../validation/experience-modal-schema";

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  experience?: CandidateExperienceViewModel | null;
}

const EMPTY_FORM: FormData = {
  jobTitle: "",
  otherJobTitle: "",
  organizationOrHospitalName: "",
  startDate: "",
  endDate: "",
  workHere: false,
  responsibilities: [{ value: "" }],
};

function toFormState(
  experience?: CandidateExperienceViewModel | null,
  jobTitles?: Array<{ id: string | number; title?: string | null }>,
): FormData {
  if (!experience) {
    return EMPTY_FORM;
  }

  const normalizedExperienceTitle = experience.title.trim().toLowerCase();
  const matchedJobTitle = jobTitles?.find(
    (jobTitle) => jobTitle.title?.trim().toLowerCase() === normalizedExperienceTitle,
  );

  return {
    jobTitle: matchedJobTitle ? String(matchedJobTitle.id) : "__other__",
    otherJobTitle: matchedJobTitle ? "" : experience.title,
    organizationOrHospitalName: experience.organization ?? "",
    startDate: experience.startDate ?? "",
    endDate: experience.endDate ?? "",
    workHere: experience.isCurrent,
    responsibilities:
      experience.bullets.length > 0
        ? experience.bullets.map((bullet) => ({ value: bullet }))
        : [{ value: "" }],
  };
}

export function ExperienceModal({
  open,
  onOpenChange,
  label,
  experience,
}: ExperienceModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const defaultValues = useMemo(() => toFormState(experience), [experience]);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
} = useForm<FormData>({
    resolver: zodResolver(experienceModalSchema),
    defaultValues,
  });
  const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement | null>(null);
  const {
    jobTitles,
    isLoading: isJobTitlesLoading,
    error: jobTitlesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetJobTitles();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "responsibilities",
  });

  const workHere = watch("workHere");
  const selectedJobTitle = watch("jobTitle");
  const isOtherJobTitle = selectedJobTitle === "__other__";
  const jobTitlesKey = useMemo(
    () => jobTitles.map((jobTitle) => `${jobTitle.id}:${jobTitle.title ?? ""}`).join("|"),
    [jobTitles],
  );

  const jobTitleOptions = useMemo(() => {
    const mappedOptions = jobTitles
      .map((jobTitle) => ({
        label: String(jobTitle.title ?? ""),
        value: String(jobTitle.id ?? ""),
      }))
      .filter((jobTitle) => jobTitle.label);

    return [
      ...mappedOptions,
      { label: "Other", value: "__other__" },
    ];
  }, [jobTitles]);

  useEffect(() => {
    if (open) {
      reset(toFormState(experience, jobTitles));
    }
  }, [experience, jobTitlesKey, open, reset]);

  useEffect(() => {
    if (workHere) {
      setValue("endDate", "");
    }
  }, [setValue, workHere]);

  useEffect(() => {
    if (!isOtherJobTitle) {
      setValue("otherJobTitle", "");
    }
  }, [isOtherJobTitle, setValue]);

  const handleDialogContentRef = useCallback((node: HTMLDivElement | null) => {
    setDialogContentElement(node);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    if (!session?.accessToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title:
          form.jobTitle === "__other__"
            ? form.otherJobTitle?.trim() ?? ""
            : undefined,
        jobTitleId:
          form.jobTitle !== "__other__"
            ? form.jobTitle
            : undefined,
        company: form.organizationOrHospitalName.trim(),
        startDate: form.startDate,
        endDate: form.workHere ? undefined : form.endDate?.trim(),
        isCurrent: Boolean(form.workHere),
        responsibilities: form.responsibilities.map((item) => item.value.trim()),
        locale,
        token: session.accessToken,
      };

      const response = experience?.id
        ? await updateExperience(experience.id, payload)
        : await createExperience(payload);

      toast.success(
        response?.message ??
          (experience?.id
            ? "Experience updated successfully."
            : "Experience added successfully."),
      );
      reset(EMPTY_FORM);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save experience.";
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

          <Controller
            name="jobTitle"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="jobTitle"
                label="Job title"
                placeholder={isJobTitlesLoading ? "Loading job titles..." : "Select job title"}
                options={jobTitleOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isJobTitlesLoading}
                withSearchInput
                searchPlaceholder="Search job titles..."
                portalContainer={dialogContentElement}
                onReachEnd={() => void fetchNextPage()}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                error={
                  errors.jobTitle?.message ??
                  (jobTitlesError instanceof Error ? jobTitlesError.message : undefined)
                }
              />
            )}
          />

          {isOtherJobTitle && (
            <InputField
              id="otherJobTitle"
              label="Other job title"
              placeholder="Enter your job title"
              {...register("otherJobTitle")}
              error={errors.otherJobTitle?.message}
            />
          )}

          <InputField
            id="organizationOrHospitalName"
            label="Organization/Hospital Name"
            placeholder="ex: health care"
            {...register("organizationOrHospitalName")}
            error={errors.organizationOrHospitalName?.message}
          />

          <div className="flex gap-2 max-md:flex-col">
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
              disabled={workHere}
              {...register("endDate")}
              error={errors.endDate?.message}
            />
          </div>

          <Controller
            name="workHere"
            control={control}
            render={({ field }) => (
              <LabelCheckbox
                id="workHere"
                checked={field.value}
                onCheckedChange={field.onChange}
                error={errors.workHere?.message}
              >
                I currently work here
              </LabelCheckbox>
            )}
          />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Responsibilities</label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <InputField
                  id={`responsibilities-${index}`}
                  placeholder="Describe your responsibilities"
                  {...register(`responsibilities.${index}.value`)}
                  error={errors.responsibilities?.[index]?.value?.message}
                />

                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="flex h-13 w-15 items-center justify-center rounded-full bg-secondary text-white"
                  >
                    <Plus />
                  </button>
                )}

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="border-muted text-secondary flex h-13 w-15 items-center justify-center rounded-full border bg-muted"
                  >
                    <Minus />
                  </button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex items-center justify-center!">
            <Button className="w-1/3 hover:bg-primary/70" size="pill" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : experience?.id ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
