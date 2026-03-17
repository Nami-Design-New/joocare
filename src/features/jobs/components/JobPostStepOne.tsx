// import { InputField } from "@/shared/components/InputField";
// import { SelectInputField } from "@/shared/components/SelectInputField";
// import { Label } from "@/shared/components/ui/label";
// import { Switch } from "@/shared/components/ui/switch";
// import React from "react";

// export default function JobPostStepOne() {
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <SelectInputField
//             id="title"
//             label="Job Title"
//             placeholder="ex: Cardiac surgeon"
//             options={[
//               { label: "Engineering", value: "engineering" },
//               { label: "Design", value: "design" },
//               { label: "Marketing", value: "marketing" },
//             ]}
//           />
//         </div>
//         <div>
//           <SelectInputField
//             id="license"
//             label=" Professional License"
//             placeholder="ex: Without Medical license"
//             options={[
//               { label: "Engineering", value: "engineering" },
//               { label: "Design", value: "design" },
//               { label: "Marketing", value: "marketing" },
//             ]}
//           />
//         </div>
//       </div>
//       <div className="bg-muted rounded-[12px] p-3">
//         <div className="mb-5 flex items-center justify-between">
//           <p className="font-semibold">Do you want to add salary?</p>{" "}
//           <Switch id="airplane-mode" />
//         </div>
//         <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
//           {/* Salary Range */}
//           <div className="space-y-2">
//             <label className="mb-1 block font-semibold">
//               Salary Range (USD / year)
//             </label>

//             <div className="flex items-end gap-3">
//               <InputField
//                 id="salary-min"
//                 name="salary.min"
//                 type="number"
//                 placeholder="Min"
//                 className="bg-white"
//               />

//               <InputField
//                 id="salary-max"
//                 name="salary.max"
//                 type="number"
//                 placeholder="Max"
//                 className="bg-white"
//               />
//             </div>
//           </div>

//           {/* Salary Type */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="salary-type"
//               label="Salary Type"
//               className="bg-white"
//               placeholder="Hourly"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>

//           {/* Currency */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="currency"
//               label="Currency"
//               className="bg-white"
//               placeholder="Choose"
//               options={[
//                 { label: "Full-time", value: "full-time" },
//                 { label: "Part-time", value: "part-time" },
//                 { label: "Contract", value: "contract" },
//               ]}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <SelectInputField
//             id="category"
//             label="Category"
//             options={[
//               { label: "Engineering", value: "engineering" },
//               { label: "Design", value: "design" },
//               { label: "Marketing", value: "marketing" },
//             ]}
//           />
//         </div>
//         <div>
//           <SelectInputField
//             id="job-type"
//             label="Specialty"
//             options={[
//               { label: "Full-time", value: "full-time" },
//               { label: "Part-time", value: "part-time" },
//               { label: "Contract", value: "contract" },
//             ]}
//           />
//         </div>
//       </div>
//       <div className="bg-muted rounded-[12px] p-3">
//         <h6 className="text-gray-45 mb-5 font-semibold">
//           Employment Type Section
//         </h6>{" "}
//         <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
//           {/* Employment Type */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="employment-type"
//               label="Employment Type"
//               className="bg-white"
//               placeholder="ex:Full-time"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//           {/* Role Category */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="role-category"
//               label="Role Category"
//               className="bg-white"
//               placeholder="ex:Clinical"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>

