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
import useGetCompanyTableJobs from "../hooks/useGetCompanyTableJobs";
import { useLocale, useTranslations } from "next-intl";

export default function ActiveJobsTable() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [page, setPage] = useState(1);

  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const {
    jobs,
    total,
    perPage,
    lastPage,
    isLoading,
  } = useGetCompanyTableJobs({ token, page });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
  };

  return (
    <section>
      <div
        className="border-border w-full overflow-x-auto rounded-2xl border bg-white"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              {[
                t("companyPage.dashboard.table.job-title"),
                t("companyPage.dashboard.table.job-views"),
                t("companyPage.dashboard.table.applicants"),
                t("companyPage.dashboard.table.posted-since"),
                " ",
              ].map((col) => (
                <TableHead key={col} className="text-center">
                  {col}
                </TableHead>
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
