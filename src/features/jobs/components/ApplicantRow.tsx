"use client";

import { Button } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Eye } from "lucide-react";
import Image from "next/image";
import { Applicant } from "../index.types";

export default function ApplicantRow({
  applicant,
  onDownload,
  onView,
}: {
  applicant: Applicant;
  onDownload?: (a: Applicant) => void;
  onView?: (a: Applicant) => void;
}) {
  return (
    <TableRow className="odd:bg-muted border-border border-b bg-white transition-colors">
      <TableCell className="text-muted-foreground w-12 px-4 py-5 font-medium">
        #{applicant.id}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {applicant.name}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {applicant.email}
      </TableCell>
      <TableCell className="text-foreground text-md px-4 py-5 font-normal">
        {applicant.phone}
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-5 text-sm whitespace-pre-line">
        {applicant.date}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full px-4"
            onClick={() => onDownload?.(applicant)}
          >
            <Image
              src="/assets/icons/pdf-icon.svg"
              width={14}
              height={14}
              alt="pdf icon"
            />
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-secondary text-secondary flex items-center gap-1.5 rounded-full px-4"
            onClick={() => onView?.(applicant)}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
