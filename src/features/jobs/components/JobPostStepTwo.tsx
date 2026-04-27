"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";
const CustomEditor = dynamic(() => import("./CustomEditor"), { ssr: true });


import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";
import useGetSkills from "@/shared/hooks/useGetSkills";
import { useSearchParams } from "next/navigation";

function getOptionLabels(
  values: string[],
  options: { label: string; value: string }[],
) {
  return values.map(
    (value) => options.find((option) => option.value === value)?.label ?? value,
  );
}

export default function JobPostStepTwo({
  onPreviewLabelChange,
}: {
  onPreviewLabelChange?: (key: "skills", value: string[]) => void;
}) {
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
                  Job Description
                </label>
                <CustomEditor
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
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
                  label="Skills"
                  placeholder="ex: Improvement"
                  withSearchInput
                  error={
                    errors.skills?.message ??
                    (skillsError instanceof Error
                      ? skillsError.message
                      : undefined)
                  }
                  options={skillOptions}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "skills",
                      getOptionLabels(value, skillOptions),
                    );
                  }}
                  disabled={isSkillsLoading}
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
