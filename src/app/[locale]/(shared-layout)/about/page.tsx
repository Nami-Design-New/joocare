import { authOptions } from "@/auth";
import AboutHeroSection from "@/features/about/components/AboutHeroSection";
import CorePillarsSection from "@/features/about/components/CorePillarsSection";
import Mission from "@/features/about/components/Misison";
import Vision from "@/features/about/components/Vision";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";
import { getServerSession } from "next-auth";

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  console.log('session', session);
  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <section className="pt-6 sm:pt-14 lg:pt-18">
        <section className="px-3 lg:px-25">
          <section className="container mx-auto">
            <AboutHeroSection />
            <CorePillarsSection />
            <Vision />
            <Mission />
          </section>
        </section>
      </section>
    </>
  );
}
