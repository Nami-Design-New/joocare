import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { incrementCvDownloads } from "../services/increment-cv-downloads-service";

export function useIncrementCvDownloads({ token }: { token: string }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => incrementCvDownloads({ token, id }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["company-dashboard"] });

    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to increment downloads");
    },
  });
}

