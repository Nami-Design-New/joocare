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
      <Image src={logoSrc} alt={`${company} logo`} width={96} height={86} />
      <div>
        <h6 className="text-foreground text-2xl font-semibold">{title}</h6>
        <p className="flex items-center gap-2">
          <span className="text-muted-foreground text-lg font-normal">
            at {company}
          </span>
          <Badge size="md" className="rounded-sm bg-[#0BA02C]">
            {employmentType}
          </Badge>
        </p>
      </div>
    </div>
  );
}
