import { Badge } from "@/shared/components/ui/badge";
import Image from "next/image";

export type positionCardProps = {
  logoSrc: string;
  title: string;
  company: string;
  employmentType: string;
};

export default function PositionCard({
  logoSrc,
  company,
  title,
  employmentType,
}: positionCardProps) {
  return (
    <div className="flex items-center gap-6">
      <Image src={logoSrc} alt={`${company} logo`} width={96} height={86} className="rounded-2xl w-24 h-22" />
      <div>
        <h6 className="text-foreground text-2xl font-semibold mb-1">{title}</h6>
        <p className="flex items-center gap-2">
          <span className="text-muted-foreground text-base font-normal">
            at {company}
          </span>
          <Badge size="sm" className="rounded-sm bg-[#0BA02C]">
            {employmentType}
          </Badge>
        </p>
      </div>
    </div>
  );
}
