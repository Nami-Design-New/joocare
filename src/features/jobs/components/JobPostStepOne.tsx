"use client";

import { InputField } from "@/shared/components/InputField";
import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";
import { useTranslations } from "next-intl";

// import hooks for fetching select options
import useGetAvailabilities from "@/shared/hooks/useGetAvailabilities";
import useGetCategories from "@/shared/hooks/useGetCategories";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCurrencies from "@/shared/hooks/useGetCurrencies";
import useGetEducationLevels from "@/shared/hooks/useGetEducationLevels";
import useGetExperiences from "@/shared/hooks/useGetExperiences";
import useGetMandatoryCertifications from "@/shared/hooks/useGetMandatoryCertifications";
import useGetRoleCategories from "@/shared/hooks/useGetRoleCategories";
import useGetSalaryTypes from "@/shared/hooks/useGetSalaryTypes";
import useGetSeniorityLevels from "@/shared/hooks/useGetSeniorityLevels";
import { useMemo, useState } from "react";
import { JobPostStepOneSkeleton } from "./JobPostStepOneSkeleton";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import useGetEmploymentTypes from "@/shared/hooks/useGetEmploymentTypes";
import type { Option } from "@/shared/components/SelectInputField";
import { JobDetails } from "../types/jobs.types";

const CUSTOM_CERTIFICATION_PREFIX = "__custom__:";
const OTHER_OPTION_VALUE = "__other__";

type LookupOptionItem = {
  id?: number | string;
  title?: string;
  name?: string;
  code?: string;
};

type PersistedOptions = Partial<Record<"title" | "country" | "city", Option>>;
type PreviewLabelKey =
  | "title"
  | "employmentType"
  | "salaryType"
  | "currency"
  | "category"
  | "specialty"
  | "roleCategory"
  | "seniorityLevel"
  | "country"
  | "city"
  | "yearsOfExperience"
  | "educationLevel"
  | "mandatoryCertifications"
  | "availability";

function mergePersistedOption(options: Option[], persisted?: Option) {
  if (!persisted) return options;
  if (options.some((option) => option.value === persisted.value)) {
    return options;
  }

  return [persisted, ...options];
}

function toSelectOptions(items: LookupOptionItem[]) {
  return items.map((item) => ({
    label: item.title ?? item.name ?? "",
    value: String(item.id ?? ""),
  }));
}

function getOptionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function getOptionLabels(options: Option[], values: string[]) {
  return values.map((value) => getOptionLabel(options, value));
}

// ─── tiny helper: surface zod error message under a field ───────────────────
function FieldError({ name }: { name: string }) {
  const t = useTranslations();
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

  let translatedMessage: string;
  try {
    translatedMessage = t(error.message as never);
  } catch {
    translatedMessage = error.message;
  }

  return <p className="mt-1 text-xs text-red-500">{translatedMessage}</p>;
}



