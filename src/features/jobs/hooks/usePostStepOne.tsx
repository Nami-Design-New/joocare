import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { JobStepOnePayload } from "../types/job-steps.types";
import { jobStepOneService } from "../services/job-step-one-service";

export const usePostStepOne = ({ token }: { token: string }) => {
    return useMutation({
        mutationFn: (payload: JobStepOnePayload) => jobStepOneService(payload, { token }),
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
