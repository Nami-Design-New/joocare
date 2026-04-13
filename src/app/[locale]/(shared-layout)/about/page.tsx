import AboutHeroSection from "@/features/about/components/AboutHeroSection";
import AboutMissionSection from "@/features/about/components/AboutMissionSection";
import AboutVisionSection from "@/features/about/components/AboutVisionSection";
import CorePillarsSection from "@/features/about/components/CorePillarsSection";
import { getAboutPageData } from "@/features/about/services/about-service";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const aboutData = await getAboutPageData(locale);

  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <section className="pt-6 sm:pt-14 lg:pt-18">
        <section className="px-3 lg:px-25">
          <section className="container mx-auto">
            <AboutHeroSection
              title={aboutData.aboutSection.title}
              description={aboutData.aboutSection.description}
              items={aboutData.aboutSection.items}
              images={aboutData.aboutSection.images}
            />
            <CorePillarsSection
              title={aboutData.chooseUs.title}
              items={aboutData.chooseUs.items}
              images={aboutData.chooseUs.images}
            />
            <AboutVisionSection
              title={aboutData.vision.title}
              description={aboutData.vision.description}
              images={aboutData.vision.images}
            />
            <AboutMissionSection
              title={aboutData.mission.title}
              description={aboutData.mission.description}
              images={aboutData.mission.images}
            />
          </section>
        </section>
      </section>
    </>
  );
}
