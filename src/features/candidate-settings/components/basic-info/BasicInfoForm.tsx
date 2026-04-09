"use client";

import { InputField } from "@/shared/components/InputField";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetExperiences from "@/shared/hooks/useGetExperiences";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import useGetSpecialties from "@/shared/hooks/useGetSpecialties";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { parsePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import {
  storeUploadedFileAction,
  updateCandidateBasicInfoAction,
} from "../../actions/basic-info-actions";
import type { CandidateSettingsProfile } from "../../services/basic-info-service";
import {
  SettingBasicInfoSchema,
  type TSettingBasicInfoSchema,
} from "../../validation/basic-info-schema";
import ProfileImage from "./ProfileImage";

interface BasicInfoFormProps {
  profile: CandidateSettingsProfile;
}

const BasicInfoForm = ({ profile }: BasicInfoFormProps) => {
  const locale = useLocale();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [jobTitleSearch, setJobTitleSearch] = useState("");
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [uploadedCvPath, setUploadedCvPath] = useState<string | null>(null);
  const [showExistingCv, setShowExistingCv] = useState(Boolean(profile.cv));
  const defaultValues = useMemo<TSettingBasicInfoSchema>(
    () => ({
      fullName: profile.name,
      email: profile.email,
      phoneNumber:
        profile.phoneCode && profile.phone
          ? `${profile.phoneCode}${profile.phone}`
          : profile.phone,
      jobTitle: profile.jobTitleId,
      specialty: profile.specialtyId,
      yearsOfExperience: profile.experienceId,
      country: profile.countryId,
      city: profile.cityId,
      dateOfBirth: profile.birthDate,
      profileImage: [],
      uploadCV: [],
    }),
    [profile],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TSettingBasicInfoSchema>({
    resolver: zodResolver(SettingBasicInfoSchema),
    mode: "onChange",
    defaultValues,
  });

  const selectedCountryId = useWatch({ control, name: "country" });
  const previousCountryId = useRef<string | undefined>(profile.countryId);
  const {
    jobTitles,
    isLoading: isJobTitlesLoading,
    error: jobTitlesError,
    hasNextPage: hasMoreJobTitles,
    fetchNextPage: fetchMoreJobTitles,
    isFetchingNextPage: isFetchingMoreJobTitles,
  } = useGetJobTitles(jobTitleSearch);
  const {
    specialties,
    isLoading: isSpecialtiesLoading,
    error: specialtiesError,
    hasNextPage: hasMoreSpecialties,
    fetchNextPage: fetchMoreSpecialties,
    isFetchingNextPage: isFetchingMoreSpecialties,
  } = useGetSpecialties(specialtySearch);
  const {
    experiences,
    isLoading: isExperiencesLoading,
    error: experiencesError,
    hasNextPage: hasMoreExperiences,
    fetchNextPage: fetchMoreExperiences,
    isFetchingNextPage: isFetchingMoreExperiences,
  } = useGetExperiences(experienceSearch);
  const {
    countries,
    isLoading: isCountriesLoading,
    error: countriesError,
    hasNextPage: hasMoreCountries,
    fetchNextPage: fetchMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useGetCountries(countrySearch);
  const {
    cities,
    isLoading: isCitiesLoading,
    error: citiesError,
    hasNextPage: hasMoreCities,
    fetchNextPage: fetchMoreCities,
    isFetchingNextPage: isFetchingMoreCities,
  } = useGetCitiesByCountryId(Number(selectedCountryId), citySearch);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!selectedCountryId) {
      setValue("city", "");
    }
  }, [selectedCountryId, setValue]);

  useEffect(() => {
    setUploadedImagePath(null);
    setUploadedCvPath(null);
    setShowExistingCv(Boolean(profile.cv));
  }, [profile.image, profile.cv]);

  const currentCvLabel = useMemo(() => {
    if (!profile.cv) {
      return null;
    }

    try {
      const pathname = new URL(profile.cv).pathname;
      return decodeURIComponent(pathname.split("/").filter(Boolean).pop() ?? "Current CV");
    } catch {
      return decodeURIComponent(profile.cv.split("/").filter(Boolean).pop() ?? "Current CV");
    }
  }, [profile.cv]);

  useEffect(() => {
    if (
      previousCountryId.current &&
      selectedCountryId &&
      previousCountryId.current !== selectedCountryId
    ) {
      setValue("city", "");
      setCitySearch("");
    }

    previousCountryId.current = selectedCountryId;
  }, [selectedCountryId, setValue]);

  const onSubmit: SubmitHandler<TSettingBasicInfoSchema> = async (data) => {
    const parsedPhone = parsePhoneNumber(data.phoneNumber);

    if (!parsedPhone) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", data.fullName.trim());
      formData.append("phone", parsedPhone.nationalNumber ?? "");
      formData.append("phone_code", `+${parsedPhone.countryCallingCode ?? ""}`);
      formData.append("job_title_id", data.jobTitle);
      formData.append("specialty_id", data.specialty);
      formData.append("country_id", data.country);
      formData.append("city_id", data.city);
      formData.append("experience_id", data.yearsOfExperience);
      formData.append("birth_date", data.dateOfBirth);

      if (uploadedImagePath) {
        formData.append("image", uploadedImagePath);
      }

      if (uploadedCvPath) {
        formData.append("cv", uploadedCvPath);
      }

      const response = await updateCandidateBasicInfoAction(formData, locale);
      toast.success(response.message ?? "Profile updated successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update profile information.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-5"
    >
      <div className="flex w-full flex-col">
        <h3 className="mx-1 mb-1 text-base font-semibold">Profile Picture</h3>
        <Controller
          name="profileImage"
          control={control}
          render={({ field }) => (
            <ProfileImage
              value={field.value?.length ? field.value : profile.image}
              onChange={async (files) => {
                field.onChange(files);

                const imageFile = files[0];
                if (!(imageFile instanceof File)) {
                  setUploadedImagePath(null);
                  return;
                }

                clearErrors("profileImage");

                try {
                  const uploadFormData = new FormData();
                  uploadFormData.append("image", imageFile);
                  const result = await storeUploadedFileAction(uploadFormData, locale);
                  setUploadedImagePath(result.path);
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : "Failed to upload profile image.";
                  setUploadedImagePath(null);
                  setError("profileImage", {
                    type: "server",
                    message,
                  });
                }
              }}
              error={errors.profileImage?.message}
            />
          )}
        />
      </div>

      <InputField
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="ex: JooCore"
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="ex: mail@mail.com"
        disabled
        {...register("email")}
        error={errors.email?.message}
      />

      <div>
        <label htmlFor="phoneNumber" className="mx-1 mb-1 block font-semibold">
          Phone number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              defaultCountry="EG"
              id="phoneNumber"
              className="w-full"
              placeholder="ex:52 987 6543"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={Boolean(errors.phoneNumber?.message)}
            />
          )}
        />
        {errors.phoneNumber ? (
          <span className="mt-1 text-[12px] text-red-500">
            {errors.phoneNumber.message}
          </span>
        ) : null}
      </div>

      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            placeholder="ex: Consultant Internist"
            withSearchInput
            searchPlaceholder="Search job titles..."
            {...field}
            error={
              errors.jobTitle?.message ??
              (jobTitlesError instanceof Error
                ? jobTitlesError.message
                : undefined)
            }
            options={jobTitles.map((jobTitle) => ({
              label: jobTitle.title,
              value: String(jobTitle.id),
            }))}
            disabled={isJobTitlesLoading}
            onReachEnd={() => fetchMoreJobTitles()}
            hasNextPage={Boolean(hasMoreJobTitles)}
            isFetchingNextPage={isFetchingMoreJobTitles}
            onSearchChange={setJobTitleSearch}
          />
        )}
      />

      <div className="flex flex-col items-center gap-2 lg:flex-row">
        <Controller
          name="specialty"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Specialty"
              id="specialty"
              placeholder="ex: Cardiology"
              withSearchInput
              searchPlaceholder="Search specialties..."
              {...field}
              error={
                errors.specialty?.message ??
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
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Years of Experience"
              id="yearsOfExperience"
              placeholder="ex: 3-5 years"
              withSearchInput
              searchPlaceholder="Search experience..."
              {...field}
              error={
                errors.yearsOfExperience?.message ??
                (experiencesError instanceof Error
                  ? experiencesError.message
                  : undefined)
              }
              options={experiences.map((experience) => ({
                label: experience.title,
                value: String(experience.id),
              }))}
              disabled={isExperiencesLoading}
              onReachEnd={() => fetchMoreExperiences()}
              hasNextPage={Boolean(hasMoreExperiences)}
              isFetchingNextPage={isFetchingMoreExperiences}
              onSearchChange={setExperienceSearch}
            />
          )}
        />
      </div>

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
                withSearchInput
                searchPlaceholder="Search countries..."
                {...field}
                error={
                  errors.country?.message ??
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
            name="city"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="city"
                placeholder="city"
                withSearchInput
                searchPlaceholder="Search cities..."
                {...field}
                error={
                  errors.city?.message ??
                  (citiesError instanceof Error
                    ? citiesError.message
                    : undefined)
                }
                options={cities.map((city) => ({
                  label: city.name,
                  value: String(city.id),
                }))}
                disabled={!selectedCountryId || isCitiesLoading}
                onReachEnd={() => fetchMoreCities()}
                hasNextPage={Boolean(hasMoreCities)}
                isFetchingNextPage={isFetchingMoreCities}
                onSearchChange={setCitySearch}
              />
            )}
          />
        </div>
      </div>

      <InputField
        id="dateOfBirth"
        type="date"
        label="Date of birth"
        {...register("dateOfBirth")}
        error={errors.dateOfBirth?.message}
      />

      <Controller
        name="uploadCV"
        control={control}
        render={({ field }) => (
          <StoredFilepondUpload
            label="Upload CV"
            hint={`"Optional"`}
            files={field.value}
            onChange={field.onChange}
            allowImagePreview={false}
            acceptedFileTypes={[
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ]}
            processFile={async (file) => {
              const uploadFormData = new FormData();
              uploadFormData.append("image", file);
              return storeUploadedFileAction(uploadFormData, locale);
            }}
            onStoredPathChange={(path) => {
              setUploadedCvPath(path);
              if (path) {
                clearErrors("uploadCV");
              }
            }}
            onUploadError={(message) => {
              if (!message) {
                clearErrors("uploadCV");
                return;
              }

              setError("uploadCV", {
                type: "server",
                message,
              });
            }}
            existingFileUrl={showExistingCv ? profile.cv : null}
            existingFileLabel={currentCvLabel}
            onExistingFileRemove={() => {
              setShowExistingCv(false);
              setUploadedCvPath(null);
              field.onChange([]);
            }}
            allowMultiple={false}
            maxFiles={1}
            error={errors.uploadCV?.message}
          />
        )}
      />

      <div className="flex items-center justify-center">
        <Button
          variant={"secondary"}
          hoverStyle={"slidePrimary"}
          size={"pill"}
          className="w-1/3 md:w-56"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
