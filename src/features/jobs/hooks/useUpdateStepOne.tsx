import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { JobStepOnePayload } from "../types/job-steps.types";
import { jobUpdateStepOneService } from "../services/job-update-step-one-service";

type UpdateStepOneParams = {
  jobId: number | string;
  payload: JobStepOnePayload;
};

export const useUpdateStepOne = ({ token }: { token: string }) => {
  return useMutation({
    mutationFn: ({ jobId, payload }: UpdateStepOneParams) =>
      jobUpdateStepOneService(jobId, payload, { token }),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
