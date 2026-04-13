import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import AboutSection from "@/features/shared-company-profile/components/AboutSection";
import HeaderSection from "@/features/shared-company-profile/components/HeaderSection";
import JobsSections from "@/features/shared-company-profile/components/JobsSections";
import {
    fetchCompanyJobsPageServer,
    getCompanyProfile,
} from "@/features/shared-company-profile/services/company-profile-service";
import { getInfiniteCompanyJobsQueryOptions } from "@/features/shared-company-profile/utils/company-jobs-utils";
import Breadcrumb from "@/shared/components/Breadcrumb";
import { getQueryClient } from "@/shared/providers/tanstack-query/query-client-setup";

export default async function SharedCompanyProfileDetails({
    params
}: {
    params: Promise<{ locale: string, slug: string }>;
}) {
    const { locale, slug } = await params;
    const { company } = await getCompanyProfile(slug);
    const queryClient = getQueryClient();
    let jobsError: unknown = null;

    try {
        await queryClient.fetchInfiniteQuery(
            getInfiniteCompanyJobsQueryOptions({
                slug,
                locale,
                fetchPage: fetchCompanyJobsPageServer,
            }),
        );
    } catch (error) {
        jobsError = error;
    }

    const companyName = company.name ?? "this company";
    const companyJobsQuery = queryClient.getQueryData(
        getInfiniteCompanyJobsQueryOptions({
            slug,
            locale,
            fetchPage: fetchCompanyJobsPageServer,
        }).queryKey,
    );
    const initialJobs = companyJobsQuery?.pages[0]?.data ?? [];

    return (

        <div className="bg-background min-h-screen pb-12">
            {/* Breadcrumb */}
            <Breadcrumb
                title={`About ${companyName}`}
                items={[{ label: "Home", href: "/" }, { label: `About ${companyName}` }]}
            />

            {/* Content */}
            <div className="bg-card shadow-soft mx-auto -mt-31  max-w-6xl gap-8 rounded-3xl border p-6 md:p-7">
                <HeaderSection company={company} />
                <AboutSection company={company} />
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <JobsSections
                        slug={slug}
                        locale={locale}
                        companyName={companyName}
                        initialJobs={initialJobs}
                        jobsError={jobsError}
                    />
                </HydrationBoundary>
            </div>

        </div>
    );
}
