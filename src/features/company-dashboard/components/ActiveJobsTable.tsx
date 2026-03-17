"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { activeJobType } from "../index.type";
import ActiveJobRow from "./ActiveJobRow";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { useState } from "react";

type activeJobsProps = {
  activeJobs: activeJobType[];
  onView?: (activeJob: activeJobType) => void;
};

const tabelHeaderTitles = [
  "Job Title",
  "Job Views",
  "Applicants",
  "Posted Since",
  " ",
];
export default function ActiveJobsTable({
  activeJobs,
  onView,
}: activeJobsProps) {
  const [page, setPage] = useState(1);
  return (
    <section>
      <div className="border-border w-full overflow-x-auto rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-b border-[#E4E5E8] hover:bg-white">
              {tabelHeaderTitles.map((col) => (
                <TableHead
                  key={col}
                  className="text-foreground text-md px-4 py-5 text-center font-semibold"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {activeJobs.map((activeJob) => (
              <ActiveJobRow
                key={activeJob.id}
                activeJob={activeJob}
                onView={onView}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex w-full items-center justify-center">
        <CustomPagination
          currentPage={page}
          totalItems={57}
          pageSize={10}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
