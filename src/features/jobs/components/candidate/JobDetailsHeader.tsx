import { Badge } from "@/shared/components/ui/badge";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import CandidateJobDetailsCardActions from "./CandidateJobDetailsCardActions";

export default function JobDetailsHeader() {
  return (
    <section className="flex flex-col lg:items-center justify-between rounded-2xl bg-white p-4 lg:flex-row">
      <div className="flex items-center gap-2 lg:gap-6">
        <Image
          src="/assets/comp-logo.svg"
          alt={`company logo`}
          width={96}
          height={86}
        />
        <div>
          <h6 className="text-foreground flex items-center gap-4 text-2xl font-semibold">
            <span className="max-md:text-[16px]">
              {" "}
              Senior Specialist Physician{" "}
            </span>
            <span className="bg-accent text-primary flex items-center gap-1 rounded-[12px] p-2 text-sm font-semibold">
              <Sparkles size={16} /> 90 %
            </span>
          </h6>
          <div className="flex items-center gap-2 max-lg:mt-2">
            <div className="text-muted-foreground text-lg font-normal">
              <span> at Health care </span>
            </div>
            <Badge size="md" className="rounded-sm bg-[#0BA02C]">
              FULL-TIME
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">14 Jun, 2026</p>
        </div>
      </div>

      <CandidateJobDetailsCardActions />
    </section>
  );
}
