import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getBusinessVerificationService({
  token,
  locale,
}: {
  token: string;
  locale: string;
}) {
  const { data, ok, message } = await apiFetch(
    `${getCompanyApiUrl()}/data/update-profile`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load business verification.");
  }

  return data?.data;
}
