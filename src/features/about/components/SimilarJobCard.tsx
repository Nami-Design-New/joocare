import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  DollarSign,
  LocationEdit,
  Share,
  Sparkles,
  Timer,
} from "lucide-react";
import Image from "next/image";

export default function SimilarJobCard() {
  return (
    <Card className="gap-2">
      <CardHeader className="flex gap-2">
        <Image
          width={52}
          height={46}
          src="/assets/comp-logo.svg"
          alt="company logo"
        />
        <div className="flex grow flex-col gap-1">
          <p className="text-foreground text-md font-normal">Health care</p>
          <time className="text-muted-foreground font normal text-xs">
            21 December 2026 , 4:00AM
          </time>
        </div>
        <span className="bg-accent text-primary flex items-center gap-1 rounded-[12px] p-2 text-sm font-semibold">
          <Sparkles size={16} /> 90 %
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <ul className="items-cente flex gap-2">
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <LocationEdit size={14} color="var(--muted-foreground)" />
              cairo,Egypt
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <Briefcase size={14} color="var(--muted-foreground)" />
              Pharmce{" "}
            </li>
            <li className="text-secondary flex items-center gap-1 text-sm font-normal">
              <DollarSign size={14} color="var(--muted-foreground)" />
              4000$ : 10000${" "}
            </li>
          </ul>
          <ul className="items-cente flex gap-2">
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              +3 Exp
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              Full time
            </li>
            <li className="text-muted-foreground bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs font-normal">
              Pharmaceutical
            </li>
          </ul>
          <div className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </div>{" "}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-foreground flex items-center gap-1 text-sm">
          <Timer size={16} /> 2 hours ago
        </p>
      </CardFooter>
    </Card>
  );
}
