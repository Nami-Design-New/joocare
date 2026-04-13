import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { useQuery } from "@tanstack/react-query";
import { JobListItem } from "../types/jobs.types";

export type ManagedCompanyJob = JobListItem & {
    status: {
        status: string;
        created_at: string;
    };
};

export interface JobsPage {
    data: ManagedCompanyJob[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    per_page: number;
    total: number;
}

type UseGetCompanyJobsParams = {
    token: string;
    page: number;
    status?: string;
    initialData?: JobsPage;
};

export default function useGetCompanyJobs({
    token,
    page,
    status = "",
    initialData,
}: UseGetCompanyJobsParams) {
    const query = useQuery({
        queryKey: ["company-jobs", page, status],
        queryFn: async (): Promise<JobsPage> => {
            const params = new URLSearchParams({
                page: String(page),
                pagination: "on",
                limit_per_page: "10",
            });

            if (status) {
                params.set("status", status);
            }

            const res = await apiFetch(
                `${getCompanyApiUrl()}/jobs?${params.toString()}`,
                { method: "GET", token }
            );

            if (!res.ok || !res.data) {
                throw new Error(res.message || "Something went wrong");
            }

            return res.data as JobsPage;
        },
        enabled: !!token,
        placeholderData: initialData,

    });

    return {
        ...query,
        jobs: query.data?.data ?? [],
        total: query.data?.total ?? 0,
        perPage: query.data?.per_page ?? 10,
        lastPage: query.data?.last_page ?? 1,
    };
}
