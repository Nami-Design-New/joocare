import Image from "next/image";
import SectionTitle from "../home/components/SectionTitle";

export default function EmployersHero() {
  return (
    <section className="bg-white pt-14 py-18 lg:py-18">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
        <div>
          <div className="mb-2">
            <SectionTitle
              sectionTitle="Your Healthcare Recruitment, Simplified!"
              textColor="text-dark"
            />
          </div>

          <h2 className="text-secondary mb-3 text-3xl leading-tight font-bold sm:text-4xl lg:mb-2 lg:text-5xl">
            <span className="block text-secondary text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              The Intelligence
            </span>
            Ecosystem for Clinical Talent Acquisition!
          </h2>

          <p className="text-secondary mb-8 max-w-xl text-left text-sm leading-relaxed sm:text-base lg:text-justify">
            We go beyond resume matching to deliver audit-ready talent, ensuring
            every placement meets the highest standards of medical excellence
            and organizational fit
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[520px] items-end justify-center gap-6 lg:max-w-none">
          {/* Image 1 */}
          <div className="relative h-100 w-[220px] overflow-hidden rounded-[28px] sm:w-[260px]">
            <Image
              src="/assets/employers/1.png"
              alt="Building"
              fill
              className="object-cover"
            />
          </div>

          {/* Image 2 (taller center image) */}
          <div className="relative h-100 w-[220px] overflow-hidden rounded-[28px] sm:w-[260px]">
            <Image
              src="/assets/employers/2.png"
              alt="Lab"
              fill
              className="object-cover"
            />
          </div>

          {/* Image 3 */}
          <div className="relative h-100 w-[220px] overflow-hidden rounded-[28px] sm:w-[260px]">
            <Image
              src="/assets/employers/3.png"
              alt="Hospital"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
