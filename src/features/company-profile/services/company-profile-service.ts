import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getCompanyProfileService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await apiFetch(`${getCompanyApiUrl()}/auth/profile`, {
        method: "GET",
        locale,
        token,
    });

    return res.data?.data?.company;
}