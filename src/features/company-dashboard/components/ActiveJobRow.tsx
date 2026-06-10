"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eye } from "lucide-react";
import { CompanyJob } from "../index.type";
import { formatDate } from "@/shared/util/formateDate";
import TextSkeleton from "@/features/company-profile/components/TextSkeleton";
import { useLocale, useTranslations } from "next-intl";

export default function ActiveJobRow({
  activeJob,
  onView,
  isLoading
}: {
  activeJob?: CompanyJob;
  onView?: (a: CompanyJob) => void;
  isLoading: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  return (
    <TableRow
      className={`border-border border-b bg-white transition-colors ${isRtl ? "text-right" : "text-center"
        }`}
    >
      <TableCell className="text-muted-foreground w-12 px-4 py-5 font-medium text-ellipsis">
        {isLoading ? <TextSkeleton /> : activeJob?.job_title?.title ?? activeJob?.title}
      </TableCell>
      <TableCell className="text-foreground text-base px-4 py-5 font-normal">
        {isLoading ? <TextSkeleton /> : activeJob?.views_num}
      </TableCell>
      <TableCell className="text-foreground text-base px-4 py-5 font-normal">
        {isLoading ? <TextSkeleton /> : activeJob?.applications_count}
      </TableCell>
      <TableCell className="text-foreground text-base px-4 py-5 font-normal">
        {isLoading ? (
          <TextSkeleton />
        ) : (
          formatDate(activeJob!.created_at)
        )}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <TextSkeleton />
        ) : (
          <div className={`flex items-center gap-2 ${isRtl ? "justify-end" : "justify-center"}`}>
            <Link
              href={`/company/job/candidates/${activeJob?.id}`}
              // href={`/company/job/candidates`}
              className={` ${buttonVariants({
                variant: "default",
                size: "sm",
              })} flex items-center gap-1.5 rounded-full px-4`}
              onClick={() => onView?.(activeJob!)}
            >
              <Eye className="h-4 w-4" />
              {t("common.view")}
            </Link>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
