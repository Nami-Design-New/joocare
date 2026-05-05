import { apiFetch, type ApiResult } from "@/shared/lib/fetch-manager";

export async function deleteImageUserService(
    { token }: { token: string },
): Promise<ApiResult> {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_USER_URL}/auth/delete-image`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            token: token,
        }
    );

    if (!response.ok) {
        throw new Error(response.message ?? "Failed to delete image");
    }
    return response;
}
