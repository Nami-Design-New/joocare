"use client";

import { InputField } from "@/shared/components/InputField";
import { Option, SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { FormEvent } from "react";

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

const recentOptions: Option[] = [{ label: "Recent applied", value: "1" }];

const medicalLicenseOptions: Option[] = [
  { label: "With medical license", value: "1" },
  { label: "Without medical license", value: "0" },
];

export default function CandidatesFilter({
  values,
  countryOptions,
  onSearchChange,
  onFilterChange,
  onSubmit,
  isSubmitting = false,
}: CandidatesFilterProps) {
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

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
          placeholder="search name...."
          value={values.search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <Button variant="default" size="pill" className="shrink-0" disabled={isSubmitting}>
          Search
        </Button>
      </form>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-1">
        <SelectInputField
          id="recent"
          options={recentOptions}
          placeholder="recent applied"
          value={values.recent}
          onChange={(recent) => onFilterChange({ ...values, recent })}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="location"
          options={countryOptions}
          placeholder="Country"
          value={values.country}
          onChange={(country) => onFilterChange({ ...values, country })}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="license"
          options={medicalLicenseOptions}
          placeholder="Medical License"
          value={values.medicalLicense}
          onChange={(medicalLicense) => onFilterChange({ ...values, medicalLicense })}
          className="bg-white"
          containerStyles="w-full"
        />
      </div>
    </section>
  );
}
