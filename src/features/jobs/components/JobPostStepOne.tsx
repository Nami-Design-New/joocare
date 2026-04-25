"use client";

import { InputField } from "@/shared/components/InputField";
import { MultiSelectInputField } from "@/shared/components/MultiSelectInputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";
import { JobFormData } from "../validation/job-post-schema";

// import hooks for fetching select options
import useGetAvailabilities from "@/shared/hooks/useGetAvailabilities";
import useGetCategories from "@/shared/hooks/useGetCategories";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetCurrencies from "@/shared/hooks/useGetCurrencies";
import useGetEducationLevels from "@/shared/hooks/useGetEducationLevels";
import useGetEmployerTypes from "@/shared/hooks/useGetEmployerTypes";
import useGetExperiences from "@/shared/hooks/useGetExperiences";
import useGetMandatoryCertifications from "@/shared/hooks/useGetMandatoryCertifications";
import useGetOrganizationSizes from "@/shared/hooks/useGetOrganizationSizes";
import useGetRoleCategories from "@/shared/hooks/useGetRoleCategories";
import useGetSalaryTypes from "@/shared/hooks/useGetSalaryTypes";
import useGetSeniorityLevels from "@/shared/hooks/useGetSeniorityLevels";
import useGetSpecialties from "@/shared/hooks/useGetSpecialties";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { JobPostStepOneSkeleton } from "./JobPostStepOneSkeleton";
import useGetJobTitles from "@/shared/hooks/useGetJobTitles";
import useGetEmploymentTypes from "@/shared/hooks/useGetEmploymentTypes";
import type { Option } from "@/shared/components/SelectInputField";

const CUSTOM_CERTIFICATION_PREFIX = "__custom__:";

type LookupOptionItem = {
  id?: number | string;
  title?: string;
  name?: string;
};

type PersistedOptions = Partial<Record<"title" | "country" | "city", Option>>;

function mergePersistedOption(options: Option[], persisted?: Option) {
  if (!persisted) return options;
  if (options.some((option) => option.value === persisted.value)) {
    return options;
  }

  return [persisted, ...options];
}

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



