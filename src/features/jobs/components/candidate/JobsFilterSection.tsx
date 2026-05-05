"use client";

import { PopularSearchesItem } from "@/features/home/components/PopularSearches";
import PopularSearchesInteractive from "@/features/home/components/PopularSearchesInteractive";
import { InputField } from "@/shared/components/InputField";
import { Option, SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import useGetCountries from "@/shared/hooks/useGetCountries";
import { useMemo, useState } from "react";

type JobsFilterSectionProps = {
  locale: string;
  actionPath: string;
  heading: string;
  description: string;
  search: string;
  country: string;
  countries: Option[];
  popularSearches: PopularSearchesItem[];
  popularSearchesCurrentPage?: number;
  popularSearchesLastPage?: number;
  hiddenInputs: Array<{ name: string; value: string }>;
};

export default function JobsFilterSection({
  actionPath,
  search,
  country,
  countries,
  popularSearches,
  popularSearchesCurrentPage = 1,
  popularSearchesLastPage = 1,
  hiddenInputs,
}: JobsFilterSectionProps) {
  const [location, setLocation] = useState<string>(country);
  const [countrySearch, setCountrySearch] = useState("");
  const {
    countries: apiCountries,
    isLoading: countriesLoading,
    hasNextPage: countriesHasNextPage,
    fetchNextPage: fetchCountriesNextPage,
    isFetchingNextPage: countriesFetchingNextPage,
  } = useGetCountries(countrySearch);


  return (
    <section className="layout-shell">
      <section className="layout-content mt-4 lg:-mt-24">
        <section className="rounded-2xl bg-white p-4">
          {/* <div className="mx-auto mb-6 max-w-5xl text-center">
            <h1 className="text-secondary text-3xl font-semibold lg:text-4xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-6 lg:text-base">
              {description}
            </p>
          </div> */}

          <form
            action={actionPath}
            method="get"
            className="bg-border mx-auto mb-4 flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 rounded-lg p-2 md:flex-nowrap md:rounded-full"
          >
            {hiddenInputs.map((input) => (
              <input key={`${input.name}-${input.value}`} type="hidden" name={input.name} value={input.value} />
            ))}

            <InputField
              name="search"
              defaultValue={search}
              className="grow bg-white"
              containerStyles="w-auto grow"
              id="search"
              placeholder="Job title or keyword"
            />

            <input type="hidden" name="country" value={location} />
            <SelectInputField
              withSearchInput
              id="location"
              options={apiCountries.map((apiCountry: { id: number; name: string }) => ({
                label: apiCountry.name,
                value: String(apiCountry.id),
              }))}
              placeholder="By country"
              value={location}
              onChange={setLocation}
              disabled={countriesLoading}
              searchPlaceholder="Search countries..."
              onSearchChange={setCountrySearch}
              onReachEnd={() => void fetchCountriesNextPage()}
              hasNextPage={countriesHasNextPage}
              isFetchingNextPage={countriesFetchingNextPage}
              className="bg-white"
              containerStyles="w-auto grow"
            />

            <Button type="submit" variant="default" size="pill" className="shrink-0">
              Search
            </Button>
          </form>
          <PopularSearchesInteractive
            items={popularSearches}
            variant="jobs"
            maxVisible={5}
            currentPage={popularSearchesCurrentPage}
            lastPage={popularSearchesLastPage}
          />
        </section>
      </section>
    </section>
  );
}
