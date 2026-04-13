import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/shared/lib/fetch-manager";
import { JobDetails } from "../types/jobs.types";

type JobResponse = {
  data: {
    job: JobDetails;
  };
  message: string;
};

/**
 * Client-side hook to fetch a single company job by ID.
 * Used by the PostJobForm to hydrate form data in "complete" and "edit" modes.
 */
export function useGetCompanyJob(jobId: number | string | null) {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  return useQuery({
    queryKey: ["company-job", jobId],
    queryFn: async () => {
      const result = await apiFetch<JobResponse>(
        `${process.env.NEXT_PUBLIC_BASE_COMPANY_URL}/jobs/${jobId}`,
        {
          method: "GET",
          token,
        }
      );

      if (!result.ok || !result.data) {
        throw new Error(result.message || "Failed to fetch job details");
      }

      // Handle nested data structure: result.data can be { data: { job } } or { job }
      const jobData =
        (result.data as any)?.data?.job ??
        (result.data as any)?.job ??
        null;

      if (!jobData) {
        throw new Error("Job data is missing from response");
      }

      return jobData as JobDetails;
    },
    enabled: !!jobId && !!token,
    staleTime: 0,
  });
}