function JobPostStepOneContent({
  persistedOptions,
  onPersistOption,
}: {
  persistedOptions?: PersistedOptions;
  onPersistOption?: (key: keyof PersistedOptions, option?: Option) => void;
}) {
  // hooks land and token
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken as string

  // search states
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [organizationSizesSearch, setOrganizationSizesSearch] = useState("");
  const [employerTypesSearch, setEmployerTypesSearch] = useState("");
  const [employmentTypesSearch, setEmploymentTypesSearch] = useState("");
  const [jobTitlesSearch, setJobTitlesSearch] = useState("");
  const [licensesSearch, setLicensesSearch] = useState("");
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
  const selectedCategory = watch("category");
  const selectedRoleCategory = watch("roleCategory");
  const selectedCountryId = selectedCountry ? Number(selectedCountry) : null;
  const selectedCategoryId = selectedCategory ? Number(selectedCategory) : null;
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

  const {
    specialties,
    isLoading: isSpecialtiesLoading,
    error: specialtiesError,
    hasNextPage: hasMoreSpecialties,
    fetchNextPage: fetchMoreSpecialties,
    isFetchingNextPage: isFetchingMoreSpecialties,
  } = useGetSpecialties(specialtySearch, selectedCategoryId ?? undefined);

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
    selectedRoleCategoryId ?? undefined,
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
  const isOtherJobTitle = selectedJobTitle === "__other__";
  const selectedMandatoryCertifications = watch("mandatoryCertifications") ?? [];

  const toSelectOptions = (items: LookupOptionItem[]) =>
    items.map((item) => ({
      label: item.title ?? item.name ?? "",
      value: String(item.id ?? ""),
    }));

  const mandatoryCertificationOptions = [
    ...toSelectOptions(mandatoryCertifications),
    ...selectedMandatoryCertifications
      .filter((item) => item.startsWith(CUSTOM_CERTIFICATION_PREFIX))
      .map((item) => ({
        label: item.slice(CUSTOM_CERTIFICATION_PREFIX.length),
        value: item,
      })),
  ];
  const jobTitleOptions = mergePersistedOption(
    [
      ...jobTitles.map((type) => ({
        label: type.title,
        value: String(type.id),
      })),
      { label: "Other", value: "__other__" },
    ],
    persistedOptions?.title,
  );
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
    if (selectedMandatoryCertifications.includes(nextValue)) {
      setNewMandatoryCertification("");
      return;
    }

    setValue(
      "mandatoryCertifications",
      [...selectedMandatoryCertifications, nextValue],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
    setNewMandatoryCertification("");
  };

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
                withSearchInput
                error={
                  errors.title?.message ??
                  (jobTitlesError instanceof Error
                    ? jobTitlesError.message
                    : undefined)
                }
                onChange={(value) => {
                  field.onChange(value);
                  onPersistOption?.(
                    "title",
                    jobTitleOptions.find((option) => option.value === value),
                  );
                  if (value !== "__other__") {
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
                label="Professional License"
                placeholder="ex: DHA License"
                error={
                  errors.license?.message
                  // ?? (licensesError instanceof Error
                  //   ? licensesError.message
                  //   : undefined)
                }
                options={[
                  {
                    title: "with medical license",
                    value: "with_medical_license"
                  },
                  {
                    title: "without medical license",
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
                onSearchChange={setLicensesSearch}
              />
            )}
          />
        </div>
      </div>
      <div>
        {isOtherJobTitle && (
          <InputField
            id="otherJobTitle"
            label="Other job title"
            placeholder="Enter job title"
            {...register("otherJobTitle")}
            error={errors.otherJobTitle?.message}
          />
        )}</div>
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
                Salary Range
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
                    error={
                      errors.salary?.type?.message ??
                      (salaryTypesError instanceof Error
                        ? salaryTypesError.message
                        : undefined)
                    }
                    options={toSelectOptions(salaryTypes)}
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
                    label="Currency"
                    className="bg-white"
                    placeholder="Choose"
                    withSearchInput
                    error={
                      errors.salary?.currency?.message ??
                      (currenciesError instanceof Error
                        ? currenciesError.message
                        : undefined)
                    }
                    options={toSelectOptions(currencies)}
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectInputField
                {...field}
                id="category"
                label="Job Category"
                error={
                  errors.category?.message ??
                  (categoriesError instanceof Error
                    ? categoriesError.message
                    : undefined)
                }
                options={toSelectOptions(categories)}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("specialty", "");
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
        <div>
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
                disabled={isSpecialtiesLoading || !selectedCategoryId}
                onReachEnd={() => fetchMoreSpecialties()}
                hasNextPage={Boolean(hasMoreSpecialties)}
                isFetchingNextPage={isFetchingMoreSpecialties}
                onSearchChange={setSpecialtySearch}
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
                  error={
                    errors.employmentType?.message ??
                    (employmentTypesError instanceof Error
                      ? employmentTypesError.message
                      : undefined)
                  }
                  options={toSelectOptions(employmentTypes)}
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
                  label="Role Category"
                  className="bg-white"
                  placeholder="ex: Clinical"
                  error={
                    errors.roleCategory?.message ??
                    (roleCategoriesError instanceof Error
                      ? roleCategoriesError.message
                      : undefined)
                  }
                options={toSelectOptions(roleCategories)}
                onChange={(value) => {
                  field.onChange(value);
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
                  label="Seniority Level"
                  placeholder="select"
                  className="bg-white"
                  error={
                    errors.seniorityLevel?.message ??
                    (seniorityLevelsError instanceof Error
                      ? seniorityLevelsError.message
                      : undefined)
                  }
                  options={toSelectOptions(seniorityLevels)}
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
                  withSearchInput
                  error={
                    errors.country?.message ??
                    (countriesError instanceof Error
                      ? countriesError.message
                      : undefined)
                  }
                  onChange={(value) => {
                    field.onChange(value);
                    onPersistOption?.(
                      "country",
                      countryOptions.find((option) => option.value === value),
                    );
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
                  label="City"
                  className="bg-white"
                  placeholder="ex: Dubai"
                  withSearchInput
                  error={
                    errors.city?.message ??
                    (citiesError instanceof Error ? citiesError.message : undefined)
                  }
                  onChange={(value) => {
                    field.onChange(value);
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
              label="Years of Experience"
              placeholder="select"
              error={
                errors.yearsOfExperience?.message ??
                (experiencesError instanceof Error
                  ? experiencesError.message
                  : undefined)
              }
              options={toSelectOptions(experiences)}
              disabled={isExperiencesLoading}
              onReachEnd={() => fetchMoreExperiences()}
              hasNextPage={Boolean(hasMoreExperiences)}
              isFetchingNextPage={isFetchingMoreExperiences}
              onSearchChange={setExperienceSearch}
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
              render={({ field }) => (
                <MultiSelectInputField
                  {...field}
                  id="education-level"
                  label="Education Level"
                  placeholder="select"
                  className="bg-white"
                  error={
                    errors.educationLevel?.message ??
                    (educationLevelsError instanceof Error
                      ? educationLevelsError.message
                      : undefined)
                  }
                  options={toSelectOptions(educationLevels)}
                  disabled={isEducationLevelsLoading}
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
                    label="Mandatory Certifications"
                    placeholder="select"
                    className="bg-white"
                    error={
                      errors.mandatoryCertifications?.message ??
                      (mandatoryCertificationsError instanceof Error
                        ? mandatoryCertificationsError.message
                        : undefined)
                    }
                    options={mandatoryCertificationOptions}
                    disabled={isMandatoryCertificationsLoading}
                    onReachEnd={() => fetchMoreMandatoryCertifications()}
                    hasNextPage={Boolean(hasMoreMandatoryCertifications)}
                    isFetchingNextPage={isFetchingMoreMandatoryCertifications}
                    withSearchInput
                    onSearchChange={setMandatoryCertificationsSearch}
                  />

                  <div className="flex items-end gap-3">
                    <InputField
                      id="new-mandatory-certification"
                      label="Add new certification"
                      placeholder="Type a certification title"
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
                      className="bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="pill"
                      hoverStyle="slidePrimary"
                      className="mb-0.5 shrink-0"
                      onClick={addCustomMandatoryCertification}
                    >
                      Add new
                    </Button>
                  </div>
                </div>
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
                  error={
                    errors.availability?.message ??
                    (availabilitiesError instanceof Error
                      ? availabilitiesError.message
                      : undefined)
                  }
                  options={toSelectOptions(availabilities)}
                  disabled={isAvailabilitiesLoading}
                  onReachEnd={() => fetchMoreAvailabilities()}
                  hasNextPage={Boolean(hasMoreAvailabilities)}
                  isFetchingNextPage={isFetchingMoreAvailabilities}
                  onSearchChange={setAvailabilitiesSearch}
                />
              )}
            />
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
}: {
  isLoading?: boolean;
  persistedOptions?: PersistedOptions;
  onPersistOption?: (key: keyof PersistedOptions, option?: Option) => void;
}) {
  if (isLoading) {
    return <JobPostStepOneSkeleton />;
  }

  return (
    <JobPostStepOneContent
      persistedOptions={persistedOptions}
      onPersistOption={onPersistOption}
    />
  );
}
