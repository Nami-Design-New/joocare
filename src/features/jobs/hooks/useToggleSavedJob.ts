"use client";

import type { InfiniteData, QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CompanyJobsResponse } from "@/features/shared-company-profile/company-profile.type";
import { toggleSavedJobService } from "../services/job-save-service";

type JobsInfiniteData = InfiniteData<CompanyJobsResponse>;

function patchInfiniteJobsSavedState(
  data: JobsInfiniteData | undefined,
  jobId: number,
  nextSavedState: boolean,
) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: page.data.map((job) =>
        job.id === jobId ? { ...job, is_saved: nextSavedState } : job,
      ),
    })),
  } satisfies JobsInfiniteData;
}

type UseToggleSavedJobOptions = {
  onSavedChange?: (nextSavedState: boolean) => void;
  onAuthRequired?: () => void;
};

export function useToggleSavedJob(
  jobId: number,
  initialIsSaved: boolean,
  options: UseToggleSavedJobOptions = {},
) {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const locale = useLocale();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const { onSavedChange, onAuthRequired } = options;

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved, jobId]);

  const mutation = useMutation({
    mutationFn: async (nextSavedState: boolean) => {
      if (!session?.accessToken || session.authRole !== "candidate") {
        throw new Error("Please log in as a candidate to save jobs.");
      }

      await toggleSavedJobService({
        jobId,
        token: session.accessToken,
        locale,
      });

      return nextSavedState;
    },
    onMutate: async (nextSavedState) => {
      setIsSaved(nextSavedState);
      onSavedChange?.(nextSavedState);

      const snapshots = queryClient.getQueriesData<JobsInfiniteData>({
        queryKey: ["shared-company-profile-jobs"],
      });

      snapshots.forEach(([queryKey]) => {
        queryClient.setQueryData<JobsInfiniteData>(queryKey, (currentData) =>
          patchInfiniteJobsSavedState(currentData, jobId, nextSavedState),
        );
      });

      return {
        previousIsSaved: !nextSavedState,
        snapshots,
      };
    },
    onError: (error, _nextSavedState, context) => {
      setIsSaved(context?.previousIsSaved ?? initialIsSaved);
      onSavedChange?.(context?.previousIsSaved ?? initialIsSaved);

      context?.snapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as QueryKey, data);
      });

      toast.error(error.message || "Failed to update saved job.");
    },
  });

  function toggleSaved() {
    if (mutation.isPending) {
      return;
    }

    if (status === "loading") {
      toast.error("Please wait a moment and try again.");
      return;
    }

    if (!session?.accessToken || session.authRole !== "candidate") {
      onAuthRequired?.();
      return;
    }

    mutation.mutate(!isSaved);
  }

  return {
    isSaved,
    toggleSaved,
    isPending: mutation.isPending,
  };
}