function JobPostStepOneContent({
  persistedOptions,
  onPersistOption,
  onPreviewLabelChange,
  existingJob,
}: {
  persistedOptions?: PersistedOptions;
  onPersistOption?: (key: keyof PersistedOptions, option?: Option) => void;
  onPreviewLabelChange?: (key: PreviewLabelKey, value: string | string[]) => void;
  existingJob?: JobDetails | null;
}) {
  const t = useTranslations();

  const translateMessage = (message?: string) => {
    if (!message) return undefined;
    try {
      return t(message as never);
    } catch {
      return message;
    }
  };

  // search states
  // const [specialtySearch, setSpecialtySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  // const [organizationSizesSearch, setOrganizationSizesSearch] = useState("");
  // const [employerTypesSearch, setEmployerTypesSearch] = useState("");
  const [employmentTypesSearch, setEmploymentTypesSearch] = useState("");
  const [jobTitlesSearch, setJobTitlesSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [roleCategorySearch, setRoleCategorySearch] = useState("");
  const [seniorityLevelsSearch, setSeniorityLevelsSearch] = useState("");
  const [experienceSearch, setExperienceSearch] = useState("");
  const [mandatoryCertificationsSearch, setMandatoryCertificationsSearch] = useState("");
  const [educationLevelsSearch, setEducationLevelsSearch] = useState("");
  const [availabilitiesSearch, setAvailabilitiesSearch] = useState("");
  const [salaryTypesSearch, setSalaryTypesSearch] = useState("");
  const [currenciesSearch, setCurrenciesSearch] = useState("");
  const [newMandatoryCertification, setNewMandatoryCertification] = useState("");
  const {
    control,
    register,
    clearErrors,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<JobFormData>();
  // countries data
  const {
    countries,
    isLoading: isCountriesLoading,
    error: countriesError,
    hasNextPage: hasMoreCountries,
    fetchNextPage: fetchMoreCountries,
    isFetchingNextPage: isFetchingMoreCountries,
  } = useGetCountries(countrySearch);
  const selectedCountry = watch("country");
  const selectedRoleCategory = watch("roleCategory");
  const selectedCountryId = selectedCountry ? Number(selectedCountry) : null;
  const selectedRoleCategoryId = selectedRoleCategory
    ? Number(selectedRoleCategory)
    : null;
  const {
    cities,
    isLoading: citiesLoading,
    error: citiesError,
    hasNextPage: citiesHasNextPage,
    fetchNextPage: citiesFetchNextPage,
    isFetchingNextPage: citiesIsFetchingNextPage,
  } = useGetCitiesByCountryId(selectedCountryId ?? 0, citySearch);
  // const {
  //   organizationSizes,
  //   isLoading: isOrganizationSizesLoading,
  //   error: organizationSizesError,
  //   hasNextPage: hasMoreOrganizationSizes,
  //   fetchNextPage: fetchMoreOrganizationSizes,
  //   isFetchingNextPage: isFetchingMoreOrganizationSizes,
  // } = useGetOrganizationSizes(organizationSizesSearch);
  // const {
  //   employerTypes,
  //   isLoading: isEmployerTypesLoading,
  //   error: employerTypesError,
  //   hasNextPage: hasMoreEmployerTypes,
  //   fetchNextPage: fetchMoreEmployerTypes,
  //   isFetchingNextPage: isFetchingMoreEmployerTypes,
  // } = useGetEmployerTypes(employerTypesSearch);
  const {
    employmentTypes,
    isLoading: isEmploymentTypesLoading,
    error: employmentTypesError,
    hasNextPage: hasMoreEmploymentTypes,
    fetchNextPage: fetchMoreEmploymentTypes,
    isFetchingNextPage: isFetchingMoreEmploymentTypes,
  } = useGetEmploymentTypes(employmentTypesSearch);
  const {
    jobTitles,
    isLoading: isJobTitlesLoading,
    error: jobTitlesError,
    hasNextPage: hasMoreJobTitles,
    fetchNextPage: fetchMoreJobTitles,
    isFetchingNextPage: isFetchingMoreJobTitles,
  } = useGetJobTitles(jobTitlesSearch);

  // const {
  //   specialties,
  //   isLoading: isSpecialtiesLoading,
  //   error: specialtiesError,
  //   hasNextPage: hasMoreSpecialties,
  //   fetchNextPage: fetchMoreSpecialties,
  //   isFetchingNextPage: isFetchingMoreSpecialties,
  // } = useGetSpecialties(specialtySearch, selectedCategoryId ?? undefined);

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    hasNextPage: categoriesHasNextPage,
    fetchNextPage: fetchCategoriesNextPage,
    isFetchingNextPage: categoriesFetchingNextPage,
  } = useGetCategories(categorySearch);
  const {
    roleCategories,
    isLoading: roleCategoriesLoading,
    error: roleCategoriesError,
    hasNextPage: roleCategoriesHasNextPage,
    fetchNextPage: fetchRoleCategoriesNextPage,
    isFetchingNextPage: roleCategoriesFetchingNextPage,
  } = useGetRoleCategories(roleCategorySearch);
  const {
    seniorityLevels,
    isLoading: seniorityLevelsLoading,
    error: seniorityLevelsError,
    hasNextPage: seniorityLevelsHasNextPage,
    fetchNextPage: fetchSeniorityLevelsNextPage,
    isFetchingNextPage: seniorityLevelsFetchingNextPage,
  } = useGetSeniorityLevels(
    seniorityLevelsSearch,
    selectedRoleCategoryId ? [selectedRoleCategoryId] : [],
  );
  const {
    experiences,
    isLoading: isExperiencesLoading,
    error: experiencesError,
    hasNextPage: hasMoreExperiences,
    fetchNextPage: fetchMoreExperiences,
    isFetchingNextPage: isFetchingMoreExperiences,
  } = useGetExperiences(experienceSearch);
  const {
    mandatoryCertifications,
    isLoading: isMandatoryCertificationsLoading,
    error: mandatoryCertificationsError,
    hasNextPage: hasMoreMandatoryCertifications,
    fetchNextPage: fetchMoreMandatoryCertifications,
    isFetchingNextPage: isFetchingMoreMandatoryCertifications,
  } = useGetMandatoryCertifications(mandatoryCertificationsSearch);
  const {
    educationLevels,
    isLoading: isEducationLevelsLoading,
    error: educationLevelsError,
    hasNextPage: hasMoreEducationLevels,
    fetchNextPage: fetchMoreEducationLevels,
    isFetchingNextPage: isFetchingMoreEducationLevels,
  } = useGetEducationLevels(educationLevelsSearch);
  const {
    availabilities,
    isLoading: isAvailabilitiesLoading,
    error: availabilitiesError,
    hasNextPage: hasMoreAvailabilities,
    fetchNextPage: fetchMoreAvailabilities,
    isFetchingNextPage: isFetchingMoreAvailabilities,
  } = useGetAvailabilities(availabilitiesSearch);
  const {
    salaryTypes,
    isLoading: isSalaryTypesLoading,
    error: salaryTypesError,
    hasNextPage: hasMoreSalaryTypes,
    fetchNextPage: fetchMoreSalaryTypes,
    isFetchingNextPage: isFetchingMoreSalaryTypes,

  } = useGetSalaryTypes(salaryTypesSearch);
  const {
    currencies,
    isLoading: isCurrenciesLoading,
    error: currenciesError,
    hasNextPage: hasMoreCurrencies,
    fetchNextPage: fetchMoreCurrencies,
    isFetchingNextPage: isFetchingMoreCurrencies,

  } = useGetCurrencies(currenciesSearch);

  const addSalary = watch("addSalary");
  const selectedJobTitle = watch("title");
  const selectedCategoryValue = watch("category");
  const selectedExperienceValue = watch("yearsOfExperience");
  const selectedAvailabilityValue = watch("availability");
  const isOtherJobTitle = selectedJobTitle === OTHER_OPTION_VALUE;
  const isOtherCategory = selectedCategoryValue === OTHER_OPTION_VALUE;
  const isOtherExperience = selectedExperienceValue === OTHER_OPTION_VALUE;
  const isOtherAvailability = selectedAvailabilityValue === OTHER_OPTION_VALUE;
  const selectedMandatoryCertifications = watch("mandatoryCertifications");
  const normalizedMandatoryCertifications = useMemo(
    () => selectedMandatoryCertifications ?? [],
    [selectedMandatoryCertifications],
  );

  const existingEducationLevelOptions = useMemo(
    () =>
      (existingJob?.education_levels ?? []).map((item) => ({
        label: item.title ?? "",
        value: String(item.id),
      })),
    [existingJob],
  );

  const existingMandatoryCertificationOptions = useMemo(
    () =>
      (existingJob?.mandatory_certifications ?? [])
        .map((item) => {
          if (item.mandatory_certification_id != null) {
            return {
              label:
                item.title ?? item.mandatory_certification?.title ?? "",
              value: String(item.mandatory_certification_id),
            };
          }

          const title = item.title?.trim();
          if (title) {
            return {
              label: title,
              value: `${CUSTOM_CERTIFICATION_PREFIX}${title}`,
            };
          }

          return null;
        })
        .filter((item): item is Option => Boolean(item)),
    [existingJob],
  );

  const mandatoryCertificationOptions = useMemo(
    () => [
      ...toSelectOptions(mandatoryCertifications),
      ...normalizedMandatoryCertifications
        .filter((item) => item.startsWith(CUSTOM_CERTIFICATION_PREFIX))
        .map((item) => ({
          label: item.slice(CUSTOM_CERTIFICATION_PREFIX.length),
          value: item,
        })),
    ],
    [mandatoryCertifications, normalizedMandatoryCertifications],
  );

  const educationLevelsOptions = useMemo(
    () => toSelectOptions(educationLevels),
    [educationLevels],
  );

  const educationLevelLabelsMap = useMemo(() => {
    const map = new Map<string, string>();
    [...existingEducationLevelOptions, ...educationLevelsOptions].forEach(
      (option) => {
        map.set(option.value, option.label);
      },
    );
    return map;
  }, [existingEducationLevelOptions, educationLevelsOptions]);

  const mandatoryCertificationLabelsMap = useMemo(() => {
    const map = new Map<string, string>();
    [...existingMandatoryCertificationOptions, ...mandatoryCertificationOptions].forEach(
      (option) => {
        map.set(option.value, option.label);
      },
    );
    return map;
  }, [existingMandatoryCertificationOptions, mandatoryCertificationOptions]);

  function resolveLabelsFromMap(values: string[], map: Map<string, string>) {
    return values.map((value) => map.get(value) ?? value);
  }
  const jobTitleOptions = mergePersistedOption(
    [
      { label: t("companyPage.postJob.common.other"), value: OTHER_OPTION_VALUE },
      ...jobTitles.map((type) => ({
        label: type.title,
        value: String(type.id),
      })),
    ],
    persistedOptions?.title,
  );
  const categoryOptions = [
    { label: t("companyPage.postJob.common.other"), value: OTHER_OPTION_VALUE },
    ...toSelectOptions(categories),
  ];
  const experienceOptions = [
    { label: t("companyPage.postJob.common.other"), value: OTHER_OPTION_VALUE },
    ...toSelectOptions(experiences),
  ];
  const availabilityOptions = [
    { label: t("companyPage.postJob.common.other"), value: OTHER_OPTION_VALUE },
    ...toSelectOptions(availabilities),
  ];
  const countryOptions = mergePersistedOption(
    countries.map((country) => ({
      label: country.name,
      value: String(country.id),
    })),
    persistedOptions?.country,
  );
  const cityOptions = mergePersistedOption(
    cities.map((city) => ({
      label: city.name,
      value: String(city.id),
    })),
    persistedOptions?.city,
  );

  const addCustomMandatoryCertification = () => {
    const trimmedValue = newMandatoryCertification.trim();
    if (!trimmedValue) return;

    const nextValue = `${CUSTOM_CERTIFICATION_PREFIX}${trimmedValue}`;
    if (normalizedMandatoryCertifications.includes(nextValue)) {
      setNewMandatoryCertification("");
      return;
    }

    const nextSelectedMandatoryCertifications = [
      ...normalizedMandatoryCertifications,
      nextValue,
    ];
    setValue(
      "mandatoryCertifications",
      nextSelectedMandatoryCertifications,
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
    onPreviewLabelChange?.(
      "mandatoryCertifications",
      getOptionLabels(
        mandatoryCertificationOptions,
        nextSelectedMandatoryCertifications,
      ),
    );
    setNewMandatoryCertification("");
  };

  return (
    <div className="space-y-4">
      {/* ── Job Title + Professional License ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <div>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="title"
                label={t("companyPage.postJob.fields.jobTitle.label")}
                placeholder={t("companyPage.postJob.fields.jobTitle.placeholder")}
                withSearchInput
                className="whitespace-normal"
                error={
                  translateMessage(errors.title?.message) ??
                  (jobTitlesError instanceof Error
                    ? jobTitlesError.message
                    : undefined)
                }
                onChange={(value) => {
                  field.onChange(value);
                  onPreviewLabelChange?.("title", getOptionLabel(jobTitleOptions, value));
                  onPersistOption?.(
                    "title",
                    jobTitleOptions.find((option) => option.value === value),
                  );
                  if (value !== OTHER_OPTION_VALUE) {
                    setValue("otherJobTitle", "");
                  }
                }}
                options={jobTitleOptions}
                disabled={isJobTitlesLoading}
                onReachEnd={() => fetchMoreJobTitles()}
                hasNextPage={Boolean(hasMoreJobTitles)}
                isFetchingNextPage={isFetchingMoreJobTitles}
                onSearchChange={setJobTitlesSearch}
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
                label={t("companyPage.postJob.fields.professionalLicense.label")}
                placeholder={t("companyPage.postJob.fields.professionalLicense.placeholder")}
                error={
                  translateMessage(errors.license?.message)
                  // ?? (licensesError instanceof Error
                  //   ? licensesError.message
                  //   : undefined)
                }
                options={[
                  {
                    title: t("companyPage.postJob.fields.professionalLicense.options.withMedicalLicense"),
                    value: "with_medical_license"
                  },
                  {
                    title: t("companyPage.postJob.fields.professionalLicense.options.withoutMedicalLicense"),
                    value: "without_medical_license"
                  }
                ].map((item) => ({
                  label: item.title,
                  value: item.value,
                }))}
              // disabled={isLicensesLoading}
              // onReachEnd={() => fetchMoreLicenses()}
              // hasNextPage={Boolean(hasMoreLicenses)}
              // isFetchingNextPage={isFetchingMoreLicenses}
              />
            )}
          />
        </div>
      </div>
      <div>
        {isOtherJobTitle && (
          <InputField
            id="otherJobTitle"
            label={t("companyPage.postJob.fields.otherJobTitle.label")}
            placeholder={t("companyPage.postJob.fields.otherJobTitle.placeholder")}
            {...register("otherJobTitle", {
              onChange: (event) => {
                onPreviewLabelChange?.("title", event.target.value);
              },
            })}
            error={translateMessage(errors.otherJobTitle?.message)}
          />
        )}</div>
      {/* ── Salary Section ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-semibold">{t("companyPage.postJob.sections.salary.addSalaryQuestion")}</p>
          {/* Wire the Switch to addSalary boolean */}
          <Controller
            control={control}
            name="addSalary"
            render={({ field }) => (
              <Switch
                id="add-salary"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);

                  if (!checked) {
                    setValue(
                      "salary",
                      { min: undefined, max: undefined, type: "", currency: "" },
                      { shouldDirty: true, shouldTouch: true, shouldValidate: false },
                    );
                    clearErrors("salary");
                    return;
                  }

                  void trigger([
                    "salary.min",
                    "salary.max",
                    "salary.type",
                    "salary.currency",
                  ]);
                }}
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
                {t("companyPage.postJob.sections.salary.rangeLabel")}
              </label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <InputField
                    {...register("salary.min")}
                    id="salary-min"
                    type="number"
                    placeholder={t("companyPage.postJob.sections.salary.minPlaceholder")}
                    className="bg-white"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9]+$/.test(value)) {
                        e.target.value = value;
                      } else {
                        e.target.value = Math.floor(Number(value)).toString();
                      }
                    }}
                  />
                  <FieldError name="salary.min" />
                </div>
                <div className="flex-1">
                  <InputField
                    {...register("salary.max")}
                    id="salary-max"
                    type="number"
                    placeholder={t("companyPage.postJob.sections.salary.maxPlaceholder")}
                    className="bg-white"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9]+$/.test(value)) {
                        e.target.value = value;
                      } else {
                        e.target.value = Math.floor(Number(value)).toString();
                      }
                    }}
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
                    label={t("companyPage.postJob.fields.salaryType.label")}
                    className="bg-white"
                    placeholder={t("companyPage.postJob.fields.salaryType.placeholder")}
                    error={
                      translateMessage(errors.salary?.type?.message) ??
                      (salaryTypesError instanceof Error
                        ? salaryTypesError.message
                        : undefined)
                    }
                    options={toSelectOptions(salaryTypes)}
                    onChange={(value) => {
                      field.onChange(value);
                      onPreviewLabelChange?.(
                        "salaryType",
                        getOptionLabel(toSelectOptions(salaryTypes), value),
                      );
                    }}
                    disabled={isSalaryTypesLoading}
                    onReachEnd={() => fetchMoreSalaryTypes()}
                    hasNextPage={Boolean(hasMoreSalaryTypes)}
                    isFetchingNextPage={isFetchingMoreSalaryTypes}
                    onSearchChange={setSalaryTypesSearch}
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
                    label={t("companyPage.postJob.fields.currency.label")}
                    className="bg-white"
                    placeholder={t("companyPage.postJob.fields.currency.placeholder")}
                    withSearchInput
                    error={
                      translateMessage(errors.salary?.currency?.message) ??
                      (currenciesError instanceof Error
                        ? currenciesError.message
                        : undefined)
                    }
                    options={toSelectOptions(currencies)}
                    onChange={(value) => {
                      field.onChange(value);
                      const selectedCurrency = currencies.find(
                        (currency) => String(currency.id ?? "") === value,
                      );
                      onPreviewLabelChange?.(
                        "currency",
                        selectedCurrency?.code ?? selectedCurrency?.title ?? selectedCurrency?.name ?? value,
                      );
                    }}
                    disabled={isCurrenciesLoading}
                    onReachEnd={() => fetchMoreCurrencies()}
                    hasNextPage={Boolean(hasMoreCurrencies)}
                    isFetchingNextPage={isFetchingMoreCurrencies}
                    onSearchChange={setCurrenciesSearch}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Category + Specialty ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="category"
                label={t("companyPage.postJob.fields.jobCategory.label")}
                error={
                  translateMessage(errors.category?.message) ??
                  (categoriesError instanceof Error
                    ? categoriesError.message
                    : undefined)
                }
                options={categoryOptions}
                onChange={(value) => {
                  field.onChange(value);
                  onPreviewLabelChange?.("category", getOptionLabel(categoryOptions, value));
                  if (value !== OTHER_OPTION_VALUE) {
                    setValue("otherCategoryTitle", "");
                  }
                  // onPreviewLabelChange?.("specialty", "");
                  // setValue("specialty", "");
                }}
                disabled={categoriesLoading}
                onReachEnd={() => fetchCategoriesNextPage()}
                hasNextPage={Boolean(categoriesHasNextPage)}
                isFetchingNextPage={categoriesFetchingNextPage}
                onSearchChange={setCategorySearch}
              />
            )}
          />
        </div>
        {/* <div>
          <Controller
            control={control}
            name="specialty"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="specialty"
                label="Specialty"
                error={
                  errors.specialty?.message ??
                  (specialtiesError instanceof Error
                    ? specialtiesError.message
                    : undefined)
                }
                options={toSelectOptions(specialties)}
                onChange={(value) => {
                  field.onChange(value);
                  onPreviewLabelChange?.(
                    "specialty",
                    getOptionLabel(toSelectOptions(specialties), value),
                  );
                }}
                disabled={isSpecialtiesLoading || !selectedCategoryId}
                onReachEnd={() => fetchMoreSpecialties()}
                hasNextPage={Boolean(hasMoreSpecialties)}
                isFetchingNextPage={isFetchingMoreSpecialties}
                onSearchChange={setSpecialtySearch}
              />
            )}
          />
        </div> */}

        <InputField
          id="specialty"
          label={t("companyPage.postJob.fields.specialty.label")}
          type={"text"}
          placeholder={t("companyPage.postJob.fields.specialty.placeholder")}
          // className="bg-white"
          {...register("specialty", {
            onChange: (event) => {
              onPreviewLabelChange?.("specialty", event.target.value);
            },
          })}
          error={translateMessage(errors.specialty?.message?.toString())}
        />
      </div>
      {isOtherCategory && (
        <InputField
          id="otherCategoryTitle"
          label={t("companyPage.postJob.fields.otherCategory.label")}
          placeholder={t("companyPage.postJob.fields.otherCategory.placeholder")}
          {...register("otherCategoryTitle", {
            onChange: (event) => {
              onPreviewLabelChange?.("category", event.target.value);
            },
          })}
          error={translateMessage(errors.otherCategoryTitle?.message)}
        />
      )}

      {/* ── Employment Type Section ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">
          {t("companyPage.postJob.sections.employment.title")}
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
                  label={t("companyPage.postJob.fields.employmentType.label")}
                  className="bg-white"
                  placeholder={t("companyPage.postJob.fields.employmentType.placeholder")}
                  error={
                    translateMessage(errors.employmentType?.message) ??
                    (employmentTypesError instanceof Error
                      ? employmentTypesError.message
                      : undefined)
                  }
                  options={toSelectOptions(employmentTypes)}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "employmentType",
                      getOptionLabel(toSelectOptions(employmentTypes), value),
                    );
                  }}
                  disabled={isEmploymentTypesLoading}
                  onReachEnd={() => fetchMoreEmploymentTypes()}
                  hasNextPage={Boolean(hasMoreEmploymentTypes)}
                  isFetchingNextPage={isFetchingMoreEmploymentTypes}
                  onSearchChange={setEmploymentTypesSearch}
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
                  label={t("companyPage.postJob.fields.roleCategory.label")}
                  className="bg-white"
                  placeholder={t("companyPage.postJob.fields.roleCategory.placeholder")}
                  error={
                    translateMessage(errors.roleCategory?.message) ??
                    (roleCategoriesError instanceof Error
                      ? roleCategoriesError.message
                      : undefined)
                  }
                  options={toSelectOptions(roleCategories)}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "roleCategory",
                      getOptionLabel(toSelectOptions(roleCategories), value),
                    );
                    onPreviewLabelChange?.("seniorityLevel", "");
                    setValue("seniorityLevel", "");
                  }}
                  disabled={roleCategoriesLoading}
                  onReachEnd={() => fetchRoleCategoriesNextPage()}
                  hasNextPage={Boolean(roleCategoriesHasNextPage)}
                  isFetchingNextPage={roleCategoriesFetchingNextPage}
                  onSearchChange={setRoleCategorySearch}
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
                  label={t("companyPage.postJob.fields.seniorityLevel.label")}
                  placeholder={t("common.select")}
                  className="bg-white"
                  error={
                    translateMessage(errors.seniorityLevel?.message) ??
                    (seniorityLevelsError instanceof Error
                      ? seniorityLevelsError.message
                      : undefined)
                  }
                  options={toSelectOptions(seniorityLevels)}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "seniorityLevel",
                      getOptionLabel(toSelectOptions(seniorityLevels), value),
                    );
                  }}
                  disabled={seniorityLevelsLoading || !selectedRoleCategoryId}
                  onReachEnd={() => fetchSeniorityLevelsNextPage()}
                  hasNextPage={Boolean(seniorityLevelsHasNextPage)}
                  isFetchingNextPage={seniorityLevelsFetchingNextPage}
                  onSearchChange={setSeniorityLevelsSearch}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Job Location ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">{t("companyPage.postJob.sections.location.title")}</h6>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="country"
                  label={t("companyPage.postJob.fields.country.label")}
                  className="bg-white"
                  placeholder={t("companyPage.postJob.fields.country.placeholder")}
                  withSearchInput
                  error={
                    translateMessage(errors.country?.message) ??
                    (countriesError instanceof Error
                      ? countriesError.message
                      : undefined)
                  }
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "country",
                      getOptionLabel(countryOptions, value),
                    );
                    onPersistOption?.(
                      "country",
                      countryOptions.find((option) => option.value === value),
                    );
                    onPreviewLabelChange?.("city", "");
                    onPersistOption?.("city", undefined);
                    setValue("city", "");
                  }}
                  options={countryOptions}
                  disabled={isCountriesLoading}
                  onReachEnd={() => fetchMoreCountries()}
                  hasNextPage={Boolean(hasMoreCountries)}
                  isFetchingNextPage={isFetchingMoreCountries}
                  onSearchChange={setCountrySearch}
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
                  label={t("companyPage.postJob.fields.city.label")}
                  className="bg-white"
                  placeholder={t("companyPage.postJob.fields.city.placeholder")}
                  withSearchInput
                  error={
                    translateMessage(errors.city?.message) ??
                    (citiesError instanceof Error ? citiesError.message : undefined)
                  }
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.("city", getOptionLabel(cityOptions, value));
                    onPersistOption?.(
                      "city",
                      cityOptions.find((option) => option.value === value),
                    );
                  }}
                  options={cityOptions}
                  disabled={citiesLoading || !selectedCountryId}
                  onReachEnd={() => citiesFetchNextPage()}
                  hasNextPage={Boolean(citiesHasNextPage)}
                  isFetchingNextPage={citiesIsFetchingNextPage}
                  onSearchChange={setCitySearch}
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
              label={t("companyPage.postJob.fields.yearsOfExperience.label")}
              placeholder={t("common.select")}
              error={
                translateMessage(errors.yearsOfExperience?.message) ??
                (experiencesError instanceof Error
                  ? experiencesError.message
                  : undefined)
              }
              options={experienceOptions}
              onChange={(value) => {
                field.onChange(value);
                onPreviewLabelChange?.(
                  "yearsOfExperience",
                  getOptionLabel(experienceOptions, value),
                );
                if (value !== OTHER_OPTION_VALUE) {
                  setValue("otherExperienceTitle", "");
                }
              }}
              disabled={isExperiencesLoading}
              onReachEnd={() => fetchMoreExperiences()}
              hasNextPage={Boolean(hasMoreExperiences)}
              isFetchingNextPage={isFetchingMoreExperiences}
              onSearchChange={setExperienceSearch}
            />
          )}
        />
      </div>
      {isOtherExperience && (
        <InputField
          id="otherExperienceTitle"
          label={t("companyPage.postJob.fields.otherYearsOfExperience.label")}
          placeholder={t("companyPage.postJob.fields.otherYearsOfExperience.placeholder")}
          {...register("otherExperienceTitle", {
            onChange: (event) => {
              onPreviewLabelChange?.("yearsOfExperience", event.target.value);
            },
          })}
          error={translateMessage(errors.otherExperienceTitle?.message)}
        />
      )}

      {/* ── Education & Certifications ── */}
      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">
          {t("companyPage.postJob.sections.education.title")}
        </h6>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => (
                <MultiSelectInputField
                  {...field}
                  id="education-level"
                  label={t("companyPage.postJob.fields.educationLevel.label")}
                  placeholder={t("common.select")}
                  className="bg-white whitespace-normal"
                  error={
                    translateMessage(errors.educationLevel?.message) ??
                    (educationLevelsError instanceof Error
                      ? educationLevelsError.message
                      : undefined)
                  }
                  options={educationLevelsOptions}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "educationLevel",
                      resolveLabelsFromMap(value, educationLevelLabelsMap),
                    );
                  }}
                  disabled={isEducationLevelsLoading}
                  preloadOptions={existingEducationLevelOptions}
                  onReachEnd={() => fetchMoreEducationLevels()}
                  hasNextPage={Boolean(hasMoreEducationLevels)}
                  isFetchingNextPage={isFetchingMoreEducationLevels}
                  withSearchInput
                  onSearchChange={setEducationLevelsSearch}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name="mandatoryCertifications"
              render={({ field }) => (
                <div className="space-y-3">
                  <MultiSelectInputField
                    {...field}
                    id="mandatory-certifications"
                    label={t("companyPage.postJob.fields.mandatoryCertifications.label")}
                    placeholder={t("common.select")}
                    className="bg-white whitespace-normal"
                    error={
                      translateMessage(errors.mandatoryCertifications?.message) ??
                      (mandatoryCertificationsError instanceof Error
                        ? mandatoryCertificationsError.message
                        : undefined)
                    }
                    options={mandatoryCertificationOptions}
                    onChange={(value) => {
                      field.onChange(value);
                      onPreviewLabelChange?.(
                        "mandatoryCertifications",
                        resolveLabelsFromMap(value, mandatoryCertificationLabelsMap),
                      );
                    }}
                    disabled={isMandatoryCertificationsLoading}
                    preloadOptions={existingMandatoryCertificationOptions}
                    onReachEnd={() => fetchMoreMandatoryCertifications()}
                    hasNextPage={Boolean(hasMoreMandatoryCertifications)}
                    isFetchingNextPage={isFetchingMoreMandatoryCertifications}
                    withSearchInput
                    onSearchChange={setMandatoryCertificationsSearch}
                  />

                  <div className="flex items-end gap-3">
                    <InputField
                      id="new-mandatory-certification"
                      label={t("companyPage.postJob.fields.addNewCertification.label")}
                      placeholder={t("companyPage.postJob.fields.addNewCertification.placeholder")}
                      value={newMandatoryCertification}
                      onChange={(event) =>
                        setNewMandatoryCertification(event.currentTarget.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addCustomMandatoryCertification();
                        }
                      }}
                      className="bg-white max-sm:placeholder:text-[11px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="pill"
                      hoverStyle="slidePrimary"
                      className="mb-0.5 shrink-0"
                      onClick={addCustomMandatoryCertification}
                    >
                      {t("companyPage.postJob.actions.addNew")}
                    </Button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-[12px] p-3">
        <h6 className="text-gray-45 mb-5 font-semibold">{t("companyPage.postJob.sections.availability.title")}</h6>{" "}
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="space-y-2">
            <Controller
              control={control}
              name="availability"
              render={({ field }) => (
                <SelectInputField
                  {...field}
                  id="availability"
                  label={t("companyPage.postJob.fields.availability.label")}
                  className="bg-white"
                  placeholder={t("common.select")}
                  error={
                    translateMessage(errors.availability?.message) ??
                    (availabilitiesError instanceof Error
                      ? availabilitiesError.message
                      : undefined)
                  }
                  options={availabilityOptions}
                  onChange={(value) => {
                    field.onChange(value);
                    onPreviewLabelChange?.(
                      "availability",
                      getOptionLabel(availabilityOptions, value),
                    );
                    if (value !== OTHER_OPTION_VALUE) {
                      setValue("otherAvailabilityTitle", "");
                    }
                  }}
                  disabled={isAvailabilitiesLoading}
                  onReachEnd={() => fetchMoreAvailabilities()}
                  hasNextPage={Boolean(hasMoreAvailabilities)}
                  isFetchingNextPage={isFetchingMoreAvailabilities}
                  onSearchChange={setAvailabilitiesSearch}
                />
              )}
            />
            {isOtherAvailability && (
              <InputField
                id="otherAvailabilityTitle"
                label={t("companyPage.postJob.fields.otherAvailability.label")}
                placeholder={t("companyPage.postJob.fields.otherAvailability.placeholder")}
                {...register("otherAvailabilityTitle", {
                  onChange: (event) => {
                    onPreviewLabelChange?.("availability", event.target.value);
                  },
                })}
                error={translateMessage(errors.otherAvailabilityTitle?.message)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobPostStepOne({
  isLoading = false,
  persistedOptions,
  onPersistOption,
  onPreviewLabelChange,
  existingJob,
}: {
  isLoading?: boolean;
  persistedOptions?: PersistedOptions;
  onPersistOption?: (key: keyof PersistedOptions, option?: Option) => void;
  onPreviewLabelChange?: (key: PreviewLabelKey, value: string | string[]) => void;
  existingJob?: JobDetails | null;
}) {
  if (isLoading) {
    return <JobPostStepOneSkeleton />;
  }

  return (
    <JobPostStepOneContent
      persistedOptions={persistedOptions}
      onPersistOption={onPersistOption}
      onPreviewLabelChange={onPreviewLabelChange}
      existingJob={existingJob}
    />
  );
}
