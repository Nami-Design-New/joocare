
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobDetailsResponse } from "../types/jobs.types";



// ==============================
// SERVICE
// ==============================

export async function getJobDetails(slug: number | string): Promise<{
    job: JobDetailsResponse["data"]["job"];
    similar_jobs: JobDetailsResponse["data"]["similar_jobs"];
}> {
    const session = await getServerSession(authOptions);

    const result = await apiFetch<JobDetailsResponse["data"]>(
        `${getUserApiUrl()}/jobs/${slug}`,
        {
            method: "GET",
            token: session?.accessToken,
            cache: "no-store",
        }
    );

    if (!result.ok || !result.data) {
        throw new Error(result.message || "Failed to fetch job details");
    }

    const jobDetails = result.data.data;

    if (!jobDetails) {
        throw new Error("Job details payload is missing");
    }

    return jobDetails;
}
