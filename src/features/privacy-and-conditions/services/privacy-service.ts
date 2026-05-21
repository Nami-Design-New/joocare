import { getBaseApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type PrivacyPolicy = {
  privacy: string
};

export const privacyService = async (locale: string) => {
  const { data, ok, message } = await apiFetch<PrivacyPolicy>(
    `${getBaseApiUrl()}/privacy`,
    {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 300 },
      locale
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to fetch privacy policy");
  }

  return data?.data ?? null;
};
