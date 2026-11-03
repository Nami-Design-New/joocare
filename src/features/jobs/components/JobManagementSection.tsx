"use client"

import JobFilter from "@/features/jobs/components/JobFilter";
import { Link } from "@/i18n/navigation";
import { CustomPagination } from "@/shared/components/CustomPagination";
import { buttonVariants } from "@/shared/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useGetCompanyJobs from "../hooks/useGetCompanyJobs";
import { useJobListingPreview } from "../hooks/useJobListingPreview";
import JobCard from "./JobCard";
import JobRecruiterFilter from "./JobRecruiterFilter";
import SearchInput from "@/shared/components/SearchInput";
import JobCardSkeleton from "@/features/shared-company-profile/components/JobCardSkeleton";
import EmptyDataState from "@/shared/components/EmptyDataState";
import useGetCompanyProfile from "@/features/company-profile/hooks/useGetCompanyProfile";
import { useTranslations } from "next-intl";


export default function JobManagementSection() {
    const t = useTranslations();
    const [page, setPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("");
    const listing = useJobListingPreview();

    const { data: session } = useSession();
    const token = session?.accessToken as string;
    const { data: companyProfileData } = useGetCompanyProfile({ token });
    const {
        data,
        jobs,
        total,
        perPage,
        lastPage,
        isPending,
    } = useGetCompanyJobs({
        token,
        page,
        status: selectedStatus,
        search: listing.debouncedSearch,
        recruiter: listing.recruiter,
    });

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > lastPage) return;
        setPage(newPage);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setPage(1);
    };

    const handleSearchChange = (value: string) => {
        listing.setSearch(value);
        setPage(1);
    };

    const handleRecruiterChange = (value: string) => {
        listing.updateRecruiter(value);
        setPage(1);
    };

    const displayedJobs = data?.data ?? jobs ?? [];
    const displayedTotal = data?.total ?? total;
    const displayedPerPage = data?.per_page ?? perPage;

    return (
        <div className="flex flex-col gap-2">
            <header className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-[1.7fr_1fr_1fr]">
                    <SearchInput
                        value={listing.search}
                        onChange={(event) => handleSearchChange(event.currentTarget.value)}
                        placeholder={t("companyPage.jobs.listing.search-placeholder")}
                        iconClassName="size-4.5"
                        className="ps-11"
                    />
                    <JobFilter
                        value={selectedStatus}
                        onStatusChange={handleStatusChange}
                    />
                    <JobRecruiterFilter
                        value={listing.recruiter}
                        onChange={handleRecruiterChange}
                    />
                </div>

                <div className="relative group mt-auto order-3 shrink-0 max-lg:self-end">
                    <Link
                        className={` ${buttonVariants({
                            variant: "default",
                            size: "pill",
                        })} md:min-w-52 
                    ${companyProfileData?.status !== "Approved" ? "pointer-events-none opacity-50" : ""}`}
                        href="/company/post-job"
                    >
                        {t("companyPage.sidebar.post-job")}
                    </Link>

                    {companyProfileData?.status !== "Approved" && (
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                            whitespace-nowrap rounded bg-black text-white text-xs px-3 py-1 
                            opacity-0 group-hover:opacity-100 transition">
                            {t("companyPage.sidebar.post-job-tooltip-line-1")} <br /> {t("companyPage.sidebar.post-job-tooltip-line-2")}
                        </span>
                    )}
                </div>
            </header>
            <section className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
                {displayedJobs.length > 0 ? (
                    <>
                        {displayedJobs.map((eachJob) => (
                            <JobCard
                                key={eachJob.id}
                                job={eachJob}
                                href={`/jobs/${eachJob?.job_title?.id}`}
                                appliedBadge
                                appliedAtLabel={eachJob.created_at}
                                isPinned={listing.isPinned(eachJob.id)}
                                onTogglePin={() => listing.togglePin(eachJob.id)}
                            />
                        ))}

                        {isPending &&
                            Array.from({ length: 2 }).map((_, i) => (
                                <JobCardSkeleton key={`skeleton-${i}`} />
                            ))}
                    </>
                ) : isPending ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <JobCardSkeleton key={`initial-skeleton-${i}`} />
                    ))
                ) : (
                    <div className="border-border text-muted-foreground col-span-full rounded-2xl border border-dashed p-8 text-center">
                        <EmptyDataState />
                    </div>
                )}
            </section>
            {/* <JobsList /> */}
            {displayedJobs.length > 0 && (

                <CustomPagination
                    totalItems={displayedTotal}
                    pageSize={displayedPerPage}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
