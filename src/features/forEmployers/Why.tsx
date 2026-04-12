import { Button } from "@/shared/components/ui/button";
import SectionTitle from "../home/components/SectionTitle";
import { MoveRight } from "lucide-react";
import { FeatureItem } from "./FeatureItem";

type Feature = { title: string; desc: string };



export default function Why() {
  const features: Feature[] = [
    {
      title: "Smart Matching Engine",
      desc: "Bypass the manual search. Our engine analyzes your specific clinical requirements to present only the most compatible specialists for your final review.",
    },
    {
      title: "Instant Primary Source Verification",
      desc: "Selection is smart and simple. Every profile arrives with pre-validated licenses and certifications, removing the administrative burden of manual background checks.",
    },
    {
      title: "Streamlined Acquisition Workflow",
      desc: "Monitor your entire hiring lifecycle from a single dashboard. From initial attraction to final placement, enjoy a transparent process that keeps your team informed.",
    },
    {
      title: "Direct Access to Elite Talent",
      desc: "Connect with a curated pool of high-caliber professionals instantly. We bridge the gap between your vacancy and the industry's top talent with zero intermediaries.",
    },
    {
      title: "Instant & Secure Messaging",
      desc: "Speed up your selection process with a built-in, encrypted communication channel. Connect directly with top-tier specialists to finalize details faster.",
    },
    {
      title: "Geographic Talent Precision",
      desc: "Find the right fit exactly where you need it. Our localized search filters allow you to identify and select nearby medical professionals, reducing commute-related turnover.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto  px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-5">
            <div className="mb-2">
              <SectionTitle
                sectionTitle="Talent at the Right Time"
                translationKey="talentAtTheRightTime"
                textColor="text-dark"
              />
            </div>

            <h2 className="mb-6 text-4xl font-bold text-[#0B3765] sm:text-5xl">
              Why joocare?
            </h2>

            <p className="mb-8 text-base text-justify leading-relaxed text-[#16304A]">
              Joocare provides a domain-oriented, business-focused ecosystem
              designed to align elite medical talent with your facility’s
              specific operational demands. By leveraging AI-automated smart
              filtration and intelligent support, we transform the recruitment
              process into an effortless selection experience that responds to
              your real-time clinical needs. Our platform ensures seamless
              access to a talent pipeline where every professional is
              pre-verified for credentials and compliance, removing
              administrative friction and allowing you to secure high-caliber
              specialists with absolute confidence.
            </p>

            <Button
              variant="default"
              size="pill"
              hoverStyle="slideSecondary"
              className="w-full flex items-center justify-center gap-2 sm:mt-8 sm:w-fit"
            >
              Get Started For Free

              <MoveRight className="mt-[3px]" size={16} />
            </Button>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {features.map((f) => (
                <FeatureItem key={f.title} title={f.title} desc={f.desc} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
