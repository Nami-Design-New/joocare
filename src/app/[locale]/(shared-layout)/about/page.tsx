import AboutHeroSection from "@/features/about/components/AboutHeroSection";
import CorePillarsSection from "@/features/about/components/CorePillarsSection";
import Mission from "@/features/about/components/Misison";
import Vision from "@/features/about/components/Vision";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function AboutPage() {
  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <section className="sm:pt-14 lg:pt-18">
        <AboutHeroSection />
        <CorePillarsSection />
        <Vision />
        <Mission />
      </section>
    </>
  );
}
