import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobStepOnePayload } from "../types/job-steps.types";

export async function jobStepOneService(
    payload: JobStepOnePayload,
    { token }: { token: string }
) {
    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs-step-one`,
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
