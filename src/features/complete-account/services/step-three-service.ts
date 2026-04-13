import { apiFetch } from "@/shared/lib/fetch-manager";

export async function stepThreeService(
    payload: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        snapchat?: string;
        website?: string;
        phone: string;
        phone_code: string;
        country_id: number;
        city_id: number;
        established_date: string;
        bio: string;
    },
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/auth/setup-company-profile`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token,
        }
    );
    console.log("payload step three ", payload);
    console.log("response step three ", response); if (!response.ok) {
        throw new Error(response.message ?? "Failed to update bio");
    }

    return response;
}