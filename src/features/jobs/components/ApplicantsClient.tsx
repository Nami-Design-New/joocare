"use client";

import { useState } from "react";
import ApplicantsTable from "@/features/jobs/components/Applicantstable";
import CVModal from "@/features/jobs/components/CVModal";
import { Applicant } from "@/features/jobs/types/index.types";

type Props = {
  applicants: Applicant[];
};

export default function ApplicantsClient({ applicants }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpen(true);
  };
  console.log("application", applicants);

  return (
    <>
      <ApplicantsTable
        applicants={applicants}
        onView={handleView}
        onDownload={(applicant) => {
          if (!applicant.cvUrl) return;
          window.open(applicant.cvUrl, "_blank", "noopener,noreferrer");
        }}
      />

      <CVModal
        open={open}
        onOpenChange={setOpen}
        title={"View Cv"}
        pdfUrl={selectedApplicant?.cvUrl}
      />
    </>
  );
}
