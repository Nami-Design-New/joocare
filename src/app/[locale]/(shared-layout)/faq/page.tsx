import type { Metadata } from "next";
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

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
    },
  };
}

export default async function FaqPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = normalizeFaqPageParam(resolvedSearchParams.page);
  const faqsData = await getFaqsPageData(locale, currentPage);
  const copy = getFaqPageCopy(locale, faqsData.currentPage);
  const authSession = await getNextAuthToken();
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
            name: "Home",
            item: `${siteOrigin}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "FAQ",
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
      <PlainBreadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
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

        <div className="bg-body-bg container mx-auto flex flex-col gap-12 px-3 py-20 lg:px-20">
          <h2 className="text-center text-5xl font-bold">{copy.tryTitle}</h2>
          <ContactSection
            authRole={authSession?.authRole}
            initialValues={{
              name: authSession?.user?.name ?? "",
              email: authSession?.user?.email ?? "",
            }}
            containerClassName="bg-card shadow-soft grid grid-cols-12 gap-8 rounded-3xl border p-6 md:p-7"
          />
        </div>
      </section>
    </>
  );
}
