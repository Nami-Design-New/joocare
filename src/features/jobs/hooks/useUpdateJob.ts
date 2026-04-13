import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateJobService, UpdateJobPayload } from "../services/job-update-service";

export const useUpdateJob = ({ token }: { token: string }) => {
  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: number | string; payload: UpdateJobPayload }) =>
      updateJobService(jobId, payload, { token }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Job updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
