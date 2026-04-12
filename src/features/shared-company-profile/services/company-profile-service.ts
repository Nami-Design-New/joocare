import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { createHttpStatusError } from "@/shared/lib/http-error";
import { getLocale } from "next-intl/server";
import { CompanyJobsResponse, CompanyProfileApiResponse } from "../company-profile.type";
import { buildCompanyJobsSearchParams, FetchCompanyJobsPageOptions } from "../utils/company-jobs-utils";


export async function getCompanyProfile(slug: string): Promise<CompanyProfileApiResponse["data"]> {
    const locale = await getLocale();
    const response = await fetch(`${getUserApiUrl()}/companies/${slug}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": locale,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw createHttpStatusError(response.status, "Can not fetch Company profile");
    }
    const payload = (await response.json()) as CompanyProfileApiResponse;
    const companyProfile = payload.data;

    if (!companyProfile) {
        throw new Error("company profile  payload is missing");
    }

    return companyProfile;
}

export async function fetchCompanyJobsPageServer({
    slug,
    locale,
    page = 1,
}: FetchCompanyJobsPageOptions): Promise<CompanyJobsResponse> {
    const params = buildCompanyJobsSearchParams(page);
    const response = await fetch(
        `${getUserApiUrl()}/companies/${slug}/jobs?${params.toString()}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": locale,
            },
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw createHttpStatusError(
            response.status,
            "Can not fetch jobs for selected Company profile",
        );
    }

    const payload = (await response.json()) as CompanyJobsResponse;

    if (!payload?.data) {
        throw new Error("jobs payload is missing");
    }

    return payload;
}

export async function fetchCompanyJobsPageClient({
    slug,
    locale,
    page = 1,
}: FetchCompanyJobsPageOptions): Promise<CompanyJobsResponse> {
    const params = buildCompanyJobsSearchParams(page);
    const response = await fetch(`${getUserApiUrl()}/companies/${slug}/jobs?${params.toString()}`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": locale,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw createHttpStatusError(
            response.status,
            "Can not fetch jobs for selected Company profile",
        );
    }

    const payload = (await response.json()) as CompanyJobsResponse;

    return payload;
}
