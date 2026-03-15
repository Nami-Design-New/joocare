"use client";

import { SelectInputField } from "@/shared/components/SelectInputField";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";
import "ckeditor5/ckeditor5.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";

export default function JobPostStepTwo() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<JobFormData>();
  console.log(watch());

  console.log(errors);

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
                  error={errors.skills?.message}
                  options={[
                    { label: "Critical Thinking", value: "critical-thinking" },
                    { label: "Patient Care", value: "patient-care" },
                    { label: "Surgical Skills", value: "surgical-skills" },
                    { label: "Diagnosis", value: "diagnosis" },
                  ]}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
