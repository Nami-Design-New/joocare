import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { useQuery } from "@tanstack/react-query";

export type ApplicationCandidate = {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
        phone_code: string;
    };
    job_id: number;
    cv: string | null;
    created_at: string;
    updated_at: string;
};

export interface ApplicationsCandidatesPage {
    data: ApplicationCandidate[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type ApplicationsCandidatesFilters = {
    search?: string;
    country?: string;
    medicalLicense?: string;
    recent?: string;
};

type UseGetApplicationsCandidatesParams = {
    token: string;
    page: number;
    slug: number;
    filters?: ApplicationsCandidatesFilters;
    initialData?: ApplicationsCandidatesPage;
};

export default function useGetApplicationsCandidates({
    token,
    page,
    slug,
    filters,
    initialData,
}: UseGetApplicationsCandidatesParams) {
    const normalizedFilters = {
        search: filters?.search?.trim() ?? "",
        country: filters?.country ?? "",
        medicalLicense: filters?.medicalLicense ?? "",
        recent: filters?.recent ?? "",
    };

    const query = useQuery({
        queryKey: [
            "application-candidates",
            slug,
            page,
            normalizedFilters.search,
            normalizedFilters.country,
            normalizedFilters.medicalLicense,
            normalizedFilters.recent,
        ],
        queryFn: async (): Promise<ApplicationsCandidatesPage> => {
            const params = new URLSearchParams({
                page: String(page),
                pagination: "on",
                limit_per_page: "10",
            });

            if (normalizedFilters.country) {
                params.set("country", normalizedFilters.country);
            }

            if (normalizedFilters.medicalLicense) {
                params.set("medical_license", normalizedFilters.medicalLicense);
            }

            if (normalizedFilters.recent) {
                params.set("recent", normalizedFilters.recent);
            }

            if (normalizedFilters.search) {
                params.set("search", normalizedFilters.search);
            }

            const res = await apiFetch(
                `${getCompanyApiUrl()}/applications/${slug}?${params.toString()}`,
                { method: "GET", token }
            );

            if (!res.ok) throw new Error("Network error");

            if (res.data?.code !== 200) throw new Error(res.data?.message || "Something went wrong");

            return res.data as ApplicationsCandidatesPage;
        },
        enabled: !!token && Number.isFinite(slug),
        placeholderData: initialData,
    });

    return {
        ...query,
        candidates: query.data?.data ?? [],
        total: query.data?.total ?? 0,
        perPage: query.data?.per_page ?? 10,
        lastPage: query.data?.last_page ?? 1,
    };
}
