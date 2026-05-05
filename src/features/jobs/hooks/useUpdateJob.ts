import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateJobService, UpdateJobPayload } from "../services/job-update-service";

export const useUpdateJob = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: number | string; payload: UpdateJobPayload }) =>
      updateJobService(jobId, payload, { token }),
    onSuccess: (res) => {
      queryClient.refetchQueries({ queryKey: ['company-jobs'] });
      // toast.success(res.message ?? "Job updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
