"use client";

import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

type DeleteCompanyJobOptions = {
  jobId: number | string;
  token: string;
  locale: string;
};

type DeleteCompanyJobResponse = {
  code?: number;
  message?: string;
};

export async function deleteCompanyJobService({
  jobId,
  token,
  locale,
}: DeleteCompanyJobOptions): Promise<DeleteCompanyJobResponse> {
  const result = await apiFetch<DeleteCompanyJobResponse>(
    `${getCompanyApiUrl()}/jobs/${jobId}`,
    {
      method: "DELETE",
      token,
      locale,
      cache: "no-store",
    },
  );

  if (!result.ok) {
    throw new Error(result.message || "Failed to delete job.");
  }

  return result.data ?? {};
}
