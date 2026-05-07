import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import type { BannerSectionProps } from "../types";

export default function BannerSection({
  title,
  description,
  image,
}: BannerSectionProps) {
  const bannerImage = image ?? {
    id: "fallback-banner",
    image: "/assets/employers/bannerImg.png",
    alt: "Medical hiring",
  };

  return (
    <section className="relative bg-white ">
      <div className="relative mx-auto flex flex-col items-center gap-6 rounded-[50px] bg-primary-gradient px-4 sm:px-6 xl:flex-row md:gap-10 lg:py-4 lg:gap-16 lg:px-0">
        {/* <div className="absolute top-1/2 -left-20 h-11.5 w-75 -translate-y-1/2 rotate-22 rounded-full bg-primary-bg opacity-80 blur-[200px] sm:-left-40 sm:w-[503px]" />
*/}
        <div className="relative px-4 pt-8 text-center text-white sm:px-6 md:px-16 ">
          <div className="hidden sm:block sm:absolute top-0 left-1/5 h-full w-18 rounded-full -rotate-45 bg-white blur-[120px] " />
          <h2 className="mb-4 leading-tight font-bold text-white text-[clamp(1.75rem,2.8vw,3rem)]">
            {title}
          </h2>

          <p className="leading-relaxed opacity-90 text-[clamp(.75rem,2.8vw,1rem)]">
            {description}
          </p>

          <Link
            href="/auth/employer/register"
            className={cn(buttonVariants({
              variant: "default"
              , size: "pill"
              , hoverStyle: "slideSecondary"
            }), "mx-auto mt-6 flex w-full items-center justify-center gap-2 sm:mt-8 sm:w-fit")}
          >

            Get Started Now
            <MoveRight className="mt-0.75" size={16} />

          </Link>
        </div>

        <div className="w-full rounded-2xl xl:mt-0 flex  items-center  xl:items-start justify-center">
          <Image
            src={bannerImage.image}
            alt={bannerImage.alt}
            width={500}
            height={600}
            className="relative xl:absolute object-contain bottom-0 xl:-right-12 h-75 sm:h-98"
          />
        </div>
      </div>
    </section>
  );
}
