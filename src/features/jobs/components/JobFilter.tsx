"use client";

import { SelectInputField } from "@/shared/components/SelectInputField";
import { useTranslations } from "next-intl";

type Option = {
  label: string;
  value: string;
  image?: string;
};

type JobFilterProps = {
  value?: string;
  onStatusChange?: (status: string) => void;
};

export default function JobFilter({ value = "", onStatusChange }: JobFilterProps) {
  const t = useTranslations();
  const jobTypes: Option[] = [
    { label: t("companyPage.jobs.status.open"), value: "open" },
    { label: t("companyPage.jobs.status.closed"), value: "closed" },
    { label: t("companyPage.jobs.status.paused"), value: "paused" },
    { label: t("companyPage.jobs.status.draft"), value: "draft" },
  ];
  return (
    <form>
      <SelectInputField
        id="jobType"
        options={jobTypes}
        placeholder={t("companyPage.jobs.status.placeholder")}
        value={value}
        onChange={(nextValue) => onStatusChange?.(nextValue)}
        className="bg-white"
        containerStyles="w-auto grow"
      />
    </form>
  );
}
