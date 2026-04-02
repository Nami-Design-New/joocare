import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import { MoveRight } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-20 lg:py-24">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-[50px] bg-[#09760A] px-4 sm:px-6 md:flex-row md:gap-10 lg:gap-16 lg:px-0">
        {/* Left Ellipse */}
        <div className="absolute top-1/2 -left-20 h-[46px] w-[300px] -translate-y-1/2 rotate-[22deg] rounded-full bg-[#DEFFDE] opacity-80 blur-[200px] sm:-left-40 sm:w-[503px]" />

        {/* Right Ellipse */}
        <div className="absolute top-1/2 -right-20 h-[46px] w-[300px] -translate-y-1/2 rotate-[22deg] rounded-full bg-[#DEFFDE] opacity-80 blur-[200px] sm:-right-40 sm:w-[503px]" />

        {/* Text */}
        <div className="px-4 pt-8 text-center text-white sm:px-6 md:px-16">
          <h2 className="mb-4 text-2xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
            Hire Medical Professionals with Seamless Talent Access
          </h2>

          <p className="text-sm leading-relaxed opacity-90 sm:text-base">
            Selection made effortless. We replace the endless resume scroll with
            a hand-selected shortlist of clinical experts. Every profile is
            complete, compliant, and ready for your final approval, ensuring
            your hiring process is as smooth as it is effective.
          </p>

          <Button
            variant="default"
            size="pill"
            hoverStyle="slideSecondary"
            className="mx-auto mt-6 w-full flex items-center justify-center gap-2 bg-black sm:mt-8 sm:w-fit"
          >
            Get Started Now
      
            <MoveRight className="mt-[3px]" size={16} />
          </Button>
        </div>

        {/* Image */}
        <div className="relative mt-6 h-[300px] w-full overflow-hidden rounded-2xl sm:h-[380px] md:mt-0 lg:h-[420px]">
          <Image
            src="/assets/employers/bannerImg.png"
            alt="Medical hiring"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
