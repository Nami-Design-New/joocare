import { getCompanyApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function incrementCvDownloads({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  const res = await apiFetch(`${getCompanyApiUrl()}/increment_downloads/${id}`, {
    method: "POST",
    token,
  });

  if (!res.ok) {
    throw new Error(res.message ?? "Failed to increment downloads");
  }

  return res;
}

