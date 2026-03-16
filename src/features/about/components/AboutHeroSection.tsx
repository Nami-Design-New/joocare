import { Fingerprint, Globe, Rocket } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/features/home/components/SectionTitle";
import AboutFeatureItem from "./AboutFeatureItem";
import AboutStatItem from "./AboutStatItem";

const aboutFeatures = [
  {
    icon: Globe,
    title: "Trusted Global Network",
    description:
      "We provide direct access to over 12,000 verified doctors and hundreds of internationally accredited hospitals.",
  },
  {
    icon: Fingerprint,
    title: "Clinical AI Analysis",
    description:
      "We use advanced algorithms to analyse 'Clinical DNA' for each candidate to ensure 98% match between skills and job requirements.",
  },
  {
    icon: Rocket,
    title: "Fast-Track Compliance",
    description:
      "We streamline the legal processes and source verification of certificates so that interviews can take place within just 72 hours.",
  },
];

const aboutStats = [
  { value: "+500", label: "Healthcare Specializations Covered" },
  { value: "+100,000", label: "Verified Healthcare Professionals" },
  { value: "+500,000", label: "Active Job Opportunities" },
  { value: "98%", label: "Hiring Success Rate" },
];

export default function AboutHeroSection() {
  return (
    <section className="mx-auto grid pt-14 py-18 lg:py-18 max-w-7xl grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
      <div>
        <div className="mb-2">
          <SectionTitle sectionTitle="About JooCare" textColor="text-dark" />
        </div>

        <h2 className="text-secondary mb-3 text-3xl leading-tight font-bold sm:text-4xl lg:mb-2 lg:text-5xl">
          Built for the Complexity of <br />
          Modern Healthcare Hiring
        </h2>

        <p className="mb-8 max-w-xl text-left text-sm leading-relaxed text-gray-600 sm:text-base lg:text-justify">
          Joocare was engineered to address a fundamental gap in healthcare
          recruitment. Traditional hiring systems were never designed to manage
          clinical complexity, regulatory accountability, or the high-stakes
          consequences of misaligned medical placements. We built Joocare as an
          intelligence-driven ecosystem, purpose-designed for healthcare and
          life sciences institutions that cannot afford hiring uncertainty.
        </p>

        <div className="space-y-5 sm:space-y-6">
          {aboutFeatures.map((feature) => (
            <AboutFeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="relative sticky top-30 mx-auto flex w-full max-w-[340px] justify-center sm:max-w-[520px] lg:max-w-none">
        <div className="relative h-[380px] w-[300px] overflow-hidden rounded-[30px] sm:h-[460px] sm:w-[380px] sm:rounded-[40px]">
          <Image
            src="/assets/about/doctor2.jpg"
            alt="Doctor"
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute top-28 left-0 h-[210px] w-[170px] overflow-hidden rounded-[22px] border-8 border-white shadow-xl sm:top-40 sm:h-[260px] sm:w-[220px] sm:rounded-[30px] sm:border-16">
          <Image
            src="/assets/about/doctor1.jpg"
            alt="Doctor"
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-primary absolute top-[250px] left-[140px] flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white text-white shadow-lg sm:top-80 sm:left-[180px] sm:h-28 sm:w-28">
          <span className="text-lg font-bold sm:text-2xl">98%</span>
          <span className="text-[10px] sm:text-xs">Verified</span>
        </div>
      </div>

      <section className="lg:col-span-2">
        <div className="mt-12 grid grid-cols-1 gap-8 text-center sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {aboutStats.map((stat) => (
            <AboutStatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
