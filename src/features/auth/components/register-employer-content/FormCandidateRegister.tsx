"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

import { FilepondUpload } from "@/shared/components/FilepondUpload";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import { useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { useRegisterCandidate } from "../../hooks/useRegisterCandidate";
import {
  RegisterCandidateSchema,
  TRegisterCandidateSchema,
} from "../../validation/candidate-register-schema";
import { OTPModal } from "../forget-password/OtpModal";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";

const FormCandidateRegister = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobTitles, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetJobTitles();
  const { countries, isLoading: countryLoading, error: countryError, hasNextPage: countryHasNextPage, fetchNextPage: countryFetchNextPage, isFetchingNextPage: countryIsFetchingNextPage } = useGetCountries();

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
    mode: "onChange", // Validate on blur for better UX
  });

  const verificationEmail = watch("email");
  const countryId = watch("country");
  const { cities, isLoading: cityLoading, error: cityError, hasNextPage: cityHasNextPage, fetchNextPage: cityFetchNextPage, isFetchingNextPage: cityIsFetchingNextPage } = useGetCitiesByCountryId(Number(countryId));

  const confirmRegisterValue = watch("confirmRegister");
  const { mutate: submitRegister, isPending } = useRegisterCandidate(() =>
    setIsModalOpen(true)
  );

  const onSubmit: SubmitHandler<TRegisterCandidateSchema> = (data) => {
    const parsed = parsePhoneNumber(data.phoneNumber);

    submitRegister({
      name: data.fullName,
      email: data.email,
      phone: parsed?.nationalNumber ?? "",
      phone_code: `+${parsed?.countryCallingCode ?? ""}`,
      job_title_id: data.jobTitle,
      country_id: data.country,
      city_id: data.city,
      password: data.createPassword,
      has_medical_license: data.confirmRegister,
      license_country_id: data.country,
      license_title: data.licenseTitle,
      license_number: data.licenseNumber,
      cv: data.uploadCV,
      license: data.uploadLicense,
    });
  };
  return (<>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-5"
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

      <>
        <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
          Phone Number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              defaultCountry="EG"
              id="phoneNumber"
              className="w-full"
              placeholder="Enter phone number"
              onChange={(value) => field.onChange(value)}
              error={errors.phoneNumber?.message ? true : false}

            />
          )}
        />
        {errors.phoneNumber && (
          <span className="-mt-4 text-[12px] text-red-500">
            {errors.phoneNumber.message}
          </span>
        )}
      </>

      {/* Job Title */}
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            withSearchInput={true}
            placeholder="ex: Hospital"
            {...field}
            error={errors.jobTitle?.message ?? (error instanceof Error ? error.message : undefined)}
            options={jobTitles.map((jt) => ({
              label: jt.title,
              value: String(jt.id),
            }))}

            disabled={isLoading}
            onReachEnd={() => fetchNextPage()}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      />

      {/* Current Location */}
      <div>
        <label htmlFor="country" className="mx-1 mb-2 block font-semibold">
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
                {...field}
                options={countries.map((c) => ({
                  label: c.name,
                  value: String(c.id),
                }))}
                error={errors.country?.message}
                onReachEnd={() => countryFetchNextPage()}
                hasNextPage={!!countryHasNextPage}
                isFetchingNextPage={countryIsFetchingNextPage}
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
                {...field}
                error={errors.city?.message}
                options={cities.map((c) => ({
                  label: c.name,
                  value: String(c.id),
                }))}
                disabled={!countryId}
                onReachEnd={() => cityFetchNextPage()}
                hasNextPage={!!cityHasNextPage}
                isFetchingNextPage={cityIsFetchingNextPage}
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
            label={`Upload CV`}
            hint={`"Optional"`}
            files={field.value}
            onChange={field.onChange}
            allowMultiple={false}
            maxFiles={1}
            error={errors.uploadCV?.message}
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
          <>
            <Controller
              name="specificCountry"
              control={control}
              render={({ field }) => (
                <SelectInputField
                  label="Country"
                  id="specificCountry"
                  placeholder="ex: United Arab Emirates (UAE)"
                  error={errors.specificCountry?.message ? true : false}
                  {...field}
                  options={countries.map((c) => ({
                    label: c.name,
                    value: String(c.id),
                  }))}
                  onReachEnd={() => countryFetchNextPage()}
                  hasNextPage={!!countryHasNextPage}
                  isFetchingNextPage={countryIsFetchingNextPage}
                />
              )}
            />

            <span className={`mx-1 -mt-3 block text-[12px] ${errors.specificCountry?.message ? "text-red-500" : "text-primary"}`}>
              Please specify the country issuing your license.
            </span>
          </>

          <InputField
            id="licenseTitle"
            label="License Title"
            placeholder="ex: License Title"
            {...register("licenseTitle")}
            error={errors.licenseTitle?.message}
          />
          <InputField
            id="licenseNumber"
            label={`License Number`}
            hint={`"Optional"`}
            placeholder="ex: 23121212"
            {...register("licenseNumber")}
            error={errors.licenseNumber?.message}
          />

          <Controller
            name="uploadLicense"
            control={control}
            render={({ field }) => (
              <FilepondUpload
                label="Upload the license image"
                hint={`"Optional"`}
                files={field.value}
                onChange={field.onChange}
                allowMultiple={false}
                maxFiles={1}
                error={errors.uploadLicense?.message}
              />
            )}
          />
        </>
      )}

      {/* Submit Button */}
      <div className="mt-2.5 flex justify-center">
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
    <OTPModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      email={verificationEmail}
      role="candidate"
      purpose="email-confirm"
    />

  </>

  );
};

export default FormCandidateRegister;