//           {/* Seniority Level */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="seniority-level"
//               hint="optional"
//               label="Seniority Level"
//               placeholder="select"
//               className="bg-white"
//               options={[
//                 { label: "Full-time", value: "full-time" },
//                 { label: "Part-time", value: "part-time" },
//                 { label: "Contract", value: "contract" },
//               ]}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="bg-muted rounded-[12px] p-3">
//         <h6 className="text-gray-45 mb-5 font-semibold">Job Location</h6>{" "}
//         <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
//           {/* Country */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="country"
//               label="Country"
//               className="bg-white"
//               placeholder="ex: United Arab Emirates (UAE)"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//           {/* City */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="city"
//               label="City"
//               className="bg-white"
//               placeholder="ex:Dubai"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//         </div>
//       </div>
//       <div>
//         <SelectInputField
//           id="experience-years"
//           label="Years of Experience"
//           placeholder="select"
//           options={[
//             { label: "Engineering", value: "engineering" },
//             { label: "Design", value: "design" },
//             { label: "Marketing", value: "marketing" },
//           ]}
//         />
//       </div>
//       <div className="bg-muted rounded-[12px] p-3">
//         <h6 className="text-gray-45 mb-5 font-semibold">
//           Education & Certifications section
//         </h6>{" "}
//         <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
//           {/* Education Level */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="education-level"
//               label="Education Level"
//               placeholder="select"
//               className="bg-white"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//           {/* Education Level */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="mandatory-certifications"
//               label="Mandatory Certifications"
//               placeholder="select"
//               className="bg-white"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//           {/* Availability */}
//           <div className="space-y-2">
//             <SelectInputField
//               id="availability"
//               label="Availability"
//               className="bg-white"
//               placeholder="select"
//               options={[
//                 { label: "Engineering", value: "engineering" },
//                 { label: "Design", value: "design" },
//                 { label: "Marketing", value: "marketing" },
//               ]}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Switch } from "@/shared/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";

// ─── tiny helper: surface zod error message under a field ───────────────────
function FieldError({ name }: { name: string }) {
  const {
    formState: { errors },
  } = useFormContext<JobFormData>();

  // support dot-path: "salary.min"
  const error = name
    .split(".")
    .reduce(
      (obj: unknown, key) => (obj as Record<string, unknown>)?.[key],
      errors,
    ) as { message?: string } | undefined;

  if (!error?.message) return null;
  return <p className="mt-1 text-xs text-red-500">{error.message}</p>;
}

