"use client";

import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type CompanyJobStatus = "open" | "paused" | "closed";

type UpdateCompanyJobStatusOptions = {
  jobId: number | string;
  status: CompanyJobStatus;
  token: string;
  locale: string;
};

type UpdateCompanyJobStatusResponse = {
  code?: number;
  message?: string;
};

export async function updateCompanyJobStatusService({
  jobId,
  status,
  token,
  locale,
}: UpdateCompanyJobStatusOptions): Promise<UpdateCompanyJobStatusResponse> {
  const formData = new FormData();
  formData.append("status", status);

  const result = await apiFetch<UpdateCompanyJobStatusResponse>(
    `${getCompanyApiUrl()}/jobs/${jobId}/status`,
    {
      method: "POST",
      token,
      locale,
      body: formData,
      cache: "no-store",
    },
  );

  if (!result.ok) {
    throw new Error(result.message || "Failed to update job status.");
  }

  return result.data ?? {};
}
