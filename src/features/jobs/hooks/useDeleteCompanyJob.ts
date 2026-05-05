"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { deleteCompanyJobService } from "../services/company-job-delete-service";

type UseDeleteCompanyJobOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
};

export function useDeleteCompanyJob(
  jobId: number | string | undefined,
  options: UseDeleteCompanyJobOptions = {},
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const { redirectTo, onSuccess } = options;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!jobId) {
        throw new Error("Job id is missing.");
      }

      if (!session?.accessToken || session.authRole !== "employer") {
        throw new Error("Only company accounts can delete jobs.");
      }

      return deleteCompanyJobService({
        jobId,
        token: session.accessToken,
        locale,
      });
    },
    onSuccess: (response) => {
      toast.success(response.message || "Job deleted successfully.");
      void queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      onSuccess?.();

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete job.");
    },
  });

  return {
    deleteJob: mutation.mutate,
    isPending: mutation.isPending,
  };
}
