"use client"

import ApplicantsClient from "@/features/jobs/components/ApplicantsClient";
import CandidatesFilter, { CandidatesFilterValues } from "@/features/jobs/components/CandidatesFilter";
import PositionCard from "@/features/jobs/components/PositionCard";
import useGetApplicationsCandidates from "@/features/jobs/hooks/useGetApplicationsCandidates";
import { Applicant } from "@/features/jobs/types/index.types";
import { CustomPagination } from "@/shared/components/CustomPagination";
import EmptyDataState from "@/shared/components/EmptyDataState";
import useGetCountries from "@/shared/hooks/useGetCountries";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";


export default function Page() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CandidatesFilterValues>({
    search: "",
    country: "",
    medicalLicense: "",
    recent: "",
  });
  const [submittedFilters, setSubmittedFilters] = useState<CandidatesFilterValues>({
    search: "",
    country: "",
    medicalLicense: "",
    recent: "",
  });
  const params = useParams<{ slug: string }>();
  const slug = Number(params?.slug);

  const { data: session, status } = useSession();
  const token = session?.accessToken as string;
  const { countries } = useGetCountries();

  const {
    data,
    candidates,
    total,
    perPage,
    lastPage,
    isFetching,
  } = useGetApplicationsCandidates({
    token,
    page,
    slug,
    filters: submittedFilters,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
  };

  const handleSearchChange = (search: string) => {
    setFilters((current) => ({ ...current, search }));
  };

  const handleFiltersChange = (nextFilters: CandidatesFilterValues) => {
    setFilters(nextFilters);
    setSubmittedFilters(nextFilters);
    setPage(1);
  };

  const handleFiltersSubmit = (nextFilters: CandidatesFilterValues) => {
    setSubmittedFilters(nextFilters);
    setPage(1);
  };

  const applicants = useMemo<Applicant[]>(
    () =>
      candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.user.name,
        email: candidate.user.email,
        phone: `${candidate.user.phone_code} ${candidate.user.phone}`.trim(),
        date: candidate.created_at,
        cvUrl: candidate.cv,
      })),
    [candidates],
  );

  const countryOptions = countries.map((country: { id: number; name: string }) => ({
    label: country.name,
    value: String(country.id),
  }));

  const displayedTotal = data?.total ?? total;
  const displayedPerPage = data?.per_page ?? perPage;

  return (
    <section className="grid grid-cols-1">
      <PositionCard
        logoSrc="/assets/comp-logo.svg"
        title="Senior Specialist Physician"
        company="Health care"
        employmentType="FULL-TIME"
      />
      <CandidatesFilter
        values={filters}
        countryOptions={countryOptions}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFiltersChange}
        onSubmit={handleFiltersSubmit}
        isSubmitting={isFetching}
      />
      {status === "loading" ? null : applicants.length > 0 ? <ApplicantsClient applicants={applicants} /> : null}
      {!isFetching && applicants.length === 0 ? (
        <div className="border-border text-muted-foreground mt-4 rounded-2xl border border-dashed p-8 text-center">
          <EmptyDataState />
        </div>
      ) : null}
      {/* <CustomPagination
        totalItems={displayedTotal}
        pageSize={displayedPerPage}
        currentPage={page}
        onPageChange={handlePageChange}
      /> */}
    </section>
  );
}
