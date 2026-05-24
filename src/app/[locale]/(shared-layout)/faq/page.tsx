import type { Metadata, ResolvingMetadata } from "next";
import ContactSection from "@/features/contact/ContactSection";
import FaqAccordionSection from "@/features/faq/components/FaqAccordionSection";
import FaqPagination from "@/features/faq/components/FaqPagination";
import { getFaqsPageData } from "@/features/faq/services";
import {
  buildFaqPagePath,
  getFaqPageCopy,
  getSiteOrigin,
  normalizeFaqPageParam,
} from "@/features/faq/utils";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";
import { getNextAuthToken } from "@/shared/util/auth.util";
import { getTranslations } from "next-intl/server";
import { getSharedOgImage } from "@/shared/util/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFaqAudienceByRole(
  authRole?: "candidate" | "employer",
): "employees" | "companies" | undefined {
  if (authRole === "candidate") {
    return "employees";
  }

  if (authRole === "employer") {
    return "companies";
  }

  return undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = normalizeFaqPageParam(resolvedSearchParams.page);
  const copy = getFaqPageCopy(locale, currentPage);
  const siteOrigin = getSiteOrigin();
  const canonicalPath = buildFaqPagePath(locale, currentPage);

  const ogImage = await getSharedOgImage(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${siteOrigin}${canonicalPath}`,
      languages: {
        en: `${siteOrigin}/en/faq`,
        ar: `${siteOrigin}/ar/faq`,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${siteOrigin}${canonicalPath}`,
      type: "website",
      siteName: "Joocare",
      images: [{ url: ogImage, width: 1200, height: 630, alt: copy.title }], // ✅
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [ogImage], // ✅
    },
  };
}
export default async function FaqPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = normalizeFaqPageParam(resolvedSearchParams.page);
  const authSession = await getNextAuthToken();
  const t = await getTranslations();
  const faqAudience = getFaqAudienceByRole(authSession?.authRole);
  const faqsData = await getFaqsPageData(locale, currentPage, faqAudience);
  const copy = getFaqPageCopy(locale, faqsData.currentPage);
  const canonicalPath = buildFaqPagePath(locale, faqsData.currentPage);
  const siteOrigin = getSiteOrigin();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("header.home"),
            item: `${siteOrigin}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("home.faq"),
            item: `${siteOrigin}${canonicalPath}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        name: copy.title,
        description: copy.description,
        url: `${siteOrigin}${canonicalPath}`,
        mainEntity: faqsData.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <PlainBreadcrumb
        items={[
          { label: t("header.home"), href: "/" },
          { label: t("home.faq") },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section>
        <FaqAccordionSection title={copy.heading} items={faqsData.items} />
        <FaqPagination
          locale={locale}
          currentPage={faqsData.currentPage}
          totalPages={faqsData.totalPages}
          pageSize={faqsData.pageSize}
          totalItems={faqsData.totalItems}
        />

        <div className="bg-body-bg flex flex-col gap-12 py-20">
          <h2 className="text-center text-5xl font-bold">{copy.tryTitle}</h2>
          <ContactSection
            authRole={authSession?.authRole}
            initialValues={{
              name: authSession?.user?.name ?? "",
              email: authSession?.user?.email ?? "",
            }}
            containerClassName="bg-card shadow-soft mx-auto grid w-full grid-cols-12 gap-y-4 rounded-3xl border p-4 sm:p-6 md:p-7 lg:gap-x-8"
          />
        </div>
      </section>
    </>
  );
}
