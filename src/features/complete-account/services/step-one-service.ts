import { apiFetch } from "@/shared/lib/fetch-manager";

export async function stepOneService(
    payload: {
        name: string;
        email: string;
        domain_id: string;
        person_name: string;
        person_phone: string;
        person_phone_code: string;
    },
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/auth/setup-account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token,
        }
    );
    console.log("payload step one ", payload);
    console.log("response step one ", response);
    if (!response.ok) {
        throw new Error(response.message ?? "Failed to update bio");
    }

    return response;
}