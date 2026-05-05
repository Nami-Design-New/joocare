import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobStepThreePayload } from "../types/job-steps.types";

export async function jobStepThreeService(
    jobId: number,
    payload: JobStepThreePayload,
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs-step-three/${jobId}`,
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
        throw new Error(response.message ?? "Failed to submit step three");
    }

    return response;
}
