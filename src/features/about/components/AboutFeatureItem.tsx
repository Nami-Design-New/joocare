import Image from "next/image";

type AboutFeatureItemProps = {
  icon?: string | null;
  title: string;
  description: string;
};

export default function AboutFeatureItem({
  icon,
  title,
  description,
}: AboutFeatureItemProps) {
  return (
    <article className="flex items-start gap-3 sm:gap-4">
      <div className="text-primary rounded-xl bg-white p-2.5 shadow-sm sm:p-3">
        {icon ? (
          <Image src={icon} alt="" width={18} height={18} className="sm:h-5 sm:w-5" />
        ) : null}
      </div>

      <div className="min-w-0">
        <h4 className="text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </h4>
        <p className="max-w-md text-gray-600 sm:text-base lg:text-[14px]">
          {description}
        </p>
      </div>
    </article>
  );
}
