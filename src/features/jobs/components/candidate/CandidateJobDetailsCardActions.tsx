"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Bookmark } from "lucide-react";
import React, { useState } from "react";
import { ApplyNowModal } from "../ApplyNowModal";

export default function CandidateJobDetailsCardActions() {
  const [open, setOpen] = useState(false);
  return (<>
    <ApplyNowModal open={open} onOpenChange={setOpen} />
    <section className="flex items-center gap-4 max-lg:mt-2">
      <Button
        size="icon"
        className="bg-accent text-primary h-13 w-13 rounded-[4px] p-4"
      >
        <Bookmark size={24} />
      </Button>
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
