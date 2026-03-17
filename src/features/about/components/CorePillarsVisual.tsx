import { Plus, Search } from "lucide-react";
import Image from "next/image";

export default function CorePillarsVisual() {
  return (
    <div className="relative mx-auto flex h-fit w-full max-w-85 flex-col gap-4 sm:sm:max-w-130 sm:gap-6 lg:mx-0 lg:max-w-none">
      <div className="relative h-45 w-[78%] overflow-hidden rounded-tl-[40px] rounded-br-[40px] sm:h-55 sm:w-85 sm:rounded-tl-[50px] sm:rounded-br-[50px] lg:h-50 lg:w-[320px]">
        <Image
          src="/assets/about/corePillar1.jpg"
          alt="Medical recruitment workflow"
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute top-1 right-20 sm:top-0">
        <Image
          src="/assets/about/dots.png"
          alt="Decorative dots"
          width={80}
          height={80}
          className="sm:h-25 sm:w-25 lg:h-auto"
        />
      </div>

      <div className="absolute top-15 right-0 flex w-[72%] items-center gap-2 sm:top-17.5 sm:w-[60%] sm:gap-4">
        <div className="min-w-0 flex-1 rounded-xl bg-white px-4 py-2 shadow-lg sm:px-6 sm:py-3">
          <span className="text-sm text-gray-500 sm:text-base">
            Search jobs
          </span>
        </div>
        <div className="bg-primary rounded-lg p-2.5 text-white sm:p-3">
          <Search size={20} />
        </div>
      </div>

      <div className="absolute top-47.5 right-0 z-10 sm:top-60 lg:top-55">
        <div className="rounded-xl bg-white px-4 py-2 shadow-lg sm:px-6 sm:py-3">
          <span className="flex items-center gap-2 text-sm font-bold sm:text-base">
            <Image
              src="/assets/about/stars.svg"
              alt="Credentialing AI"
              width={28}
              height={28}
              className="h-5 w-5 sm:h-7 sm:w-7"
            />
            Credentialing AI
          </span>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-6">
        <div className="`h-42.5 relative w-[44%] overflow-hidden rounded-tr-[40px] rounded-bl-[40px] sm:h-50 sm:w-50 sm:rounded-tr-[50px] sm:rounded-bl-[50px]">
          <Image
            src="/assets/about/corePillar2.jpg"
            alt="Healthcare professional"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative h-[240px] w-[56%] overflow-hidden rounded-tl-[40px] rounded-br-[40px] sm:h-[300px] sm:w-[260px] sm:rounded-tl-[50px] sm:rounded-br-[50px]">
          <Image
            src="/assets/about/corePillar3.jpg"
            alt="Clinical team"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-2xl bg-white p-4 shadow-xl sm:bottom-12.5 sm:left-20 sm:p-6">
        <p className="text-foreground text-sm font-semibold sm:text-base">
          12k+ Verified Doctors
        </p>

        <div className="mt-3 flex items-center">
          <Image
            src="/assets/about/doc1.jpg"
            width={36}
            height={36}
            alt="Verified doctor"
            className="h-8 w-8 rounded-full border-2 border-white object-cover sm:h-9 sm:w-9"
          />
          <Image
            src="/assets/about/doc2.jpg"
            width={36}
            height={36}
            alt="Verified doctor"
            className="-ml-3 h-8 w-8 rounded-full border-2 border-white object-cover sm:h-9 sm:w-9"
          />
          <Image
            src="/assets/about/doc3.jpg"
            width={36}
            height={36}
            alt="Verified doctor"
            className="-ml-3 h-8 w-8 rounded-full border-2 border-white object-cover sm:h-9 sm:w-9"
          />
          <div className="text-primary -ml-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EBEFF5] sm:h-9 sm:w-9">
            <Plus size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
