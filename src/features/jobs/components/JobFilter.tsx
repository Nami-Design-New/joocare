"use client";

import { SelectInputField } from "@/shared/components/SelectInputField";
import { useState } from "react";
type Option = {
  label: string;
  value: string;
  image?: string;
};

const jobTypes: Option[] = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Paused Time", value: "paused" },
  { label: "Draft", value: "draft" },
];
export default function JobFilter() {
  const [jobType, setJobType] = useState<Option | undefined>();
  return (
    <form>
      <SelectInputField
        id="jobType"
        options={jobTypes}
        placeholder="Status"
        value={jobType}
        onChange={() => setJobType}
        className="bg-white"
        containerStyles="w-auto grow"
      />
    </form>
  );
}
