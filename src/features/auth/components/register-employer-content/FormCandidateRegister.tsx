"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

import { FilepondUpload } from "@/shared/components/FilepondUpload";
import {
  RegisterCandidateSchema,
  TRegisterCandidateSchema,
} from "../../validation/employer-candidate-schema";

const FormCandidateRegister = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterCandidateSchema>({
    resolver: zodResolver(RegisterCandidateSchema),
    defaultValues: {
      uploadCV: [],
      confirmRegister: false,
      uploadLicense: [],
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const confirmRegisterValue = watch("confirmRegister");

  const onSubmit: SubmitHandler<TRegisterCandidateSchema> = (data) => {
    try {
      const formData = new FormData();

      // Add basic information (always required)
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneCode", data.phoneCode);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("jobTitle", data.jobTitle);
      formData.append("country", data.country);
      formData.append("city", data.city);
      formData.append("createPassword", data.createPassword);

      // Add CV files (optional)
      if (data.uploadCV && data.uploadCV.length > 0) {
        data.uploadCV.forEach((file) => {
          formData.append("cv", file);
        });
      }

      // Add license information (only if confirmed)
      if (data.confirmRegister) {
        formData.append("licenseTitle", data.licenseTitle || "");
        formData.append("licenseNumber", data.licenseNumber || "");
        formData.append("specificCountry", data.specificCountry || "");

        // Add license files
        if (data.uploadLicense && data.uploadLicense.length > 0) {
          data.uploadLicense.forEach((file) => {
            formData.append("uploadLicense", file);
          });
        }
      }

      // Log FormData for debugging
      console.log("✅ Form submitted successfully");
      console.log("Form Data entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // Here you would typically send the formData to your API
      // Example:
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();

      console.log("Form is ready to be sent to the server");
    } catch (error) {
      console.error("❌ Error processing form data:", error);
    }
  };

  const onError = (errors: any) => {
    console.error("❌ Form validation errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-5 mt-6"
    >
      {/* Full Name */}
      <InputField
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="ex: JooCore"
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      {/* Email */}
      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="ex: mail@mail.com"
        {...register("email")}
        error={errors.email?.message}
      />

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneCode" className="mb-2 mx-1 font-semibold block">
          Phone number
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="phoneCode"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="phoneCode"
                placeholder="+999"
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.phoneCode}
                showPlaceholderImage="/assets/flag.svg"
                className="min-w-29 w-29"
                options={[
                  {
                    label: "+999",
                    value: "+999",
                    image: "/assets/flag.svg",
                  },
                  {
                    label: "+24",
                    value: "+24",
                    image: "/assets/logo_1.svg",
                  },
                  {
                    label: "+55",
                    value: "+55",
                    image: "/assets/flag.svg",
                  },
                ]}
              />
            )}
          />
          <InputField
            id="phoneNumber"
            type="text"
            placeholder="ex: 52 987 6543"
            {...register("phoneNumber")}
            error={false}
          />
        </div>
        {(errors.phoneCode || errors.phoneNumber) && (
          <span className="text-red-500 text-[12px] mt-1 block">
            {errors.phoneCode?.message ||
              errors.phoneNumber?.message ||
              "Phone code and phone number are required"}
          </span>
        )}
      </div>

      {/* Job Title */}
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            placeholder="ex: Hospital"
            value={
              field.value
                ? { label: field.value, value: field.value }
                : undefined
            }
            onChange={(option) => field.onChange(option?.value)}
            error={errors.jobTitle?.message}
            options={[
              { label: "Hospital", value: "hospital" },
              { label: "Software", value: "software" },
              { label: "Company", value: "company" },
            ]}
          />
        )}
      />

      {/* Current Location */}
      <div>
        <label htmlFor="country" className="mb-2 mx-1 font-semibold block">
          Current Location
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                placeholder="country"
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                error={errors.country?.message}
                options={[
                  { label: "egypt", value: "egypt" },
                  { label: "saudi", value: "saudi" },
                  { label: "canada", value: "canada" },
                ]}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="city"
                placeholder="city"
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                error={errors.city?.message}
                options={[
                  { label: "cairo", value: "cairo" },
                  { label: "alex", value: "alex" },
                  { label: "reyad", value: "reyad" },
                ]}
              />
            )}
          />
        </div>
      </div>

      {/* Password */}
      <InputField
        id="createPassword"
        type="password"
        label="Create password"
        placeholder="******"
        {...register("createPassword")}
        error={errors.createPassword?.message}
      />

      {/* Upload CV */}
      <Controller
        name="uploadCV"
        control={control}
        render={({ field }) => (
          <FilepondUpload
            label="Upload CV (optional)"
            files={field.value}
            onChange={field.onChange}
            allowMultiple={false}
            maxFiles={2}
          />
        )}
      />

      {/* Medical License Checkbox */}
      <Controller
        name="confirmRegister"
        control={control}
        render={({ field }) => (
          <LabelCheckbox
            id="confirmRegister"
            checked={field.value}
            onCheckedChange={field.onChange}
            error={errors.confirmRegister?.message}
          >
            Do you hold a valid medical license?
          </LabelCheckbox>
        )}
      />

      {/* Conditional License Fields */}
      {confirmRegisterValue && (
        <>
          <InputField
            id="licenseTitle"
            label="License Title"
            placeholder="ex: License Title"
            {...register("licenseTitle")}
            error={errors.licenseTitle?.message}
          />

          <InputField
            id="licenseNumber"
            label="License Number"
            placeholder="ex: 23121212"
            {...register("licenseNumber")}
            error={errors.licenseNumber?.message}
          />

          <Controller
            name="specificCountry"
            control={control}
            render={({ field }) => (
              <SelectInputField
                label="Country"
                id="specificCountry"
                placeholder="ex: United Arab Emirates (UAE)"
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : undefined
                }
                onChange={(option) => field.onChange(option?.value)}
                error={errors.specificCountry?.message}
                options={[
                  {
                    label: "United Arab Emirates (UAE)",
                    value: "United Arab Emirates (UAE)",
                  },
                  { label: "Egypt", value: "Egypt" },
                  { label: "Saudi Arabia", value: "Saudi Arabia" },
                ]}
              />
            )}
          />

          <Controller
            name="uploadLicense"
            control={control}
            render={({ field }) => (
              <FilepondUpload
                label="Upload the license image"
                files={field.value}
                onChange={field.onChange}
                allowMultiple={false}
                maxFiles={2}
              />
            )}
          />
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-2.5">
        <Button
          hoverStyle="slideSecondary"
          className="w-1/3"
          size="pill"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default FormCandidateRegister;