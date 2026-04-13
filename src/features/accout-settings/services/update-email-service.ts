import { apiFetch, type ApiResult } from "@/shared/lib/fetch-manager";
import { UpdateBasicInfoPayload } from "../types";

export async function updateEmailService(
    payload: UpdateBasicInfoPayload,
    { token }: { token: string },
): Promise<ApiResult> {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/auth/update-email`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            token: token,
        }
    );

    if (!response.ok) {
        throw new Error(response.message ?? "Failed to update basic info");
    }
    return response;
}
