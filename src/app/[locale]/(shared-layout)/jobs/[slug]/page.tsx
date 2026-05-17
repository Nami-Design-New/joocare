import type { Metadata } from "next";
import SimilarJobsSection from "@/features/about/components/SimilarJobsSection";
import AboutEmployer from "@/features/jobs/components/candidate/AboutEmployer";
import JobDetailsHeader from "@/features/jobs/components/candidate/JobDetailsHeader";
import JobDescriptionCard from "@/features/jobs/components/JobDescriptionCard";
import JobEducationAndCertificationsCard from "@/features/jobs/components/JobEducationAndCertificationsCard";
import JobLocationAndSalaryCard from "@/features/jobs/components/JobLocationAndSalaryCard";
import JobOverviewCard from "@/features/jobs/components/JobOverviewCard";
import JobShareCard from "@/features/jobs/components/JobShareCard";
import { getJobDetails } from "@/features/jobs/services/job-details-service";
import { getSiteOrigin, stripHtml, truncateText } from "@/features/jobs/utils";
import Breadcrumb from "@/shared/components/Breadcrumb";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string, slug: string }>;
};

function getJobPageMetadataFallback(locale: string, slug: string): Metadata {
  const siteOrigin = getSiteOrigin();
  const canonicalUrl = `${siteOrigin}/${locale}/jobs/${slug}`;
  const previewImage = `${siteOrigin}/logo-icon.jfif`;
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
  const siteOrigin = getSiteOrigin();
  const canonicalUrl = `${siteOrigin}/${locale}/jobs/${slug}`;

  try {
    const { job } = await getJobDetails(slug);
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
    const previewImage = job.company?.image || `${siteOrigin}/logo-icon.jfif`;

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
            alt: companyName ? `${companyName} logo` : "Joocare logo",
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
  } catch {
    return getJobPageMetadataFallback(locale, slug);
  }
}

export default async function page({
  params
}: PageProps) {

  const { slug } = await params
  const t = await getTranslations();
  let jobDetails;

  try {
    jobDetails = await getJobDetails(slug)
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
