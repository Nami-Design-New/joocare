"use client";

import { useState } from "react";
import ApplicantsTable from "@/features/jobs/components/Applicantstable";
import CVModal from "@/features/jobs/components/CVModal";
import { toast } from "sonner";
import { useIncrementCvDownloads } from "../hooks/useIncrementCvDownloads";
import { Applicant } from "../types/index.types";

type Props = {
  applicants: Applicant[];
  token: string;
};

const getDownloadFileName = (applicant: Applicant) => {
  const cvUrl = applicant.cvUrl ?? "";
  const urlPath = cvUrl.split("?")[0];
  const extension = urlPath.includes(".")
    ? `.${urlPath.split(".").pop() ?? "pdf"}`
    : ".pdf";

  const safeName = (applicant.name || "candidate-cv")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return `${safeName || "candidate-cv"}${extension}`;
};

export default function ApplicantsClient({ applicants, token }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [downloadingApplicantId, setDownloadingApplicantId] = useState<
    number | null
  >(null);
  const { mutateAsync: incrementDownloads } = useIncrementCvDownloads({ token });

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setOpen(true);
  };

  const handleDownload = async (applicant: Applicant) => {
    if (!applicant.cvUrl) return;

    try {
      setDownloadingApplicantId(applicant.id);
      await incrementDownloads({ id: applicant.id });
      const params = new URLSearchParams({
        url: applicant.cvUrl,
        filename: getDownloadFileName(applicant),
      });
      const response = await fetch(`/api/download-cv?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to download CV");
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = getDownloadFileName(applicant);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download CV",
      );
    } finally {
      setDownloadingApplicantId(null);
    }
  };
  console.log("application", applicants);

  return (
    <>
      <ApplicantsTable
        applicants={applicants}
        onView={handleView}
        onDownload={handleDownload}
        downloadingApplicantId={downloadingApplicantId}
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
