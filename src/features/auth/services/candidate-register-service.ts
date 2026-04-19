
import { getUserApiUrl } from "@/shared/lib/api-endpoints";

type RegisterCandidatePayload = {
    name: string;
    email: string;
    phone: string;
    phone_code: string;
    job_title_id?: string;
    title?: string;
    country_id: string;
    city_id: string;
    password: string;
    has_medical_license: boolean | undefined;
    license_country_id: string;
    license_title: string | undefined;
    license_number: string | undefined;
    cv: string | undefined;
    license: string | undefined;
};

export const registerCandidateService = async (data: RegisterCandidatePayload) => {
    const response = await fetch(`${getUserApiUrl()}/auth/register`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;

};

