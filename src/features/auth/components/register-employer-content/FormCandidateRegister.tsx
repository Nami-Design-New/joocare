"use client";

import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { InputField } from "@/shared/components/InputField";
import LabelCheckbox from "@/shared/components/LabelCheckbox";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import { useEffect, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { useRegisterCandidate } from "../../hooks/useRegisterCandidate";
import {
  createRegisterCandidateSchema,
  TRegisterCandidateSchema,
} from "../../validation/candidate-register-schema";
import { OTPModal } from "../forget-password/OtpModal";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import { FilepondUpload } from "@/shared/components/FilepondUpload";

const OTHER_JOB_TITLE_VALUE = "__other__";
const CV_ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FormCandidateRegister = () => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countrySearchCurrent, setCountrySearchCurrent] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [jobTitleSearch, setJobTitleSearch] = useState("");
  const { jobTitles, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetJobTitles(jobTitleSearch);
  const { countries: currentCountries, hasNextPage: currentCountryHasNextPage, fetchNextPage: currentCountryFetchNextPage, isFetchingNextPage: currentCountryIsFetchingNextPage } = useGetCountries(countrySearchCurrent);
  const { countries, hasNextPage: countryHasNextPage, fetchNextPage: countryFetchNextPage, isFetchingNextPage: countryIsFetchingNextPage } = useGetCountries(countrySearch);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TRegisterCandidateSchema>({
    resolver: typedZodResolver(
      createRegisterCandidateSchema({
        phoneRequired: t("authPage.validation.phone-required"),
        phoneInvalid: t("authPage.validation.phone-invalid"),
        phoneDigits: t("authPage.validation.phone-digits"),
        fullNameRequired: t("authPage.validation.full-name-required"),
        fullNameMin: t("authPage.validation.full-name-min"),
        emailRequired: t("authPage.validation.email-required"),
        emailInvalid: t("authPage.validation.email-invalid-detailed"),
        jobTitleRequired: t("authPage.validation.job-title-required"),
        countryRequired: t("authPage.validation.country-required"),
        cityRequired: t("authPage.validation.city-required"),
        passwordRequired: t("authPage.validation.password-required"),
        passwordMin: t("authPage.validation.password-min"),
        passwordMax: t("authPage.validation.password-max"),
        cvRequired: t("authPage.validation.cv-required"),
        otherJobTitleRequired: t("authPage.validation.other-job-title-required"),
        licenseCountryRequired: t("authPage.validation.license-country-required"),
        licenseTitleRequired: t("authPage.validation.license-title-required"),
        licenseTitleMin: t("authPage.validation.license-title-min"),
        licenseTitleMax: t("authPage.validation.license-title-max"),
      }),
    ),
    defaultValues: {
      uploadCV: "",
      confirmRegister: false,
      uploadLicense: "",
    },
    mode: "onChange", // Validate on blur for better UX
    shouldUnregister: true,
  });

  const verificationEmail = useWatch({ control, name: "email" });
  const countryId = useWatch({ control, name: "country" });
  const selectedJobTitle = useWatch({ control, name: "jobTitle" });
  const { cities, hasNextPage: cityHasNextPage, fetchNextPage: cityFetchNextPage, isFetchingNextPage: cityIsFetchingNextPage } = useGetCitiesByCountryId(Number(countryId));

  const confirmRegisterValue = useWatch({ control, name: "confirmRegister" });
  const isOtherJobTitle = selectedJobTitle === OTHER_JOB_TITLE_VALUE;
  const jobTitleOptions = [
    { label: t("authPage.common.other"), value: OTHER_JOB_TITLE_VALUE },
    ...jobTitles.map((jt) => ({
      label: jt.title,
      value: String(jt.id),
    })),
  ];
  const { mutate: submitRegister, isPending } = useRegisterCandidate(() =>
    setIsModalOpen(true)
  );

  useEffect(() => {
    if (confirmRegisterValue) {
      return;
    }

    setValue("specificCountry", "");
    setValue("licenseTitle", "");
    setValue("licenseNumber", "");
    setValue("uploadLicense", "");
    clearErrors([
      "specificCountry",
      "licenseTitle",
      "licenseNumber",
      "uploadLicense",
    ]);
  }, [clearErrors, confirmRegisterValue, setValue]);

  const onSubmit: SubmitHandler<TRegisterCandidateSchema> = (data) => {
    // console.log("data registdere", data);

    const parsed = parsePhoneNumber(data.phoneNumber);

    submitRegister({
      name: data.fullName,
      email: data.email,
      phone: parsed?.nationalNumber ?? "",
      phone_code: `+${parsed?.countryCallingCode ?? ""}`,
      job_title_id: data.jobTitle === OTHER_JOB_TITLE_VALUE ? undefined : data.jobTitle,
      title:
        data.jobTitle === OTHER_JOB_TITLE_VALUE
          ? data.otherJobTitle.trim()
          : undefined,
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

  const handleCvUploadError = (message: string | null) => {
    if (!message) {
      clearErrors("uploadCV");
      return;
    }

    setError("uploadCV", {
      type: "manual",
      message,
    });
  };

  const handleLicenseUploadError = (message: string | null) => {
    if (!message) {
      clearErrors("uploadLicense");
      return;
    }

    setError("uploadLicense", {
      type: "manual",
      message,
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
        label={t("authPage.common.full-name")}
        type="text"
        placeholder={t("authPage.placeholders.full-name")}
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      {/* Email */}
      <InputField
        id="email"
        type="email"
        label={t("authPage.common.email")}
        placeholder={t("authPage.placeholders.email")}
        {...register("email")}
        error={errors.email?.message}
      />

      <>
        <label htmlFor="phoneNumber" className="mx-1 -mb-4 font-semibold">
          {t("authPage.common.phone-number")}
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              {...field}
              defaultCountry="AE"
              id="phoneNumber"
              className="w-full"
              placeholder={t("authPage.placeholders.phone-number")}
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
            label={t("authPage.common.job-title")}
            withSearchInput={true}
            onSearchChange={setJobTitleSearch}
            placeholder={t("authPage.placeholders.job-title")}
            {...field}
            error={errors.jobTitle?.message ?? (error instanceof Error ? error.message : undefined)}
            options={jobTitleOptions}

            disabled={isLoading}
            onReachEnd={() => fetchNextPage()}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      />

      {isOtherJobTitle && (
        <InputField
          id="otherJobTitle"
          type="text"
          label={t("authPage.common.other-job-title")}
          placeholder={t("authPage.placeholders.job-title")}
          {...register("otherJobTitle")}
          error={errors.otherJobTitle?.message}
        />
      )}

      {/* Current Location */}
      <div>
        <label htmlFor="country" className="mx-1 mb-2 block font-semibold">
          {t("authPage.common.current-location")}
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                withSearchInput
                onSearchChange={setCountrySearchCurrent}
                id="country"
                placeholder={t("authPage.common.country-lower")}
                {...field}
                options={currentCountries.map((c) => ({
                  label: c.name,
                  value: String(c.id),
                }))}
                error={errors.country?.message}
                onReachEnd={() => currentCountryFetchNextPage()}
                hasNextPage={!!currentCountryHasNextPage}
                isFetchingNextPage={currentCountryIsFetchingNextPage}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SelectInputField
                withSearchInput
                id="city"
                placeholder={t("authPage.common.city-lower")}
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
        label={t("authPage.common.create-password")}
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
            label={t("authPage.common.upload-cv")}
            value={field.value}
            acceptedFileTypes={CV_ACCEPTED_FILE_TYPES}
            invalidTypeMessage={t("authPage.validation.cv-invalid-type")}
            onUploadSuccess={(imagePath) => {
              field.onChange(imagePath);
              clearErrors("uploadCV");
            }}
            onUploadError={handleCvUploadError}
            onRemove={() => {
              field.onChange("");
              clearErrors("uploadCV");
            }}
            allowMultiple={false}
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
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
            {t("authPage.forms.candidate-register.has-medical-license")}
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
                  withSearchInput
                  onSearchChange={setCountrySearch}
                  label={t("authPage.common.country")}
                  id="specificCountry"
                  placeholder={t("authPage.placeholders.license-country")}
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
              {t("authPage.forms.candidate-register.license-country-help")}
            </span>
          </>

          <InputField
            id="licenseTitle"
            label={t("authPage.common.license-title")}
            placeholder={t("authPage.placeholders.license-title")}
            {...register("licenseTitle")}
            error={errors.licenseTitle?.message}
          />
          <InputField
            id="licenseNumber"
            label={t("authPage.common.license-number")}
            hint={t("authPage.common.optional")}
            placeholder={t("authPage.placeholders.license-number")}
            {...register("licenseNumber")}
            error={errors.licenseNumber?.message}
          />

          <Controller
            name="uploadLicense"
            control={control}
            render={({ field }) => (
              <FilepondUpload
                label={t("authPage.common.upload-license-image")}
                hint={t("authPage.common.optional")}
                value={field.value}
                onUploadSuccess={(imagePath) => {
                  field.onChange(imagePath);
                  clearErrors("uploadLicense");
                }}
                onUploadError={handleLicenseUploadError}
                onRemove={() => {
                  field.onChange("");
                  clearErrors("uploadLicense");
                }}
                allowMultiple={false}
                maxFiles={1}
                error={errors.uploadLicense?.message}
                maxSize={5 * 1024 * 1024}
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
          disabled={isPending}
        >
          {isPending ? t("authPage.common.registering") : t("authPage.common.register")}
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
