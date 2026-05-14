"use client";

import { useTranslations } from "next-intl";
import JobCardSkeleton from "./JobCardSkeleton";

type JobsSectionSkeletonProps = {
  companyName: string;
  cardsCount?: number;
};

export default function JobsSectionSkeleton({
  companyName,
  cardsCount = 4,
}: JobsSectionSkeletonProps) {
  const t = useTranslations();
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{t("sharedCompanyProfilePage.jobs-from", { companyName })}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: cardsCount }, (_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
