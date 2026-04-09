"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eye } from "lucide-react";
import { CompanyJob } from "../index.type";
import { formatDate } from "@/shared/util/formateDate";

export default function ActiveJobRow({
  activeJob,
  onView,
}: {
  activeJob: CompanyJob;
  onView?: (a: CompanyJob) => void;
}) {
  return (
    <TableRow className="border-border border-b bg-white text-center transition-colors">
      <TableCell className="text-muted-foreground w-12 px-4 py-5 font-medium text-ellipsis">
        {activeJob?.job_title?.title}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {activeJob.views_num}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {activeJob.applications_count}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {formatDate(activeJob.created_at)}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            // href={`/company/job/${activeJob?.id}/candidates`}
            href={`/company/job/candidates`}
            className={` ${buttonVariants({
              variant: "default",
              size: "sm",
            })} flex items-center gap-1.5 rounded-full px-4`}
            onClick={() => onView?.(activeJob)}
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
