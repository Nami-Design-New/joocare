import { Fingerprint, Globe, Rocket } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/features/home/components/SectionTitle";

export default function Vision() {
  return (
    <section className="sm:my-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
        <div>
          <div className="mb-2">
            <SectionTitle sectionTitle="Our Vision" textColor="text-dark" />
          </div>

          <h2 className="text-secondary mb-3 text-3xl leading-tight font-bold sm:text-4xl lg:mb-2 lg:text-5xl">
            Our Vision
          </h2>

          <p className="mb-8 max-w-xl text-left text-sm leading-relaxed text-gray-600 sm:text-base lg:text-justify">
            To become the global architecture for healthcare human capital,
            where data-driven precision eliminates hiring risk and empowers
            every medical professional to reach their highest point of impact.
            The Joocare Commitment Joocare is more than a platform; it is a
            commitment to institutional resilience. By synthesizing
            Intelligence, Alignment, and Integrity, we are redefining the DNA of
            healthcare recruitment. We don’t just find candidates. We secure the
            future of your clinical operations.
          </p>
        </div>

      <div className="relative mx-auto flex w-full max-w-[340px] justify-center sm:max-w-[520px] lg:max-w-none">
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
      </div>

      </div>

    </section>
  );
}
