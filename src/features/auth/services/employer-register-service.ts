import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { getTimeZone } from "@/shared/lib/fetch-manager";

export type RegisterEmployerPayload = {
    name: string;
    email: string;
    domain_id: number;
    password: string;
    person_name: string;
    person_phone: string;
    person_phone_code: string;
};

export const registerEmployerService = async (
    data: RegisterEmployerPayload,
    locale: string = "en",
) => {
    const response = await fetch(`${getCompanyApiUrl()}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Timezone": getTimeZone(),
            "Accept-Language": locale,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};
