"use client";

import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import { storeUploadedFileAction } from "@/features/candidate-settings/actions/basic-info-actions";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Controller, useFormContext } from "react-hook-form";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetSpecialties from "@/shared/hooks/useGetSpecialties";
import useGetOrganizationSizes from "@/shared/hooks/useGetOrganizationSizes";
import useGetEmployerTypes from "@/shared/hooks/useGetEmployerTypes";
import { useState } from "react";
import { useLocale } from "next-intl";

export default function StepTwo() {
  const locale = useLocale();
  const { register, control, setError, clearErrors, setValue, formState: { errors }, } = useFormContext();

  const [specialtySearch, setSpecialtySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [organizationSizesSearch, setOrganizationSizesSearch] = useState("");
  const [employerTypesSearch, setEmployerTypesSearch] = useState("");
  // const [showExistingCv, setShowExistingCv] = useState(Boolean(profile.cv));

  const {
    countries,
    isLoading: isCountriesLoading,
    error: countriesError,
    hasNextPage: hasMoreCountries,
    fetchNextPage: fetchMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useGetCountries(countrySearch);

  const {
    organizationSizes,
    isLoading: isOrganizationSizesLoading,
    error: organizationSizesError,
    hasNextPage: hasMoreOrganizationSizes,
    fetchNextPage: fetchMoreOrganizationSizes,
    isFetchingNextPage: isFetchingMoreOrganizationSizes,
  } = useGetOrganizationSizes(organizationSizesSearch);

  const {
    employerTypes,
    isLoading: isEmployerTypesLoading,
    error: employerTypesError,
    hasNextPage: hasMoreEmployerTypes,
    fetchNextPage: fetchMoreEmployerTypes,
    isFetchingNextPage: isFetchingMoreEmployerTypes,
  } = useGetEmployerTypes(employerTypesSearch);

  const {
    specialties,
    isLoading: isSpecialtiesLoading,
    error: specialtiesError,
    hasNextPage: hasMoreSpecialties,
    fetchNextPage: fetchMoreSpecialties,
    isFetchingNextPage: isFetchingMoreSpecialties,
  } = useGetSpecialties(specialtySearch);

  return (
    <div className="flex flex-col gap-y-5">
      <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
        <h2 className="text-lg text-disabled font-semibold text-start mt-2">
          Commercial Registration
        </h2>
        <InputField
          id="commercialRegister"
          label="Commercial Registration No"
          type={"text"}
          placeholder="ex: 23121212"
          className="bg-white"
          {...register("commercialRegister")}
          error={errors.commercialRegister?.message?.toString()}
        />

        <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
          <Controller
            name="issuingCountryLicense"
            control={control}
            render={({ field }) => (
              <SelectInputField
                withSearchInput={true}
                id="issuingCountryLicense"
                label="Issuing country of the license"
                placeholder="Select"
                className="bg-white hover:bg-transparent"
                {...field}
                error={
                  errors.issuingCountryLicense?.message?.toString() ??
                  (countriesError instanceof Error
                    ? countriesError.message
                    : undefined)
                }
                options={countries.map((country) => ({
                  label: country.name,
                  value: String(country.id),
                }))}
                disabled={isCountriesLoading}
                onReachEnd={() => fetchMoreCountries()}
                hasNextPage={Boolean(hasMoreCountries)}
                isFetchingNextPage={isFetchingMoreCountries}
                onSearchChange={setCountrySearch}
              />
            )}
          />
          <Controller
            name="organizationSize"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="organizationSize"
                label="Organization Size"
                placeholder="Select"
                className="bg-white"
                {...field}
                error={
                  errors.organizationSize?.message?.toString() ??
                  (organizationSizesError instanceof Error
                    ? organizationSizesError.message
                    : undefined)
                }
                options={organizationSizes.map((size) => ({
                  label: size.title,
                  value: String(size.id),
                }))}
                disabled={isOrganizationSizesLoading}
                onReachEnd={() => fetchMoreOrganizationSizes()}
                hasNextPage={Boolean(hasMoreOrganizationSizes)}
                isFetchingNextPage={isFetchingMoreOrganizationSizes}
                onSearchChange={setOrganizationSizesSearch}
              />
            )}
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
          <InputField
            id="commercialRegistrationIssueDate"
            label="Commercial Registration Issue Date"
            type={"date"}
            placeholder="ex:Dec 2025"
            className="bg-white"
            {...register("commercialRegistrationIssueDate")}
            error={errors.commercialRegistrationIssueDate?.message?.toString()}
          />

          <InputField
            id="commercialRegistrationExpiryDate"
            label="Commercial Registration Expiry Date"
            type={"date"}
            placeholder="ex:Dec 2025"
            className="bg-white"
            {...register("commercialRegistrationExpiryDate")}
            error={errors.commercialRegistrationExpiryDate?.message?.toString()}
          />

        </div>
        <Controller
          name="commercialRegistrationImage"
          control={control}
          render={({ field }) => (
            <StoredFilepondUpload
              className="file-pond-style-custom"
              label="Commercial Registration Image"
              files={field.value}
              onChange={field.onChange}
              allowImagePreview={true}
              acceptedFileTypes={[
                "image/*",
              ]}
              processFile={async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append("image", file);
                return storeUploadedFileAction(uploadFormData, locale);
              }}
              onStoredPathChange={(path) => {
                setValue("commercialRegistrationImagePath", path);
                if (path) {
                  clearErrors("commercialRegistrationImage");
                }
              }}
              onUploadError={(message) => {
                if (!message) {
                  clearErrors("commercialRegistrationImage");
                  return;
                }
                setError("commercialRegistrationImage", {
                  type: "server",
                  message,
                });
              }}
              allowMultiple={false}
              maxFiles={1}
              error={errors.commercialRegistrationImage?.message as string}
            />
          )}
        />

      </div>

      <div className="bg-input p-5 rounded-2xl flex flex-col justify-between gap-y-5">
        <h2 className="text-lg text-disabled font-semibold text-start mt-2">
          Medical License
        </h2>
        <Controller
          name="employerType"
          control={control}
          render={({ field }) => (
            <SelectInputField
              id="employerType"
              label="Employer type"
              placeholder="ex: Full-time"
              className="bg-white"
              {...field}
              error={
                errors.employerType?.message?.toString() ??
                (employerTypesError instanceof Error
                  ? employerTypesError.message
                  : undefined)
              }
              options={employerTypes.map((type) => ({
                label: type.title,
                value: String(type.id),
              }))}
              disabled={isEmployerTypesLoading}
              onReachEnd={() => fetchMoreEmployerTypes()}
              hasNextPage={Boolean(hasMoreEmployerTypes)}
              isFetchingNextPage={isFetchingMoreEmployerTypes}
              onSearchChange={setEmployerTypesSearch}
            />
          )}
        />
        <InputField
          id="medicalFacilityLicenseNumber"
          label="Medical Facility License Number"
          type={"text"}
          placeholder="ex: 23121212"
          className="bg-white"
          {...register("medicalFacilityLicenseNumber")}
          error={errors.medicalFacilityLicenseNumber?.message?.toString()}
        />
        <InputField
          id="licenseIssuingAuthority"
          label="License Issuing Authority"
          type={"text"}
          placeholder="ex: Dubai Health Authority"
          className="bg-white"
          {...register("licenseIssuingAuthority")}
          error={errors.licenseIssuingAuthority?.message?.toString()}
        />
        <Controller
          name="specialtyScopePractice"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Specialty / Scope of Practice"
              id="specialtyScopePractice"
              placeholder="ex: Cardiology"
              withSearchInput
              searchPlaceholder="Search specialties..."
              className="bg-white hover:bg-transparent"
              {...field}
              error={
                errors.specialtyScopePractice?.message?.toString() ??
                (specialtiesError instanceof Error
                  ? specialtiesError.message
                  : undefined)
              }
              options={specialties.map((specialty) => ({
                label: specialty.title,
                value: String(specialty.id),
              }))}
              disabled={isSpecialtiesLoading}
              onReachEnd={() => fetchMoreSpecialties()}
              hasNextPage={Boolean(hasMoreSpecialties)}
              isFetchingNextPage={isFetchingMoreSpecialties}
              onSearchChange={setSpecialtySearch}
            />
          )}
        />

        <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
          <InputField
            id="medicalRegistrationIssueDate"
            label="medical Registration Issue Date"
            type={"date"}
            placeholder="ex:Dec 2025"
            className="bg-white"
            {...register("medicalRegistrationIssueDate")}
            error={errors.medicalRegistrationIssueDate?.message?.toString()}
          />

          <InputField
            id="medicalRegistrationExpiryDate"
            label="medical Registration Expiry Date"
            type={"date"}
            placeholder="ex:Dec 2025"
            className="bg-white"
            {...register("medicalRegistrationExpiryDate")}
            error={errors.medicalRegistrationExpiryDate?.message?.toString()}
          />

        </div>
        <Controller
          name="medicalLicenseImage"
          control={control}
          render={({ field }) => (
            <StoredFilepondUpload
              className="file-pond-style-custom"
              label="Medical License Image"
              files={field.value}
              onChange={field.onChange}
              allowMultiple={false}
              maxFiles={1}
              allowImagePreview={true}
              acceptedFileTypes={[
                "image/*",
              ]}
              processFile={async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append("image", file);
                return storeUploadedFileAction(uploadFormData, locale);
              }}
              onStoredPathChange={(path) => {
                setValue("medicalLicenseImagePath", path);
                if (path) {
                  clearErrors("medicalLicenseImage");
                }
              }}
              onUploadError={(message) => {
                if (!message) {
                  clearErrors("medicalLicenseImage");
                  return;
                }
                setError("medicalLicenseImage", {
                  type: "server",
                  message,
                });
              }}
              error={errors.medicalLicenseImage?.message?.toString()}
            // existingFileUrl={showExistingCv ? profile.cv : null} 
            // existingFileLabel={currentCvLabel}
            // onExistingFileRemove={() => {
            //   setShowExistingCv(false);
            //   setUploadedCvPath(null);
            //   field.onChange([]);
            // }}
            />
          )}
        />

      </div>
    </div>
  );
}