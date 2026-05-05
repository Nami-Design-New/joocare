import BannerSection from "@/features/forEmployers/components/BannerSection";
import EmployersHeroSection from "@/features/forEmployers/components/EmployersHeroSection";
import FAQSection from "@/features/forEmployers/components/FAQSection";
import HireSection from "@/features/forEmployers/components/HireSection";
import { getForEmployersPageData } from "@/features/forEmployers/services";
import WhySection from "@/features/forEmployers/components/WhySection";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";
import { getTranslations } from "next-intl/server";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";

export default async function ForEmployers({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tPage = await getTranslations({ locale, namespace: "ForEmployersPage" });
  let pageData;

  try {
    pageData = await getForEmployersPageData(locale);
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/"
          primaryLabel="Back to home"
        />
      );
    }

    throw error;
  }

  return (
    <>
      <PlainBreadcrumb
        items={[{ label: tCommon("home"), href: "/" }, { label: tPage("breadcrumbTitle") }]}
      />
      <section className="layout-shell">
        <section className="layout-content">
          <EmployersHeroSection
            title={pageData.hero.title}
            description={pageData.hero.description}
            images={pageData.hero.images}
          />
          <BannerSection
            title={pageData.banner.title}
            description={pageData.banner.description}
            image={pageData.banner.image}
          />
          <WhySection
            title={pageData.whyJoocare.title}
            description={pageData.whyJoocare.description}
            items={pageData.whyJoocare.items}
          />
        </section>
      </section>
      <HireSection
        title={pageData.hireSteps.title}
        description={pageData.hireSteps.description}
        items={pageData.hireSteps.items}
      />
      <section className="layout-shell">
        <section className="layout-content">
          <FAQSection title={pageData.faqs.title} items={pageData.faqs.items} />
        </section>
      </section>
    </>
  );
}
