"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eye } from "lucide-react";
import { activeJobType } from "../index.type";

export default function ActiveJobRow({
  activeJob,
  onView,
}: {
  activeJob: activeJobType;
  onView?: (a: activeJobType) => void;
}) {
  return (
    <TableRow className="border-border border-b bg-white text-center transition-colors">
      <TableCell className="text-muted-foreground w-12 px-4 py-5 font-medium text-ellipsis">
        {activeJob.jobTitle}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {activeJob.jobViews}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {activeJob.applicants}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {activeJob.postedSince}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            href="/company/job/candidates"
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
