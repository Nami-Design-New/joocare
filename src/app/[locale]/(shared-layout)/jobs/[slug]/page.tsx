import { cache } from "react";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import SimilarJobsSection from "@/features/about/components/SimilarJobsSection";
import { authOptions } from "@/auth";
import AboutEmployer from "@/features/jobs/components/candidate/AboutEmployer";
import JobDetailsHeader from "@/features/jobs/components/candidate/JobDetailsHeader";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import {
  getAuthenticatedJobDetails,
  getPublicJobDetailsCached,
} from "@/features/jobs/services/job-details-service";
import { stripHtml, truncateText } from "@/features/jobs/utils";
import Breadcrumb from "@/shared/components/Breadcrumb";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";
import { toAbsoluteUrl } from "@/shared/lib/request-origin";
import { getSiteBaseUrl } from "@/shared/lib/site-url";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string, slug: string }>;
};

export const revalidate = 300;

const getJobDetailsCached = cache(async (slug: string, locale: string) => {
  return getPublicJobDetailsCached(slug, locale);
});

async function getJobPageMetadataFallback(locale: string, slug: string): Promise<Metadata> {
  const siteOrigin = getSiteBaseUrl();
  const canonicalUrl = `${siteOrigin}/${locale}/jobs/${slug}`;
  const defaultPreviewImage = `${siteOrigin}/api/og/job?title=${encodeURIComponent(
    locale === "ar" ? "تفاصيل الوظيفة" : "Job Details",
  )}&company=${encodeURIComponent("Joocare")}`;
  const previewImage = defaultPreviewImage;
  const title =
    locale === "ar" ? "تفاصيل الوظيفة | Joocare" : "Job Details | Joocare";
  const description =
    locale === "ar"
      ? "اكتشف تفاصيل الوظيفة على Joocare وشاركها بسهولة."
      : "Explore job details on Joocare and share the opportunity easily.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteOrigin}/en/jobs/${slug}`,
        ar: `${siteOrigin}/ar/jobs/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "Joocare",
      images: [
        {
          url: previewImage,
          alt: "Joocare logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [previewImage],
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteOrigin = getSiteBaseUrl();
  const canonicalUrl = `${siteOrigin}/${locale}/jobs/${slug}`;

  try {
    const { job } = await getJobDetailsCached(slug, locale);
    const jobTitle = job.title ?? job.job_title?.title ?? "Job opportunity";
    const companyName = job.company?.name?.trim();
    const location = [job.city?.name, job.country?.name].filter(Boolean).join(", ");
    const plainDescription = stripHtml(job.description ?? "").trim();
    const description = truncateText(
      plainDescription ||
      [companyName, location].filter(Boolean).join(" • ") ||
      (locale === "ar"
        ? "اكتشف تفاصيل هذه الوظيفة على Joocare."
        : "Explore this opportunity on Joocare."),
      160,
    );
    const title = companyName
      ? `${jobTitle} at ${companyName} | Joocare`
      : `${jobTitle} | Joocare`;

    const companyLogoRaw = job.company?.image;
    const companyLogoAbsolute = companyLogoRaw
      ? toAbsoluteUrl(companyLogoRaw, siteOrigin)
      : null;

    const absolutePreviewImage =
      companyLogoAbsolute ??
      `${siteOrigin}/api/og/job?title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(
        companyName || "Joocare",
      )}${location ? `&location=${encodeURIComponent(location)}` : ""}`;

    // console.log("companyLogoAbsolute:::", absolutePreviewImage, companyLogoAbsolute);
    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${siteOrigin}/en/jobs/${slug}`,
          ar: `${siteOrigin}/ar/jobs/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "article",
        siteName: "Joocare",
        images: [
          {
            url: absolutePreviewImage,
            width: 1200,
            height: 630,
            alt: companyName ? `${companyName} job opening` : "Joocare job opening",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [absolutePreviewImage],
      },
    };
  } catch {
    console.error("[jobs/[slug]] generateMetadata failed", { locale, slug });
    return await getJobPageMetadataFallback(locale, slug);
  }
}
// generateMetadata()
export default async function page({
  params
}: PageProps) {

  const { locale, slug } = await params
  const t = await getTranslations();
  let jobDetails;

  try {
    const session = await getServerSession(authOptions);
    jobDetails = session?.accessToken
      ? await getAuthenticatedJobDetails(slug, locale, session.accessToken)
      : await getJobDetailsCached(slug, locale);
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/jobs"
          primaryLabel={t("jobsPage.browse-jobs")}
          secondaryHref="/"
          secondaryLabel={t("common.back-to-home")}
        />
      );
    }

    throw error;
  }

  return (
    <section className="bg-body-bg">
      <Breadcrumb
        title={t("jobDetailsPage.breadcrumb-title")}
        items={[
          { label: t("header.home"), href: "/" },
          { label: t("header.jobs"), href: "/jobs" },
          { label: t("jobDetailsPage.breadcrumb-title"), href: "" },
        ]}
      />
      <section className="layout-shell">
        <section className="layout-content mt-4 lg:-mt-20">
          <JobDetailsHeader job={jobDetails?.job} />
          <div className="grid grid-cols-1 max-lg:gap-y-5 lg:gap-5 pt-7 lg:grid-cols-3">
            <div className="col-span-2 flex flex-col gap-8">
              <JobDescriptionCard job={jobDetails?.job} />
              <AboutEmployer employer={jobDetails?.job?.company} />
            </div>
            <div className="col-span-1 flex flex-col gap-8 max-lg:order-first">
              <JobLocationAndSalaryCard job={jobDetails.job} />
              <JobOverviewCard job={jobDetails.job} />
              <JobEducationAndCertificationsCard job={jobDetails.job} />
              <JobShareCard
                title={jobDetails?.job?.title ?? jobDetails?.job?.job_title?.title}
              />
            </div>
          </div>
          <SimilarJobsSection jobs={jobDetails.similar_jobs} />
        </section>{" "}
      </section>
    </section>
  );
}
