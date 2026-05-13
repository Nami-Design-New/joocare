import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

import AboutSection from "@/features/shared-company-profile/components/AboutSection";
import HeaderSection from "@/features/shared-company-profile/components/HeaderSection";
import JobsSections from "@/features/shared-company-profile/components/JobsSections";
import {
    fetchCompanyJobsPageServer,
    getCompanyProfile,
} from "@/features/shared-company-profile/services/company-profile-service";
import { getInfiniteCompanyJobsQueryOptions } from "@/features/shared-company-profile/utils/company-jobs-utils";
import { getSiteOrigin, stripHtml, truncateText } from "@/features/jobs/utils";
import Breadcrumb from "@/shared/components/Breadcrumb";
import { getQueryClient } from "@/shared/providers/tanstack-query/query-client-setup";

type PageProps = {
    params: Promise<{ locale: string, slug: string }>;
};

function getSharedCompanyProfileMetadataFallback(locale: string, slug: string): Metadata {
    const siteOrigin = getSiteOrigin();
    const canonicalUrl = `${siteOrigin}/${locale}/shared-company-profile/${slug}`;
    const title =
        locale === "ar" ? "ملف الشركة | Joocare" : "Company Profile | Joocare";
    const description =
        locale === "ar"
            ? "استكشف ملف الشركة والوظائف المنشورة على Joocare."
            : "Explore the company profile and published jobs on Joocare.";

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${siteOrigin}/en/shared-company-profile/${slug}`,
                ar: `${siteOrigin}/ar/shared-company-profile/${slug}`,
            },
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "profile",
            siteName: "Joocare",
            images: [
                {
                    url: `${siteOrigin}/logo-icon.jfif`,
                    alt: "Joocare logo",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${siteOrigin}/logo-icon.jfif`],
        },
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const siteOrigin = getSiteOrigin();
    const canonicalUrl = `${siteOrigin}/${locale}/shared-company-profile/${slug}`;

    try {
        const { company } = await getCompanyProfile(slug);
        const companyName = company.name?.trim() || "Company";
        const description = truncateText(
            stripHtml(company.bio ?? "").trim() ||
            (locale === "ar"
                ? `استكشف ملف ${companyName} والوظائف المنشورة على Joocare.`
                : `Explore ${companyName}'s profile and published jobs on Joocare.`),
            160,
        );
        const image = company.image || `${siteOrigin}/logo-icon.jfif`;
        const title =
            locale === "ar"
                ? `${companyName} | ملف الشركة | Joocare`
                : `${companyName} | Company Profile | Joocare`;

        return {
            title,
            description,
            alternates: {
                canonical: canonicalUrl,
                languages: {
                    en: `${siteOrigin}/en/shared-company-profile/${slug}`,
                    ar: `${siteOrigin}/ar/shared-company-profile/${slug}`,
                },
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                type: "profile",
                siteName: "Joocare",
                images: [
                    {
                        url: image,
                        alt: `${companyName} logo`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [image],
            },
        };
    } catch {
        return getSharedCompanyProfileMetadataFallback(locale, slug);
    }
}

export default async function SharedCompanyProfileDetails({
    params
}: PageProps) {
    const t = await getTranslations();
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

    const companyName = company.name ?? t("sharedCompanyProfilePage.this-company");
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
                title={t("sharedCompanyProfilePage.about-company", { companyName })}
                items={[{ label: t("header.home"), href: "/" }, { label: t("sharedCompanyProfilePage.about-company", { companyName }) }]}
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
                        companyImage={company.image as string}
                        initialJobs={initialJobs}
                        jobsError={jobsError}
                    />
                </HydrationBoundary>
            </div>

        </div>
    );
}
