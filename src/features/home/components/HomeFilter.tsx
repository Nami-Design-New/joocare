"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import useGetCategories from "@/shared/hooks/useGetCategories";
import useGetCountries from "@/shared/hooks/useGetCountries";
import useGetDomains from "@/shared/hooks/useGetDomains";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

type LocalizedValue = {
  ar?: string | null;
  en?: string | null;
};

function resolveLocalizedLabel(
  value: LocalizedValue | string | null | undefined,
  locale: string,
) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return locale === "ar" ? value.ar ?? value.en ?? "" : value.en ?? value.ar ?? "";
}

export default function HomeFilter() {
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [domainId, setDomainId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const {
    countries,
    isLoading: countriesLoading,
    hasNextPage: countriesHasNextPage,
    fetchNextPage: fetchCountriesNextPage,
    isFetchingNextPage: countriesFetchingNextPage,
  } = useGetCountries(countrySearch);
  const {
    domains,
    isLoading: domainsLoading,
    hasNextPage: domainsHasNextPage,
    fetchNextPage: fetchDomainsNextPage,
    isFetchingNextPage: domainsFetchingNextPage,
  } = useGetDomains(domainSearch);
  const {
    categories,
    isLoading: categoriesLoading,
    hasNextPage: categoriesHasNextPage,
    fetchNextPage: fetchCategoriesNextPage,
    isFetchingNextPage: categoriesFetchingNextPage,
  } = useGetCategories(categorySearch);

  const optionsToSelectInput = (
    items: Array<Record<string, unknown>>,
    labelKey: "name" | "title",
  ) =>
    items.map((item) => ({
      label: resolveLocalizedLabel(item[labelKey] as LocalizedValue | string, locale),
      value: String(item.id ?? ""),
    })).filter((item) => item.label);

  const countryOptions = optionsToSelectInput(countries as Array<Record<string, unknown>>, "name");
  const domainOptions = optionsToSelectInput(domains as Array<Record<string, unknown>>, "title");
  const categoryOptions = optionsToSelectInput(
    categories as Array<Record<string, unknown>>,
    "title",
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (domainId) {
      params.set("domain", domainId);
    }

    if (countryId) {
      params.set("country", countryId);
    }

    if (categoryId) {
      params.set("categories", categoryId);
    }

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      className="bg-border flex w-full flex-wrap items-center justify-center gap-2 rounded-lg p-2 md:flex-nowrap md:rounded-full"
      onSubmit={handleSubmit}
    >
      <InputField
        className="grow bg-white"
        containerStyles="w-auto grow"
        id="search"
        placeholder="Job title or keyword"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <SelectInputField
        id="location"
        options={countryOptions}
        placeholder="By Country"
        value={countryId}
        onChange={setCountryId}
        className="bg-white"
        containerStyles="w-auto grow"
        disabled={countriesLoading}
        withSearchInput
        searchPlaceholder="Search countries..."
        onSearchChange={setCountrySearch}
        onReachEnd={() => void fetchCountriesNextPage()}
        hasNextPage={countriesHasNextPage}
        isFetchingNextPage={countriesFetchingNextPage}
      />

      <SelectInputField
        id="domain"
        options={domainOptions}
        placeholder="By Domain"
        value={domainId}
        onChange={setDomainId}
        className="bg-white"
        containerStyles="w-auto grow"
        disabled={domainsLoading}
        withSearchInput
        searchPlaceholder="Search domains..."
        onSearchChange={setDomainSearch}
        onReachEnd={() => void fetchDomainsNextPage()}
        hasNextPage={domainsHasNextPage}
        isFetchingNextPage={domainsFetchingNextPage}
      />

      <SelectInputField
        id="category"
        options={categoryOptions}
        placeholder="By Category"
        value={categoryId}
        onChange={setCategoryId}
        className="bg-white"
        containerStyles="w-auto grow"
        disabled={categoriesLoading}
        withSearchInput
        searchPlaceholder="Search categories..."
        onSearchChange={setCategorySearch}
        onReachEnd={() => void fetchCategoriesNextPage()}
        hasNextPage={categoriesHasNextPage}
        isFetchingNextPage={categoriesFetchingNextPage}
      />

      <Button type="submit" variant="default" size="pill" className="shrink-0">
        Find Jobs
      </Button>
    </form>
  );
}
