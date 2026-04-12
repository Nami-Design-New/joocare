"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActiveJobRow from "./ActiveJobRow";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useGetCompanyJobs from "../hooks/useGetCompanyJobs";

const tabelHeaderTitles = [
  "Job Title",
  "Job Views",
  "Applicants",
  "Posted Since",
  " ",
];
export default function ActiveJobsTable() {
  const [page, setPage] = useState(1);

  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    jobs,
    total,
    perPage,
    lastPage,
    isLoading,
  } = useGetCompanyJobs({ token, page });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
  };

  return (
    <section>
      <div className="border-border w-full overflow-x-auto rounded-2xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {tabelHeaderTitles.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>


          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                <ActiveJobRow
                  key={index} isLoading={true} />
              ))
              : jobs.map((job) => (
                <ActiveJobRow
                  key={job.id}
                  activeJob={job}
                  isLoading={false}
                />
              ))}
          </TableBody>

        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <CustomPagination
          totalItems={total}
          pageSize={perPage}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
