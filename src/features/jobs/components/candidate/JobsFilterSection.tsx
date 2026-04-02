"use client";

import { PopularSearchesItem } from "@/features/home/components/PopularSearches";
import PopularSearchesInteractive from "@/features/home/components/PopularSearchesInteractive";
import { InputField } from "@/shared/components/InputField";
import { Option, SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
const POPULAR_SEARCHES: PopularSearchesItem[] = [
  { id: "1", label: "Plastic Surgeon" },
  { id: "2", label: "Dermatologist" },
  { id: "3", label: "Dermatologist" },
  { id: "4", label: "Dermatologist" },
  { id: "5", label: "Dermatologist" },
  { id: "6", label: "Dermatologist" },
  { id: "7", label: "Dermatologist" },
  { id: "8", label: "Dermatologist" },
  { id: "9", label: "Dermatologist" },
  { id: "10", label: "Dermatologist" },
  { id: "11", label: "Dermatologist" },
  { id: "12", label: "Dermatologist" },
  { id: "13", label: "Dermatologist" },
  { id: "14", label: "Dermatologist" },
  { id: "15", label: "Dermatologist" },
  { id: "16", label: "Dermatologist" },
  { id: "17", label: "Dermatologist" },
  { id: "18", label: "Dermatologist" },
  { id: "19", label: "Dermatologist" },
  { id: "20", label: "Dermatologist" },
  // ...
];
const locations: Option[] = [
  { label: "Egypt", value: "egypt" },
  { label: "UAE", value: "uae" },
  { label: "Saudi Arabia", value: "ksa" },
];
export default function JobsFilterSection() {
  const [location, setLocation] = useState<Option | undefined>();
  return (
    <section className="px-3 lg:px-25">
      <section className="container mx-auto mt-4 lg:-mt-24">
        <section className="rounded-2xl bg-white p-4">
          <form className="bg-border mx-auto mb-4 flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 rounded-lg p-2 md:flex-nowrap md:rounded-full">
            <InputField
              className="grow bg-white"
              containerStyles="w-auto grow"
              id="search"
              placeholder="Job title or keyword"
            />

            <SelectInputField
              id="location"
              options={locations}
              placeholder="By country"
              value={location}
              onChange={setLocation}
              className="bg-white"
              containerStyles="w-auto grow"
            />

            <Button variant="default" size="pill" className="shrink-0">
              Search
            </Button>
          </form>
          <PopularSearchesInteractive
            items={POPULAR_SEARCHES}
            variant="hero"
            maxVisible={10}
          />
        </section>
      </section>
    </section>
  );
}
