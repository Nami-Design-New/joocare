import type { LucideIcon } from "lucide-react";

type AboutFeatureItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function AboutFeatureItem({
  icon: Icon,
  title,
  description,
}: AboutFeatureItemProps) {
  return (
    <article className="flex items-start gap-3 sm:gap-4">
      <div className="text-primary rounded-xl bg-white p-2.5 shadow-sm sm:p-3">
        <Icon size={18} className="sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0">
        <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </h4>
        <p className="max-w-md lg:text-[14px] text-gray-600 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}
