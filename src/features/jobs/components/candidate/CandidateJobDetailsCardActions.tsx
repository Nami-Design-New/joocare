import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Bookmark } from "lucide-react";
import React from "react";

export default function CandidateJobDetailsCardActions() {
  return (
    <section className="flex items-center gap-4">
      <Button
        size="icon"
        className="bg-accent text-primary h-13 w-13 rounded-[4px] p-4"
      >
        <Bookmark size={24} />
      </Button>
      <Button size="pill" className="flex items-center gap-2">
        {/* <Bookmark size={24} /> */}
        Apply Now <ArrowRight />
      </Button>
    </section>
  );
}
