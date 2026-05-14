"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";
const CustomEditor = dynamic(() => import("./CustomEditor"), { ssr: true });


import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";
import useGetSkills from "@/shared/hooks/useGetSkills";
import { useSearchParams } from "next/navigation";
import { JobDetails } from "../types/jobs.types";
import { useTranslations } from "next-intl";

export default function JobPostStepTwo({
  onPreviewLabelChange,
  existingJob,
}: {
  onPreviewLabelChange?: (key: "skills", value: string[]) => void;
  existingJob?: JobDetails | null;
}) {
  const t = useTranslations();
  const {
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();
  const [skillsSearch, setSkillsSearch] = useState("");
  const searchParams = useSearchParams();

  const jobId = searchParams.get("jobId");
  const editId = searchParams.get("editId");

  const id = jobId ?? editId;

  const {
    skills,
    isLoading: isSkillsLoading,
    error: skillsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSkills(skillsSearch, id ?? "");
  const skillOptions = skills.map((item) => ({
    label: item.title,
    value: String(item.id),
  }));

  // Build preload options from existing job skills so they show labels in edit mode
  const existingSkillOptions = useMemo(
    () =>
      (existingJob?.skills ?? []).map((s) => ({
        label: s.title,
        value: String(s.id),
      })),
    [existingJob],
  );

  const skillsOptionsCache = useMemo(() => {
    const map = new Map<string, string>();
    [...existingSkillOptions, ...skillOptions].forEach((option) => {
      map.set(option.value, option.label);
    });
    return map;
  }, [existingSkillOptions, skillOptions]);

  function getOptionLabels(values: string[]) {
    return values.map((v) => skillsOptionsCache.get(v) ?? v);
  }

  function translateMessage(message: string) {
    try {
      return t(message as never);
    } catch {
      return message;
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="job-editor">
                <label className="mb-2 block font-medium">
                  {t("companyPage.postJob.fields.jobDescription.label")}
                </label>
                <CustomEditor
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message
                      ? translateMessage(errors.description.message)
                      : null}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => {
              return (
                <MultiSelectInputField
                  {...field}
                  id="skills"
                  label={t("companyPage.postJob.fields.skills.label")}
                  placeholder={t("companyPage.postJob.fields.skills.placeholder")}
                  withSearchInput
                  error={
                    (errors.skills?.message
                      ? translateMessage(errors.skills.message)
                      : undefined) ??
                    (skillsError instanceof Error
                      ? skillsError.message
                      : undefined)
                  }
                  options={skillOptions}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "skills",
                      getOptionLabels(value),
                    );
                  }}
                  disabled={isSkillsLoading}
                  preloadOptions={
                    existingSkillOptions.length > 0
                      ? existingSkillOptions
                      : skillOptions
                  }
                  onReachEnd={() => fetchNextPage()}
                  hasNextPage={Boolean(hasNextPage)}
                  isFetchingNextPage={isFetchingNextPage}
                  onSearchChange={setSkillsSearch}
                />
              );
            }}
          />

        </div>
      </div>
    </div>
  );
}
