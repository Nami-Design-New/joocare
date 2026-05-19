import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { TCompanyProfileViewModel } from "../types";

export async function getCompanyProfileService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}): Promise<TCompanyProfileViewModel | undefined> {
    const res = await apiFetch(`${getCompanyApiUrl()}/auth/profile`, {
        method: "GET",
        locale,
        token,
    });

    const company = (res.data?.data?.company ?? undefined) as
        | TCompanyProfileViewModel
        | undefined;

    if (!company) return undefined;

    return {
        ...company,
        unread_notifications_count: company.unread_notifications_count ?? 0,
    };
}
