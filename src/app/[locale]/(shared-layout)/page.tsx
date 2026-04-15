import FAQSection from "@/features/home/components/FAQSection";
import Hero from "@/features/home/components/Hero";
import HowItWorks from "@/features/home/components/HowItWorks";
import { ImpactSection } from "@/features/home/components/ImpactSection";
import { LiveJobs } from "@/features/home/components/LiveJobs";
import { getHomePageData } from "@/features/home/services/home-service";
import { Testimonials } from "@/features/home/components/Testimonials";
import TopEmployers from "@/features/home/components/TopEmployers";
import WhyUs from "@/features/home/components/WhyUs";
import HttpStatusState from "@/shared/components/HttpStatusState";
import { getHttpStatusCode } from "@/shared/lib/http-error";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let homeData;

  try {
    homeData = await getHomePageData(locale);
  } catch (error) {
    const statusCode = getHttpStatusCode(error);

    if (statusCode && [401, 403, 404, 422, 429, 503].includes(statusCode)) {
      return (
        <HttpStatusState
          statusCode={statusCode}
          error={error}
          primaryHref="/jobs"
          primaryLabel="Browse jobs"
          secondaryHref="/for-employers"
          secondaryLabel="For employers"
        />
      );
    }

    throw error;
  }

  console.log("Home page data:", homeData);
  return (
    <section className="">
      <Hero
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        description={homeData.hero.description}
        searches={homeData.hero.searches}
      />
      <HowItWorks title={homeData.howItWorks.title} steps={homeData.howItWorks.steps} />
      <WhyUs
        title={homeData.whyJoocare.title}
        legacyModelTitle={homeData.whyJoocare.legacyModelTitle}
        legacyModelDescription={homeData.whyJoocare.legacyModelDescription}
        legacyModels={homeData.whyJoocare.legacyModels}
        joocareModelTitle={homeData.whyJoocare.joocareModelTitle}
        joocareModelDescription={homeData.whyJoocare.joocareModelDescription}
        joocareModels={homeData.whyJoocare.joocareModels}
      />
      <TopEmployers
        title={homeData.topEmployers.title}
        companies={homeData.topEmployers.companies}
      />
      <ImpactSection title={homeData.impact.title} description={homeData.impact.description} />
      <LiveJobs title={homeData.recentJobs.title} jobs={homeData.recentJobs.jobs} />
      <Testimonials title={homeData.rates.title} reviews={homeData.rates.items} />
      <FAQSection title={homeData.faqs.title} items={homeData.faqs.items} />
    </section>
  );
}
