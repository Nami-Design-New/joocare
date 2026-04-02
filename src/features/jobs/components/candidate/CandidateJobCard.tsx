import { Link } from "@/i18n/navigation";
import { Badge } from "@/shared/components/ui/badge";
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
  Dot,
  LocationEdit,
  Share,
} from "lucide-react";
import Image from "next/image";

export default function CandidateJobCard({ appliedBadge }: { appliedBadge?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex gap-2 max-lg:px-2">
        <Image
          width={52}
          height={46}
          src="/assets/comp-logo.svg"
          alt="company logo"
        />
        <div className="flex grow flex-col gap-1">
          <h6 className="text-secondary text-lg font-semibold">
            Medical Approval
          </h6>
          <p className="text-foreground text-md font-normal">Health care</p>
          <time className="text-muted-foreground font normal text-xs">
            21 December 2026 , 4:00AM
          </time>
        </div>
        <p className="text-[12px]">Resume Match</p>
      </CardHeader>
      <CardContent className="max-lg:px-2">
        <div className="border-b-border flex flex-col gap-4 border-b pb-4">
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
          <div className="text-muted-foreground text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </div>{" "}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 max-lg:px-2">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="pill"
              className="border-border text-muted-foreground h-9 px-4 py-2 text-sm"
            >
              <Bookmark /> Save
            </Button>
            <Button
              variant="outline"
              size="pill"
              className="border-border text-muted-foreground h-9 px-4 py-2 text-sm"
            >
              <Share /> Share
            </Button>
          </div>
          <Link
            className={`border-border bg-primary flex h-9 items-center gap-2 rounded-full px-3 py-2 text-sm text-white`}
            href="/jobs/mediacl-job"
          >
            View Job
            <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
          </Link>
        </div>
        {appliedBadge && (
          <Badge
            variant="open"
            size="pill"
            className="flex w-full justify-start gap-1"
          >
            <Dot className="h-4 w-4" strokeWidth={12} /> <span>Applied</span>
            <span className="grow text-end text-xs text-muted-foreground">21 December 2026 , 4:00AM</span>
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
