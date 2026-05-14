"use client";

import { InputField } from "@/shared/components/InputField";
import { Option, SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import useGetCountries from "@/shared/hooks/useGetCountries";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export type CandidatesFilterValues = {
  search: string;
  country: string;
  medicalLicense: string;
  recent: string;
};

type CandidatesFilterProps = {
  values: CandidatesFilterValues;
  countryOptions: Option[];
  onSearchChange: (search: string) => void;
  onFilterChange: (nextValues: CandidatesFilterValues) => void;
  onSubmit: (nextValues: CandidatesFilterValues) => void;
  isSubmitting?: boolean;
};

export default function CandidatesFilter({
  values,
  countryOptions,
  onSearchChange,
  onFilterChange,
  onSubmit,
  isSubmitting = false,
}: CandidatesFilterProps) {
  const t = useTranslations();
  const [countrySearch, setCountrySearch] = useState("");
  const {
    countries,
    isLoading: countriesLoading,
    hasNextPage: countriesHasNextPage,
    fetchNextPage: fetchCountriesNextPage,
    isFetchingNextPage: countriesFetchingNextPage,
  } = useGetCountries(countrySearch);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  const recentOptions: Option[] = [{ label: t("companyPage.candidates.filters.recent-applied"), value: "1" }];
  const medicalLicenseOptions: Option[] = [
    { label: t("companyPage.candidates.filters.with-medical-license"), value: "1" },
    { label: t("companyPage.candidates.filters.without-medical-license"), value: "0" },
  ];

  return (
    <section className="mt-13 flex w-full flex-col gap-3 lg:flex-row lg:items-center">
      <form
        className="bg-border flex w-full items-center gap-2 rounded-full p-2 lg:w-auto lg:flex-1"
        onSubmit={handleSearchSubmit}
      >
        <InputField
          className="grow bg-white"
          containerStyles="w-full"
          id="search"
          placeholder={t("companyPage.candidates.filters.search-placeholder")}
          value={values.search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <Button variant="default" size="pill" className="shrink-0" disabled={isSubmitting}>
          {t("common.search")}
        </Button>
      </form>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-1">
        <SelectInputField
          id="recent"
          options={recentOptions}
          placeholder={t("companyPage.candidates.filters.recent-placeholder")}
          value={values.recent}
          onChange={(recent) => onFilterChange({ ...values, recent })}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="location"
          options={countryOptions}
          placeholder={t("common.country")}
          value={values.country}
          onChange={(country) => onFilterChange({ ...values, country })}
          disabled={countriesLoading}
          withSearchInput
          searchPlaceholder={t("companyPage.candidates.filters.search-countries")}
          onSearchChange={setCountrySearch}
          onReachEnd={() => void fetchCountriesNextPage()}
          hasNextPage={countriesHasNextPage}
          isFetchingNextPage={countriesFetchingNextPage}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="license"
          options={medicalLicenseOptions}
          placeholder={t("companyPage.candidates.filters.medical-license-placeholder")}
          value={values.medicalLicense}
          onChange={(medicalLicense) => onFilterChange({ ...values, medicalLicense })}
          className="bg-white"
          containerStyles="w-full"
        />
      </div>
    </section>
  );
}
