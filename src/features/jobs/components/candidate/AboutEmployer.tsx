import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { CompanyDetails } from "../../types/jobs.types";

export default function AboutEmployer({ employer }: { employer: CompanyDetails }) {
  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white p-7 text-[#212529]">
      <h3 className="text-foreground mb-4 text-xl font-bold">
        About the employer
      </h3>
      <div className="border-border flex items-center gap-4 rounded-2xl border p-4">
        <Image
          src={employer?.image ?? "/assets/employer-image.svg"}
          alt="Empoyer provile card"
          width={60}
          height={60}
        />
        <div>
          <h3 className="text-lg font-semibold">{employer?.name}</h3>
          <p className="text-muted-foreground text-base">{employer.domain.title}</p>
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
        View Profile
      </Link>
    </div>
  );
}
