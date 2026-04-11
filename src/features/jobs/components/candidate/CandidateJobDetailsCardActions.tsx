"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { ApplyNowModal } from "../ApplyNowModal";
import ToggleSavedJobButton from "./ToggleSavedJobButton";

export default function CandidateJobDetailsCardActions({
  jobId,
  initialIsSaved,
  isApplied,
}: {
  jobId: number;
  initialIsSaved: boolean;
  isApplied: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(isApplied);
  return (<>
    <ApplyNowModal
      open={open}
      onOpenChange={setOpen}
      jobId={jobId}
      onApplySuccess={() => setHasApplied(true)}
    />
    <section className="flex items-center gap-4 max-lg:mt-2">
      <ToggleSavedJobButton
        jobId={jobId}
        initialIsSaved={initialIsSaved}
        variant="icon"
      />
      {hasApplied ? (
        <Button
          type="button"
          variant="outline"
          size="pill"
          disabled
          className="border-primary text-primary hover:bg-transparent flex-1 cursor-not-allowed border bg-white"
        >
          Already Applied
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          size="pill"
          className="flex flex-1 items-center gap-2"
        >
          Apply Now <ArrowRight />
        </Button>
      )}
    </section>

  </>
  );
}
