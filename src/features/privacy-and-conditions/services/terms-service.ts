import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type termsPolicy = {
  terms: string
};

export const termsService = async () => {
  const { data, ok, message } = await apiFetch<termsPolicy>(
    `${getBaseApiUrl()}/terms`,
    {
      method: "GET",
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to fetch terms policy");
  }

  return data?.data ?? null;
};
