"use client";

import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
  image?: string;
};

const jobTypes: Option[] = [
  { label: "Full Time", value: "fulltime" },
  { label: "Part Time", value: "parttime" },
  { label: "Remote", value: "remote" },
];

const locations: Option[] = [
  { label: "Egypt", value: "egypt" },
  { label: "UAE", value: "uae" },
  { label: "Saudi Arabia", value: "ksa" },
];

const categories: Option[] = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "UI/UX", value: "uiux" },
];

export default function CandidatesFilter() {
  const [jobType, setJobType] = useState<Option | undefined>();
  const [location, setLocation] = useState<Option | undefined>();
  const [category, setCategory] = useState<Option | undefined>();
  return (
    <section className="mt-13 flex w-full flex-col gap-3 lg:flex-row lg:items-center">
      {/* Search */}
      <form className="bg-border flex w-full items-center gap-2 rounded-full p-2 lg:w-auto lg:flex-1">
        <InputField
          className="grow bg-white"
          containerStyles="w-full"
          id="search"
          placeholder="search name...."
        />

        <Button variant="default" size="pill" className="shrink-0">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-1">
        <SelectInputField
          id="jobType"
          options={jobTypes}
          placeholder="recent applied"
          value={jobType}
          onChange={setJobType}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="location"
          options={locations}
          placeholder="Country"
          value={location}
          onChange={setLocation}
          className="bg-white"
          containerStyles="w-full"
        />

        <SelectInputField
          id="license"
          options={locations}
          placeholder="Medical License"
          value={category}
          onChange={setCategory}
          className="bg-white"
          containerStyles="w-full"
        />
      </div>
    </section>
  );
}
