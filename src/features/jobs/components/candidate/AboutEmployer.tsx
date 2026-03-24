import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

export default function AboutEmployer() {
  return (
    <div className="card font-noto-sans col-span-2 rounded-2xl bg-white p-7 text-[#212529]">
      <h3 className="text-foreground mb-4 text-xl font-bold">
        About the employer
      </h3>
      <div className="border-border flex items-center gap-4 rounded-2xl border p-4">
        <Image
          src="/assets/employer-image.svg"
          alt="Empoyer provile card"
          width={60}
          height={60}
        />
        <div>
          <h3 className="text-lg font-semibold">Saudi German Hospital </h3>
          <p className="text-muted-foreground text-base">Hospital</p>
        </div>
      </div>
      <p className="text-muted-foreground py-3 text-justify text-sm">
        Saudi German Hospitals is the leading healthcare provider and the number
        one healthcare brand in the MENA region. Saudi German Hospital – Egypt
        is part of the renowned SGH Group, founded in 1988 by the El Batterji
        family. Today, the group operates 14 hospitals across 4 countries:
        Egypt, Saudi Arabia, the UAE, and Yemen. As a tertiary care hospital,
        SGH–Egypt aspires to be a premier healthcare destination and an employer
        of choice, attracting top medical talent from across the region, the
        hospital is committed to establishing itself as one of Egypt’s leading
        tertiary care institutions SGH–Egypt will provide a comprehensive range
        of medical services, covering all specialties, sub-specialties, and
        critical care units, all delivered in line with the highest
        international healthcare standards.
      </p>
      <Link
        href="/company-profile/dddddd"
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
