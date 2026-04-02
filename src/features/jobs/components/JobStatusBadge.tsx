import { Badge } from "@/shared/components/ui/badge";
import { Dot } from "lucide-react";
import { JobStatus } from "../index.types";

export default function JobStatusBadge({
  status,
  closingDate,
}: {
  status: JobStatus;
  closingDate: string;
}) {
  return (
    <Badge
      variant={status}
      size="pill"
      className="flex w-full items-center justify-start gap-1"
    >
      <Dot className="h-4 w-4" strokeWidth={12} />
      <span className="capitalize">{status}</span>
      <span className="grow text-end">{closingDate}</span>
    </Badge>
  );
}