export default function JobPostStepOne() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<JobFormData>();
  console.log(errors);

  const addSalary = watch("addSalary");

  return (
    <div className="space-y-4">
      {/* ── Job Title + Professional License ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="title"
                label="Job Title"
                placeholder="ex: Cardiac surgeon"
                error={errors.title?.message}
                options={[
                  { label: "Cardiac Surgeon", value: "cardiac-surgeon" },
                  { label: "Nurse", value: "nurse" },
                  { label: "Radiologist", value: "radiologist" },
                ]}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="license"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="license"
                label="Professional License"
                placeholder="ex: Without Medical license"
                error={errors.license?.message}
                options={[
                  { label: "With Medical License", value: "with" },
                  { label: "Without Medical License", value: "without" },
                ]}
              />
            )}
          />
        </div>
      </div>

      {/* ── Salary Section ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold">Do you want to add salary?</p>
          {/* Wire the Switch to addSalary boolean */}
          <Controller
            control={control}
            name="addSalary"
            render={({ field }) => (
              <Switch
                id="add-salary"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Only render salary fields when toggle is ON */}
        {addSalary && (
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* Salary Range */}
            <div className="space-y-2">
              <label className="mb-1 block font-semibold">
                Salary Range (USD / year)
              </label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <InputField
                    {...register("salary.min")}
                    id="salary-min"
                    type="number"
                    placeholder="Min"
                    className="bg-white"
                  />
                  <FieldError name="salary.min" />
                </div>
                <div className="flex-1">
                  <InputField
                    {...register("salary.max")}
                    id="salary-max"
                    type="number"
                    placeholder="Max"
                    className="bg-white"
                  />
                  <FieldError name="salary.max" />
                </div>
              </div>
            </div>

            {/* Salary Type */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="salary.type"
                render={({ field }) => (
                  <SelectInputField
                    {...field}
                    id="salary-type"
                    label="Salary Type"
                    className="bg-white"
                    placeholder="Hourly"
                    error={errors.salary?.type?.message}
                    options={[
                      { label: "Hourly", value: "hourly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Annual", value: "annual" },
                    ]}
                  />
                )}
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Controller
                control={control}
                name="salary.currency"
                render={({ field }) => (
                  <SelectInputField
                    {...field}
                    id="currency"
                    label="Currency"
                    className="bg-white"
                    placeholder="Choose"
                    error={errors.salary?.currency?.message}
                    options={[
                      { label: "USD", value: "USD" },
                      { label: "AED", value: "AED" },
                      { label: "EUR", value: "EUR" },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Category + Specialty ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="category"
                label="Category"
                error={errors.category?.message}
                options={[
                  { label: "Clinical", value: "clinical" },
                  { label: "Surgical", value: "surgical" },
                  { label: "Diagnostic", value: "diagnostic" },
                ]}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="specialty"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="specialty"
                label="Specialty"
                error={errors.specialty?.message}
                options={[
                  { label: "Cardiology", value: "cardiology" },
                  { label: "Neurology", value: "neurology" },
                  { label: "Orthopedics", value: "orthopedics" },
                ]}
              />
            )}
          />
        </div>
      </div>

      {/* ── Employment Type Section ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">
          Employment Type Section
        </h6>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Controller
              control={control}
              name="employmentType"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="employment-type"
                  label="Employment Type"
                  className="bg-white"
                  placeholder="ex: Full-time"
                  error={errors.employmentType?.message}
                  options={[
                    { label: "Full-time", value: "full-time" },
                    { label: "Part-time", value: "part-time" },
                    { label: "Contract", value: "contract" },
                  ]}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name="roleCategory"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="role-category"
                  label="Role Category"
                  className="bg-white"
                  placeholder="ex: Clinical"
                  error={errors.roleCategory?.message}
                  options={[
                    { label: "Clinical", value: "clinical" },
                    { label: "Administrative", value: "administrative" },
                    { label: "Support", value: "support" },
                  ]}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name="seniorityLevel"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="seniority-level"
                  hint="optional"
                  label="Seniority Level"
                  placeholder="select"
                  className="bg-white"
                  options={[
                    { label: "Junior", value: "junior" },
                    { label: "Mid", value: "mid" },
                    { label: "Senior", value: "senior" },
                    { label: "Lead", value: "lead" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Job Location ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">Job Location</h6>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="country"
                  label="Country"
                  className="bg-white"
                  placeholder="ex: United Arab Emirates (UAE)"
                  error={errors.country?.message}
                  options={[
                    { label: "United Arab Emirates", value: "UAE" },
                    { label: "Saudi Arabia", value: "SA" },
                    { label: "Egypt", value: "EG" },
                  ]}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="city"
                  label="City"
                  className="bg-white"
                  placeholder="ex: Dubai"
                  error={errors.city?.message}
                  options={[
                    { label: "Dubai", value: "dubai" },
                    { label: "Abu Dhabi", value: "abu-dhabi" },
                    { label: "Cairo", value: "cairo" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Years of Experience ── */}
      <div>
        <Controller
          control={control}
          name="yearsOfExperience"
          render={({ field }) => (
            <SelectInputField
              {...field}
              id="experience-years"
              label="Years of Experience"
              placeholder="select"
              error={errors.yearsOfExperience?.message}
              options={[
                { label: "0 – 1 years", value: "0-1" },
                { label: "1 – 3 years", value: "1-3" },
                { label: "3 – 5 years", value: "3-5" },
                { label: "5 – 10 years", value: "5-10" },
                { label: "10+ years", value: "10+" },
              ]}
            />
          )}
        />
      </div>

      {/* ── Education & Certifications ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">
          Education & Certifications section
        </h6>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => {
                console.log(field);
                return (
                  <SelectInputField
                    {...field}
                    id="education-level"
                    label="Education Level"
                    placeholder="select"
                    className="bg-white"
                    error={errors.educationLevel?.message}
                    options={[
                      { label: "High School", value: "high-school" },
                      { label: "Bachelor's", value: "bachelors" },
                      { label: "Master's", value: "masters" },
                      { label: "PhD", value: "phd" },
                    ]}
                  />
                );
              }}
            />
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name="mandatoryCertifications"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="mandatory-certifications"
                  label="Mandatory Certifications"
                  placeholder="select"
                  className="bg-white"
                  error={errors.mandatoryCertifications?.message}
                  options={[
                    { label: "BLS", value: "bls" },
                    { label: "ACLS", value: "acls" },
                    { label: "PALS", value: "pals" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">Availability</h6>{" "}
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="space-y-2">
            <Controller
              control={control}
              name="availability"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="availability"
                  label="Availability"
                  className="bg-white"
                  placeholder="select"
                  error={errors.availability?.message}
                  options={[
                    { label: "Immediate", value: "immediate" },
                    { label: "2 weeks", value: "2-weeks" },
                    { label: "1 month", value: "1-month" },
                    { label: "Flexible", value: "flexible" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
