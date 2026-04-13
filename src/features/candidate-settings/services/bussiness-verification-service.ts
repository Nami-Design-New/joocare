import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getBusinessVerificationService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await fetch(`${getCompanyApiUrl()}/data/update-profile`, {
        method: "GET",
        headers: {
            "Accept-Language": locale,
            Authorization: `Bearer ${token}`,
        },
    });
    const payload = await res.json();
    console.log("bussiness verification", payload);

    return payload?.data;
}