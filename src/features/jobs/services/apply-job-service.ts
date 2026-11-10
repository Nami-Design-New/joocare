"use client";

import { CandidateProfileApiUser } from "@/features/candidate-profile/types/profile.types";
import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { ScreeningAnswer } from "../types/job-apply.types";

type CandidateCvProfile = {
  cv: string | null;
};

type GetCandidateCvOptions = {
  token: string;
  locale: string;
};

type ApplyToJobOptions = {
  jobId: number;
  cvPath?: string | null;
  answers?: ScreeningAnswer[];
  token: string;
  locale: string;
};

type ApplyToJobResponse = {
  message?: string;
};

function normalizeStoredCvPath(cvPath: string) {
  const trimmedPath = cvPath.trim();

  if (!trimmedPath) {
    return "";
  }

  const imagesIndex = trimmedPath.indexOf("images/");

  if (imagesIndex >= 0) {
    return trimmedPath.slice(imagesIndex);
  }

  return trimmedPath;
}

export async function getCandidateCvProfile({
  token,
  locale,
}: GetCandidateCvOptions): Promise<CandidateCvProfile> {
  const result = await apiFetch<CandidateProfileApiUser>(
    `${getUserApiUrl()}/auth/profile`,
    {
      method: "GET",
      token,
      locale,
      cache: "no-store",
    },
  );

  if (!result.ok || !result.data?.data) {
    throw new Error(result.message || "Failed to load candidate profile.");
  }

  return {
    cv: result.data.data.cv ?? null,
  };
}

export async function applyToJobService({
  jobId,
  cvPath,
  answers,
  token,
  locale,
}: ApplyToJobOptions): Promise<ApplyToJobResponse> {
  const formData = new FormData();
  formData.append("job_id", String(jobId));

  if (cvPath) {
    formData.append("cv", normalizeStoredCvPath(cvPath));
  }

  // Pending backend contract for screening answers.
  if (answers?.length) {
    formData.append("screening_answers", JSON.stringify(answers));
  }

  const result = await apiFetch<ApplyToJobResponse>(
    `${getUserApiUrl()}/jobs`,
    {
      method: "POST",
      token,
      locale,
      body: formData,
      cache: "no-store",
    },
  );

  if (!result.ok) {
    throw new Error(result.message || "Failed to submit your application.");
  }

  return result.data ?? {};
}
