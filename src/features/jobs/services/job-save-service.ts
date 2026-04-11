"use client";

import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type ToggleSavedJobOptions = {
  jobId: number;
  token: string;
  locale: string;
};

export type ToggleSavedJobResponse = {
  code?: number;
  message?: string;
};

export async function toggleSavedJobService({
  jobId,
  token,
  locale,
}: ToggleSavedJobOptions): Promise<ToggleSavedJobResponse> {
  const formData = new FormData();
  formData.append("_method", "put");

  const result = await apiFetch<ToggleSavedJobResponse>(
    `${getUserApiUrl()}/jobs/${jobId}`,
    {
      method: "POST",
      token,
      locale,
      body: formData,
      cache: "no-store",
    },
  );

  if (!result.ok) {
    throw new Error(result.message || "Failed to update saved job.");
  }

  return result.data ?? {};
}
