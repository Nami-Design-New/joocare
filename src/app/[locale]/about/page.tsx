import AboutHeroSection from "@/features/about/components/AboutHeroSection";
import CorePillarsSection from "@/features/about/components/CorePillarsSection";
import Mission from "@/features/about/components/Misison";
import Vision from "@/features/about/components/Vision";
import Breadcrumb from "@/shared/components/Breadcrumb";

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <section className="pt-24">
        <AboutHeroSection />
        <CorePillarsSection />
        <Vision />
        <Mission />
      </section>
    </>
  );
}
