import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobStepTwoPayload } from "../types/job-steps.types";

export async function jobStepTwoService(
    jobId: number,
    payload: JobStepTwoPayload,
    { token }: { token: string }
) {
    const formData = new FormData();
    formData.append("description", payload.description);
    payload.skills.forEach((skillId, index) => {
        formData.append(`skills[${index}]`, String(skillId));
    });

    const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs-step-two/${jobId}`,
        {
            method: "POST",
            body: formData,
            token,
        }
    );

    if (!response.ok) {
        throw new Error(response.message ?? "Failed to submit step two");
    }

    return response;
}
