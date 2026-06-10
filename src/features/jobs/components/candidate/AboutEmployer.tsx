import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { CompanyDetails } from "../../types/jobs.types";
import { getTranslations } from "next-intl/server";

export default async function AboutEmployer({ employer }: { employer: CompanyDetails | null }) {
  const t = await getTranslations();
  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white p-4 md:p-7 text-[#212529]">
      <h3 className="text-foreground mb-4 text-xl font-bold">
        {t("jobDetailsPage.about-the-employer")}
      </h3>
      <div className="border-border flex items-center gap-4 rounded-2xl border p-4">
        <Image
          src={employer?.image ?? "/assets/employer-image.svg"}
          alt={t("jobDetailsPage.employer-profile-card")}
          width={60}
          height={60}
          className="rounded-2xl w-15 h-13"
        />
        <div>
          <h3 className="text-lg font-semibold">{employer?.name}</h3>
          <p className="text-muted-foreground text-base">{employer?.domain?.title}</p>
        </div>
      </div>
      <p className="text-muted-foreground py-3 text-justify text-sm">
        {employer?.bio}
      </p>
      <Link
        href={`/shared-company-profile/${employer?.id}`}
        className={cn(
          `${buttonVariants({ variant: "outline", size: "pill", hoverStyle: "slidePrimary" })}`,
          "border-secondary mx-auto h-9 w-fit border px-5 py-2.5",
        )}
      >
        {t("jobDetailsPage.view-profile")}
      </Link>
    </div>
  );
}
