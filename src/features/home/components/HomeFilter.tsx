"use client";

import { useState } from "react";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";

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

export default function HomeFilter() {
  const [jobType, setJobType] = useState<Option | undefined>();
  const [location, setLocation] = useState<Option | undefined>();
  const [category, setCategory] = useState<Option | undefined>();

  return (
    <form className="bg-border flex w-full flex-wrap items-center justify-center gap-2 rounded-lg p-2 md:flex-nowrap md:rounded-full">
      <InputField
        className="grow bg-white"
        containerStyles="w-auto grow"
        id="search"
        placeholder="Job title or keyword"
      />

      <SelectInputField
        id="jobType"
        options={jobTypes}
        placeholder="Job Type"
        value={jobType}
        onChange={setJobType}
        className="bg-white"
        containerStyles="w-auto grow"
      />

      <SelectInputField
        id="location"
        options={locations}
        placeholder="Location"
        value={location}
        onChange={setLocation}
        className="bg-white"
        containerStyles="w-auto grow"
      />

      <SelectInputField
        id="category"
        options={categories}
        placeholder="Category"
        value={category}
        onChange={setCategory}
        className="bg-white"
        containerStyles="w-auto grow"
      />

      <Button variant="default" size="pill" className="shrink-0">
        Find Jobs
      </Button>
    </form>
  );
}
