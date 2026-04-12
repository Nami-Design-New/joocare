import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { CandidateApplicationItem, CandidateApplicationsResponse } from "../types/jobs.types";

const APPLICATIONS_PAGE_SIZE = 10;

export async function getJobManagementService(
  page: number,
  locale: string,
): Promise<CandidateApplicationsResponse> {
  const session = await getServerSession(authOptions);
  const params = new URLSearchParams({
    pagination: "on",
    limit_per_page: String(APPLICATIONS_PAGE_SIZE),
    page: String(page),
  });

  const result = await apiFetch<CandidateApplicationItem[]>(
    `${getCompanyApiUrl()}/jobs?${params.toString()}`,
    {
      method: "GET",
      locale,
      token: session?.accessToken,
      cache: "no-store",
    },
  );

  if (!result.ok || !result.data) {
    throw new Error(result.message || "Failed to load applications.");
  }

  const response = result.data as CandidateApplicationsResponse;

  if (!response?.data) {
    throw new Error("Applications payload is missing.");
  }

  return response;
}
