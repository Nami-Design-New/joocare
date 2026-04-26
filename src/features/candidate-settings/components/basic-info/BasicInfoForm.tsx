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
import {
  getCountryCodeByPhoneCode,
  getNationalPhoneValue,
  parsePhoneWithCode,
} from "@/shared/lib/phone";
import { typedZodResolver } from "@/shared/lib/typed-zod-resolver";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import {
  storeUploadedFileAction,
  updateCandidateBasicInfoAction,
} from "../../actions/basic-info-actions";
import type { CandidateSettingsProfile } from "../../services/basic-info-service";
import {
  createSettingBasicInfoSchema,
  type TSettingBasicInfoSchema,
} from "../../validation/basic-info-schema";
import ProfileImage from "./ProfileImage";
import { useQueryClient } from "@tanstack/react-query";

interface BasicInfoFormProps {
  profile: CandidateSettingsProfile;
}

const OTHER_JOB_TITLE_VALUE = "__other__";

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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [showExistingProfileImage, setShowExistingProfileImage] = useState(Boolean(profile.image));
  const [showExistingCv, setShowExistingCv] = useState(Boolean(profile.cv));
  const imageUploadRequestIdRef = useRef(0);
  const defaultValues = useMemo<TSettingBasicInfoSchema>(
    () => ({
      fullName: profile.name,
      email: profile.email,
      phoneNumber: getNationalPhoneValue(profile.phone, profile.phoneCode),
      jobTitle: profile.jobTitleId || (profile.jobTitle ? OTHER_JOB_TITLE_VALUE : ""),
      otherJobTitle: profile.jobTitleId ? "" : profile.jobTitle,
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
  const basicInfoSchema = useMemo(
    () =>
      createSettingBasicInfoSchema({
        requireCv: !(profile.cv && showExistingCv),
      }),
    [profile.cv, showExistingCv],
  );
  const queryClient = useQueryClient()
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
    resolver: typedZodResolver(basicInfoSchema),
    mode: "onChange",
    defaultValues,
  });

  const selectedCountryId = useWatch({ control, name: "country" });
  const selectedJobTitle = useWatch({ control, name: "jobTitle" });
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
    if (selectedJobTitle !== OTHER_JOB_TITLE_VALUE) {
      setValue("otherJobTitle", "");
    }
  }, [selectedJobTitle, setValue]);

  useEffect(() => {
    setUploadedImagePath(null);
    setUploadedCvPath(null);
    setIsImageUploading(false);
    setShowExistingProfileImage(Boolean(profile.image));
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

  const jobTitleOptions = useMemo(
    () => [
      ...jobTitles
        .map((jobTitle) => ({
          label: String(jobTitle.title ?? ""),
          value: String(jobTitle.id),
        }))
        .filter((jobTitle) => jobTitle.label),
      { label: "Other", value: OTHER_JOB_TITLE_VALUE },
    ],
    [jobTitles],
  );

  const isOtherJobTitle = selectedJobTitle === OTHER_JOB_TITLE_VALUE;

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
    const parsedPhone = parsePhoneWithCode(data.phoneNumber, profile.phoneCode);

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
      if (data.jobTitle === OTHER_JOB_TITLE_VALUE) {
        formData.append("title", data.otherJobTitle.trim());
      } else {
        formData.append("job_title_id", data.jobTitle);
      }
      formData.append("specialty_id", data.specialty);
      formData.append("country_id", data.country);
      formData.append("city_id", data.city);
      formData.append("experience_id", data.yearsOfExperience);
      formData.append("birth_date", data.dateOfBirth);

      if (uploadedImagePath !== null) {
        formData.append("image", uploadedImagePath);
      }

      if (uploadedCvPath) {
        formData.append("cv", uploadedCvPath);
      }

      const response = await updateCandidateBasicInfoAction(formData, locale);
      toast.success(response.message ?? "Profile updated successfully.");
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] })
      router.push("/candidate/profile");
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
              value={
                field.value?.length
                  ? field.value
                  : showExistingProfileImage
                    ? profile.image
                    : null
              }
              onChange={async (files) => {
                field.onChange(files);

                const imageFile = files[0];
                if (!(imageFile instanceof File)) {
                  imageUploadRequestIdRef.current += 1;
                  setIsImageUploading(false);
                  setUploadedImagePath(null);
                  return;
                }

                const requestId = imageUploadRequestIdRef.current + 1;
                imageUploadRequestIdRef.current = requestId;
                setShowExistingProfileImage(false);
                clearErrors("profileImage");
                setIsImageUploading(true);

                try {
                  const uploadFormData = new FormData();
                  uploadFormData.append("image", imageFile);
                  const result = await storeUploadedFileAction(uploadFormData, locale);

                  if (imageUploadRequestIdRef.current !== requestId) {
                    return;
                  }

                  setUploadedImagePath(result.path);
                } catch (error) {
                  if (imageUploadRequestIdRef.current !== requestId) {
                    return;
                  }

                  const message =
                    error instanceof Error ? error.message : "Failed to upload profile image.";
                  setUploadedImagePath(null);
                  setError("profileImage", {
                    type: "server",
                    message,
                  });
                } finally {
                  if (imageUploadRequestIdRef.current === requestId) {
                    setIsImageUploading(false);
                  }
                }
              }}
              onRemove={() => {
                imageUploadRequestIdRef.current += 1;
                setIsImageUploading(false);
                setShowExistingProfileImage(false);
                setUploadedImagePath("");
                field.onChange([]);
                clearErrors("profileImage");
              }}
              error={errors.profileImage?.message}
              isUploading={isImageUploading}
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
              defaultCountry={getCountryCodeByPhoneCode(profile.phoneCode)}
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
            options={jobTitleOptions}
            disabled={isJobTitlesLoading}
            onReachEnd={() => fetchMoreJobTitles()}
            hasNextPage={Boolean(hasMoreJobTitles)}
            isFetchingNextPage={isFetchingMoreJobTitles}
            onSearchChange={setJobTitleSearch}
          />
        )}
      />

      {isOtherJobTitle && (
        <InputField
          id="otherJobTitle"
          type="text"
          label="Other Job Title"
          placeholder="ex: Consultant Internist"
          {...register("otherJobTitle")}
          error={errors.otherJobTitle?.message}
        />
      )}

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
            files={field.value}
            onChange={field.onChange}
            required={!(profile.cv && showExistingCv)}
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
          disabled={isSaving || isImageUploading}
        >
          {isSaving ? "Saving..." : isImageUploading ? "Uploading image..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
