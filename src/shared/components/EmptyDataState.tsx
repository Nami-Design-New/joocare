import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";

type EmptyDataStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function EmptyDataState({
  title = "jobsPage.empty-title",
  description,
  className,
}: EmptyDataStateProps) {
  const t = useTranslations()
  return (
    <div
      className={cn(
        "col-span-full flex min-h-80 flex-col items-center justify-center rounded-[28px] bg-white px-6 py-10 text-center",
        className,
      )}
    >
      <Image
        src="/no-data.svg"
        alt={t('jobsPage.empty-title')}
        width={220}
        height={170}
        className="h-auto w-full max-w-55"
        priority={false}
      />
      <h3 className="mt-6 text-lg font-semibold text-secondary">{t(title)}</h3>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm">{description}</p>
      ) : null}
    </div>
  );
}
