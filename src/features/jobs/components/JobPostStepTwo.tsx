"use client";

import { SelectInputField } from "@/shared/components/SelectInputField";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";
import "ckeditor5/ckeditor5.css";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import dynamic from "next/dynamic";
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";
import useGetSkills from "@/shared/hooks/useGetSkills";

export default function JobPostStepTwo() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<JobFormData>();
  console.log(watch());
  const [skillsSearch, setSkillsSearch] = useState("");
  const {
    skills,
    isLoading: isSkillsLoading,
    error: skillsError,
    hasNextPage: hasMoreSkills,
    fetchNextPage: fetchMoreSkills,
    isFetchingNextPage: isFetchingMoreSkills,
  } = useGetSkills(skillsSearch);
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
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  onChange={(_, editor) => {
                    field.onChange(editor.getData());
                  }}
                  config={{
                    licenseKey: "GPL",
                  }}
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
                  error={
                    errors.skills?.message ??
                    (skillsError instanceof Error
                      ? skillsError.message
                      : undefined)
                  }
                  options={skills.map((item) => ({
                    label: item.title,
                    value: String(item.id),
                  }))}
                  disabled={isSkillsLoading}
                // onReachEnd={() => fetchMoreSkills()}
                // hasNextPage={Boolean(hasMoreSkills)}
                // isFetchingNextPage={isFetchingMoreSkills}
                // onSearchChange={setSkillsSearch}
                />
              );
            }}
          />

        </div>
      </div>
    </div>
  );
}
