import Image from "next/image";
import type { FeatureItemProps } from "../types";

export function FeatureItem({ title, desc }: FeatureItemProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full">
          <Image
            src="/assets/employers/award.svg"
            alt="award"
            width={44}
            height={44}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-secondary">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-pretty text-gray-600">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
