import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { getCompanyApiUrl, getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { createHttpStatusError } from "@/shared/lib/http-error";
import { JobDetailsResponse } from "../types/jobs.types";

export const JOB_DETAILS_REVALIDATE = 300;


// ==============================
// SERVICE
// ==============================

function normalizeJobDetailsPayload(jobDetails: JobDetailsResponse["data"]) {
    const job = jobDetails.job;
    const normalizedEducationLevel = job.education_level ?? null;
    // console.log("job in job details service ::::::::: .t s", job);

    return {
        job: {
            ...job,
            company: job.company ?? null,
            job_title: job.job_title ?? null,
            license: job.license ?? null,
            specialty_title: job.specialty_title ?? null,
            employment_type: job.employment_type ?? null,
            role_category: job.role_category ?? null,
            category: job.category ?? null,
            seniority_level: job.seniority_level ?? null,
            country: job.country ?? null,
            city: job.city ?? null,
            experience: job.experience ?? null,
            education_level: normalizedEducationLevel,
            eduction_level: normalizedEducationLevel,
            availability: job.availability ?? null,
            currency: job.currency ?? null,
            salary_type: job.salary_type ?? null,
            skills: Array.isArray(job.skills) ? job.skills : [],
            mandatory_certifications: Array.isArray(job.mandatory_certifications)
                ? job.mandatory_certifications
                : [],
            current_status: job.current_status ?? null,
            applications: Array.isArray(job.applications) ? job.applications : [],
            is_applied: Boolean(job.is_applied),
            is_saved: Boolean(job.is_saved),
        },
        similar_jobs: Array.isArray(jobDetails.similar_jobs) ? jobDetails.similar_jobs : [],
    };
}

async function fetchJobDetailsWithOptions({
    url,
    locale,
    token,
    cache,
    next,
}: {
    url: string;
    locale: string;
    token?: string;
    cache: RequestCache;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}) {
    const result = await apiFetch<JobDetailsResponse["data"]>(url, {
        method: "GET",
        token,
        locale,
        cache,
        next,
    });

    if (!result.ok || !result.data) {
        throw createHttpStatusError(
            result.statusCode,
            result.message || "Failed to fetch job details",
        );
    }

    const jobDetails = result.data.data;

    if (!jobDetails) {
        throw new Error("Job details payload is missing");
    }

    return normalizeJobDetailsPayload(jobDetails);
}

export const getPublicJobDetailsCached = cache(
    async (slug: number | string, locale: string) => {
        return fetchJobDetailsWithOptions({
            url: `${getUserApiUrl()}/jobs/${slug}`,
            locale,
            cache: "force-cache",
            next: {
                revalidate: JOB_DETAILS_REVALIDATE,
            },
        });
    },
);

export async function getAuthenticatedJobDetails(
    slug: number | string,
    locale: string,
    token?: string,
): Promise<{
    job: JobDetailsResponse["data"]["job"];
    similar_jobs: NonNullable<JobDetailsResponse["data"]["similar_jobs"]>;
}> {
    return fetchJobDetailsWithOptions({
        url: `${getUserApiUrl()}/jobs/${slug}`,
        locale,
        token,
        cache: "no-store",
    });
}

export async function getCompanyJobDetails(
    slug: number | string,
    locale: string,
): Promise<{
    job: JobDetailsResponse["data"]["job"];
    similar_jobs: NonNullable<JobDetailsResponse["data"]["similar_jobs"]>;
}> {
    const session = await getServerSession(authOptions);

    return fetchJobDetailsWithOptions({
        url: `${getCompanyApiUrl()}/jobs/${slug}`,
        locale,
        token: session?.accessToken,
        cache: "no-store",
    });
}
