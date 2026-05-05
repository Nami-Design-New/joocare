"use client";

import { SelectInputField } from "@/shared/components/SelectInputField";

type Option = {
  label: string;
  value: string;
  image?: string;
};

type JobFilterProps = {
  value?: string;
  onStatusChange?: (status: string) => void;
};

const jobTypes: Option[] = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Paused Time", value: "paused" },
  { label: "Draft", value: "draft" },
];

export default function JobFilter({ value = "", onStatusChange }: JobFilterProps) {
  return (
    <form>
      <SelectInputField
        id="jobType"
        options={jobTypes}
        placeholder="Status"
        value={value}
        onChange={(nextValue) => onStatusChange?.(nextValue)}
        className="bg-white"
        containerStyles="w-auto grow"
      />
    </form>
  );
}
