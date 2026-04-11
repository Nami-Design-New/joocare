"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { ApplyNowModal } from "../ApplyNowModal";
import ToggleSavedJobButton from "./ToggleSavedJobButton";

export default function CandidateJobDetailsCardActions({
  jobId,
  initialIsSaved,
}: {
  jobId: number;
  initialIsSaved: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (<>
    <ApplyNowModal open={open} onOpenChange={setOpen} />
    <section className="flex items-center gap-4 max-lg:mt-2">
      <ToggleSavedJobButton
        jobId={jobId}
        initialIsSaved={initialIsSaved}
        variant="icon"
      />
      <Button
        onClick={() => setOpen(true)}
        size="pill" className="flex items-center gap-2 flex-1">
        {/* <Bookmark size={24} /> */}
        Apply Now <ArrowRight />
      </Button>
    </section>

  </>
  );
}
