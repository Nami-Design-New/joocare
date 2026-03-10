import { Link } from "@/i18n/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  ArrowRight,
  Briefcase,
  CheckCheck,
  CircleEllipsis,
  DollarSign,
  Dot,
  Edit,
  EyeOff,
  LocationEdit,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function JobCard() {
  return (
    <Card>
      <CardHeader className="flex gap-2">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleEllipsis color="var(--muted-foreground)" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex gap-2">
              <Edit /> <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2">
              <CheckCheck /> <span>closed</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2">
              <EyeOff /> <span>Pause</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive flex gap-2">
              <Trash2 color="var(--destructive)" /> <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
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
          <div className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </div>{" "}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <Link
            className={`grow ${buttonVariants({
              variant: "secondary",
              size: "pill",
            })}`}
            href="/candidates"
          >
            View Candidates 280
          </Link>
          <Link
            className={`flex items-center gap-2 ${buttonVariants({
              variant: "default",
              size: "pill",
            })}`}
            href="/1"
          >
            View Details
            <ArrowRight size={18} strokeWidth={1.5} className="size-5" />
          </Link>
        </div>
        <Badge
          variant="open"
          size="md"
          className="flex w-full justify-start gap-1"
        >
          <Dot className="h-4 w-4" strokeWidth={12} /> <span>Open</span>
          <span className="grow text-end">21 December 2026 , 4:00AM</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}
