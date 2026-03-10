import FAQSection from "@/features/home/components/FAQSection";
import Hero from "@/features/home/components/Hero";
import HowItWorks from "@/features/home/components/HowItWorks";
import { ImpactSection } from "@/features/home/components/ImpactSection";
import { LiveJobs } from "@/features/home/components/LiveJobs";
import { Testimonials } from "@/features/home/components/Testimonials";
import TopEmployers from "@/features/home/components/TopEmployers";
import WhyUs from "@/features/home/components/WhyUs";

export default function Home() {
  return (
    <section className="">
      <Hero />
      <HowItWorks />
      <WhyUs />
      <TopEmployers />
      <ImpactSection />
      <LiveJobs />
      <Testimonials />
      <FAQSection />
    </section>
  );
}
