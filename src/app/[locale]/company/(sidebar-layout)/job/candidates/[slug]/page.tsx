"use client"

import ApplicantsClient from "@/features/jobs/components/ApplicantsClient";
import CandidatesFilter, { CandidatesFilterValues } from "@/features/jobs/components/CandidatesFilter";
import PositionCard from "@/features/jobs/components/PositionCard";
import useGetApplicationsCandidates from "@/features/jobs/hooks/useGetApplicationsCandidates";
import { useGetCompanyJob } from "@/features/jobs/hooks/useGetCompanyJob";
import { Applicant } from "@/features/jobs/types/index.types";
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
  const { data: job } = useGetCompanyJob(Number.isFinite(slug) ? slug : null);

  const {
    candidates,
    isFetching,
  } = useGetApplicationsCandidates({
    token,
    page,
    slug,
    filters: submittedFilters,
  });

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

  console.log("candidates", candidates);

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

  const jobTitle = job?.title ?? job?.job_title?.title ?? "Untitled job";
  const companyName = job?.company?.name ?? "Your company";
  const companyLogo = job?.company?.image ?? "/assets/comp-logo.svg";
  const employmentType = job?.employment_type?.title ?? "Not specified";

  return (
    <section className="grid grid-cols-1">
      <PositionCard
        logoSrc={companyLogo}
        title={jobTitle}
        company={companyName}
        employmentType={employmentType}
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
    </section>
  );
}
