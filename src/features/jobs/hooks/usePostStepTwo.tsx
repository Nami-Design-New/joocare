import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobStepTwoService } from "../services/job-step-two-service";
import { JobStepTwoPayload } from "../types/job-steps.types";

export const usePostStepTwo = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: ({ jobId, payload }: { jobId: number; payload: JobStepTwoPayload }) =>
            jobStepTwoService(jobId, payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
