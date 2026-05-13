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
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
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
import { useDeleteImageUser } from "../../hooks/useDeleteImageUser";

interface BasicInfoFormProps {
  profile: CandidateSettingsProfile;
}

const OTHER_JOB_TITLE_VALUE = "__other__";
const CV_ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const BasicInfoForm = ({ profile }: BasicInfoFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const [isSaving, setIsSaving] = useState(false);
  const [jobTitleSearch, setJobTitleSearch] = useState("");
  // const [specialtySearch, setSpecialtySearch] = useState("");
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
      specialty: profile.specialty_title,
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
  const { mutateAsync: deleteImageUser, isPending: isDeletingImage } = useDeleteImageUser({ token });
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
  // const {
  //   specialties,
  //   isLoading: isSpecialtiesLoading,
  //   error: specialtiesError,
  //   hasNextPage: hasMoreSpecialties,
  //   fetchNextPage: fetchMoreSpecialties,
  //   isFetchingNextPage: isFetchingMoreSpecialties,
  // } = useGetSpecialties(specialtySearch);
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
      { label: t("authPage.common.other"), value: OTHER_JOB_TITLE_VALUE },
      ...jobTitles
        .map((jobTitle) => ({
          label: String(jobTitle.title ?? ""),
          value: String(jobTitle.id),
        }))
        .filter((jobTitle) => jobTitle.label),
    ],
    [jobTitles, t],
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
      toast.error(t("candidateSettingsPage.toasts.invalid-phone"));
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
      formData.append("specialty_title", data.specialty);
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
      toast.success(response.message ?? t("candidateSettingsPage.toasts.profile-updated"));
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] })
      router.push("/candidate/profile");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("candidateSettingsPage.toasts.profile-update-failed");
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
        <h3 className="mx-1 mb-1 text-base font-semibold">{t("candidateSettingsPage.profile-picture")}</h3>
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
                    error instanceof Error ? error.message : t("candidateSettingsPage.toasts.upload-profile-image-failed");
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
                const shouldDeleteExistingImage =
                  showExistingProfileImage && Boolean(profile.image) && !field.value?.length;

                if (shouldDeleteExistingImage) {
                  deleteImageUser()
                    .then(() => {
                      setShowExistingProfileImage(false);
                      setUploadedImagePath("");
                      field.onChange([]);
                      clearErrors("profileImage");
                      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
                    })
                    .catch(() => {
                      // The mutation hook already shows the error toast.
                    });

                  return;
                }

                setShowExistingProfileImage(false);
                setUploadedImagePath("");
                field.onChange([]);
                clearErrors("profileImage");
              }}
              error={errors.profileImage?.message}
              isUploading={isImageUploading || isDeletingImage}
            />
          )}
        />
      </div>

      <InputField
        id="fullName"
        label={t("authPage.common.full-name")}
        type="text"
        placeholder={t("authPage.placeholders.full-name")}
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <InputField
        id="email"
        type="email"
        label={t("authPage.common.email")}
        placeholder={t("authPage.placeholders.email")}
        disabled
        {...register("email")}
        error={errors.email?.message}
      />

      <div>
        <label htmlFor="phoneNumber" className="mx-1 mb-1 block font-semibold">
          {t("authPage.common.phone-number")}
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              defaultCountry={getCountryCodeByPhoneCode(profile.phoneCode)}
              id="phoneNumber"
              className="w-full"
              placeholder={t("authPage.placeholders.phone-number")}
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
            label={t("authPage.common.job-title")}
            placeholder={t("candidateSettingsPage.placeholders.job-title")}
            withSearchInput
            searchPlaceholder={t("candidateSettingsPage.placeholders.search-job-titles")}
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
          label={t("authPage.common.other-job-title")}
          placeholder={t("candidateSettingsPage.placeholders.job-title")}
          {...register("otherJobTitle")}
          error={errors.otherJobTitle?.message}
        />
      )}

      <div className="flex flex-col items-center gap-2 lg:flex-row">
        {/* <Controller
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
        /> */}
        <InputField
          id="specialty"
          label={t("jobDetailsPage.specialty")}
          type={"text"}
          placeholder={t("candidateSettingsPage.placeholders.specialty")}
          // className="bg-white"
          {...register("specialty")}
          error={errors.specialty?.message?.toString()}
        />
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label={t("candidateSettingsPage.years-of-experience")}
              id="yearsOfExperience"
              placeholder={t("candidateSettingsPage.placeholders.years-of-experience")}
              withSearchInput
              searchPlaceholder={t("candidateSettingsPage.placeholders.search-experience")}
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
          {t("authPage.common.current-location")}
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                placeholder={t("authPage.common.country-lower")}
                withSearchInput
                searchPlaceholder={t("candidatePage.profile.search-countries")}
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
                placeholder={t("authPage.common.city-lower")}
                withSearchInput
                searchPlaceholder={t("candidateSettingsPage.placeholders.search-cities")}
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
        label={t("candidateSettingsPage.date-of-birth")}
        {...register("dateOfBirth")}
        error={errors.dateOfBirth?.message}
      />

      <Controller
        name="uploadCV"
        control={control}
        render={({ field }) => (
          <StoredFilepondUpload
            label={t("jobDetailsPage.upload-cv")}
            files={field.value}
            onChange={field.onChange}
            required={!(profile.cv && showExistingCv)}
            allowImagePreview={false}
            acceptedFileTypes={CV_ACCEPTED_FILE_TYPES}
            invalidTypeMessage={t("authPage.validation.cv-invalid-type")}
            maxSize={5 * 1024 * 1024}
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
              clearErrors("uploadCV");
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
          disabled={isSaving || isImageUploading || isDeletingImage}
        >
          {isSaving
            ? t("candidatePage.common.saving")
            : isImageUploading
              ? t("candidateSettingsPage.common.uploading-image")
              : isDeletingImage
                ? t("candidateSettingsPage.common.deleting-image")
                : t("common.save")}
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
