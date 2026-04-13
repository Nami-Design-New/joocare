import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getCompanyDashboardService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await apiFetch(`${getCompanyApiUrl()}/dashboard`, {
        method: "GET",
        locale,
        token,
    });
    // console.log("res dashboard", res);

    return res.data?.data;
}