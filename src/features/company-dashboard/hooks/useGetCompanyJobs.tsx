import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { CompanyJob } from "@/features/company-dashboard/index.type";
import { useQuery } from "@tanstack/react-query";

interface JobsPage {
    data: CompanyJob[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    per_page: number;
    total: number;
}

export default function useGetCompanyJobs({ token, page }: { token: string, page: number }) {
    const query = useQuery({
        queryKey: ["company-jobs-table", page],
        queryFn: async (): Promise<JobsPage> => {
            const params = new URLSearchParams({
                page: String(page),
                pagination: "on",
                limit_per_page: "2",
            });

            const res = await apiFetch(
                `${getCompanyApiUrl()}/my-jobs?${params.toString()}`,
                { method: "GET", token }
            );

            if (!res.ok) throw new Error("Network error");

            if (res.data?.code !== 200) throw new Error(res.data?.message || "Something went wrong");

            return res?.data;
        },
        enabled: !!token,
    });

    return {
        ...query,
        jobs: query.data?.data ?? [],
        total: query.data?.total ?? 0,
    };
}