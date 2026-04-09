import { apiFetch } from "@/shared/lib/fetch-manager";

export async function deleteSocialLinksService(
    payload: { social: string },
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/auth/social-media`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token,
        }
    );

    if (!response.ok) {
        throw new Error(response.message ?? "Failed to update bio");
    }

    return response;
}