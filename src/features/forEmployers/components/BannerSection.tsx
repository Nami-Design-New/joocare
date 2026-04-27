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
      <div className="mx-auto flex flex-col items-center gap-6 rounded-[50px] bg-primary-gradient px-4 sm:px-6 lg:flex-row md:gap-10 lg:py-4 lg:gap-16 lg:px-0">
        {/* <div className="absolute top-1/2 -left-20 h-11.5 w-75 -translate-y-1/2 rotate-22 rounded-full bg-primary-bg opacity-80 blur-[200px] sm:-left-40 sm:w-[503px]" /> */}
        <div className="absolute top-1/2 -right-20 h-11.5 w-75 -translate-y-1/2 rotate-22 rounded-full  opacity-80 blur-[200px] sm:-right-40 sm:w-[503px]" />

        <div className="px-4 pt-8 text-center text-white sm:px-6 md:px-16">
          <h2 className="mb-4 text-2xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="text-sm leading-relaxed opacity-90 sm:text-base">
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

        <div className="mt-6 w-full rounded-2xl md:mt-0">
          <Image
            src={bannerImage.image}
            alt={bannerImage.alt}
            fill
            className="lg:absolute object-cover bottom-0 md:right-0 h-75 sm:h-95 lg:[600px]"
          />
        </div>
      </div>
    </section>
  );
}
