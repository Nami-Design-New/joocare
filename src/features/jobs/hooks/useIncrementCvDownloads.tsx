import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { incrementCvDownloads } from "../services/increment-cv-downloads-service";

export function useIncrementCvDownloads({ token }: { token: string }) {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => incrementCvDownloads({ token, id }),
    onError: (error) => {
      toast.error(error.message ?? "Failed to increment downloads");
    },
  });
}

