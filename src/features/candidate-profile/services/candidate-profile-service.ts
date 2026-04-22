import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getCandidateProfileService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await apiFetch(`${getUserApiUrl()}/auth/profile`, {
        method: "GET",
        locale,
        token,
    });

    return res.data?.data?.user;
}